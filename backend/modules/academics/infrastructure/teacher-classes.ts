import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherAssignedClass,TeacherClassWorkspace} from '../../../../shared/contracts/teacher-classes';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {TeacherClassesRepository} from '../application/teacher-classes';
import type {TeacherClassRosterPort} from '../contracts/teacher-class-roster';

const atDate=(value:string)=>new Date(`${value}T00:00:00.000Z`),civil=(value:Date)=>value.toISOString().slice(0,10);
const fail=(error:unknown):never=>{if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');};

export class PrismaTeacherClassesRepository implements TeacherClassesRepository{
 constructor(private db:PrismaClient,private manifest:ReleaseManifest,private context:VerifiedDatabaseContextPort,private roster:TeacherClassRosterPort,private now:()=>Date=()=>new Date()){}
 private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string){
  await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId,branchId:schoolId});
  const [account,school,membership]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}}),
   tx.schoolMembership.findFirst({where:{organizationId,schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}})
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!school)throw new AccessError('NOT_FOUND');
  const capabilities=membership?capabilitiesFor(membership.grants.map(row=>row.code as 'SCHOOL_ADMIN'|'TEACHER')):[];
  if(!capabilities.includes('class.read')||!capabilities.includes('student.read'))throw new AccessError('FORBIDDEN');
  const modules=['academic_core','staff_core','student_core'] as const,now=this.now();
  if(!modules.every(moduleId=>this.manifest[moduleId]))throw new AccessError('RELEASE_UNAVAILABLE');
  const [entitlements,activations]=await Promise.all([
   tx.organizationEntitlement.findMany({where:{organizationId,moduleId:{in:[...modules]},state:'ACTIVE',startsAt:{lte:now},OR:[{endsAt:null},{endsAt:{gt:now}}]},select:{moduleId:true}}),
   tx.branchActivation.findMany({where:{organizationId,schoolId,moduleId:{in:[...modules]},state:'ACTIVE'},select:{moduleId:true}})
  ]);
  if(new Set(entitlements.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_NOT_LICENSED');
  if(new Set(activations.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_DISABLED');
  return school;
 }
 async workspace(actor:Identity,organizationId:string,schoolId:string,schoolDate:string,offeringId:string|null):Promise<TeacherClassWorkspace>{try{return await this.db.$transaction(async tx=>{
  const school=await this.guard(tx,actor,organizationId,schoolId),day=atDate(schoolDate),binding=await tx.accountPersonBinding.findFirst({where:{organizationId,accountId:actor.accountId},select:{personId:true}});
  if(!binding)throw new AccessError('FORBIDDEN');
  const teacher=await tx.teacher.findFirst({where:{organizationId,schoolId,active:true,employee:{personId:binding.personId,status:'ACTIVE',employedFrom:{lte:day},OR:[{employedTo:null},{employedTo:{gt:day}}]}},select:{id:true}});
  if(!teacher)throw new AccessError('FORBIDDEN');
  const assignments=await tx.teacherAssignment.findMany({where:{organizationId,schoolId,teacherId:teacher.id,validFrom:{lte:day},validTo:{gt:day},offering:{active:true,section:{active:true},year:{status:'OPEN',startsOn:{lte:day},endsOn:{gt:day}}}},orderBy:[{offering:{section:{name:'asc'}}},{offering:{subject:{name:'asc'}}}],take:101,include:{offering:{include:{section:{select:{id:true,name:true}},subject:{select:{name:true}},year:{select:{name:true}}}}}});
  if(assignments.length>100)throw new AccessError('VALIDATION');
  if(offeringId&&!assignments.some(row=>row.offeringId===offeringId))throw new AccessError('NOT_FOUND');
  const rosters=new Map<string,Awaited<ReturnType<TeacherClassRosterPort['list']>>>();
  for(const assignment of assignments){if(!rosters.has(assignment.offering.sectionId))rosters.set(assignment.offering.sectionId,await this.roster.list(tx,actor,{organizationId,schoolId,sectionId:assignment.offering.sectionId,schoolDate}));}
  const classes:TeacherAssignedClass[]=assignments.map(row=>({offeringId:row.offeringId,sectionId:row.offering.sectionId,className:row.offering.section.name,subjectName:row.offering.subject.name,academicYearName:row.offering.year.name,assignmentFrom:civil(row.validFrom),assignmentTo:civil(row.validTo),pupilCount:rosters.get(row.offering.sectionId)?.length??0}));
  const selectedClass=offeringId?classes.find(row=>row.offeringId===offeringId)??null:null;
  return {date:schoolDate,timezone:school.timezone,classes,selected:selectedClass?{...selectedClass,roster:rosters.get(selectedClass.sectionId)??[]}:null};
 },{isolationLevel:'RepeatableRead'});}catch(error){return fail(error);}}
}
