import {createHash} from 'node:crypto';
import type {PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherReadiness,TeacherReadinessIssue} from '../../../../shared/contracts/teacher-readiness';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {TeacherReadinessRepository} from '../application/teacher-readiness';
import type {TeacherSessionReadinessPort} from '../contracts/teacher-session-readiness';

const atDate=(value:string)=>new Date(`${value}T00:00:00.000Z`);
const labels:Record<TeacherReadinessIssue,string>={NO_ACTIVE_ASSIGNMENT:'No active teaching assignment',TEACHER_ELIGIBILITY_NOT_READY:'Teacher eligibility not ready',SESSION_CHANGED_OR_CANCELLED:'Session changed or cancelled',READY:'No readiness issue'};
const localDate=(instant:Date,timeZone:string)=>new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(instant);
const fail=(error:unknown):never=>{if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');};

export class PrismaTeacherReadinessRepository implements TeacherReadinessRepository{
 constructor(private db:PrismaClient,private manifest:ReleaseManifest,private context:VerifiedDatabaseContextPort,private sessions:TeacherSessionReadinessPort,private now:()=>Date=()=>new Date()){}
 private reference(actor:Identity,organizationId:string,schoolId:string,date:string,issue:TeacherReadinessIssue){return `TEACH-SETUP-${createHash('sha256').update(`${organizationId}:${schoolId}:${actor.accountId}:${date}:${issue}`).digest('hex').slice(0,8).toUpperCase()}`;}
 async readiness(actor:Identity,organizationId:string,schoolId:string,schoolDate:string):Promise<TeacherReadiness>{try{return await this.db.$transaction(async tx=>{
  await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId,branchId:schoolId});
  const [account,school,membership]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE',organization:{status:'ACTIVE'}},select:{timezone:true}}),
   tx.schoolMembership.findFirst({where:{organizationId,schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}})
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!school)throw new AccessError('NOT_FOUND');
  const grants=membership?.grants.map(row=>row.code as 'SCHOOL_ADMIN'|'TEACHER')??[],capabilities=capabilitiesFor(grants);
  if(!grants.includes('TEACHER')||!capabilities.includes('self.read'))throw new AccessError('FORBIDDEN');
  if(schoolDate>localDate(this.now(),school.timezone))throw new AccessError('VALIDATION');
  const modules=['academic_core','staff_core','attendance'] as const,now=this.now();
  if(!modules.every(moduleId=>this.manifest[moduleId]))throw new AccessError('RELEASE_UNAVAILABLE');
  const [entitlements,activations]=await Promise.all([
   tx.organizationEntitlement.findMany({where:{organizationId,moduleId:{in:[...modules]},state:'ACTIVE',startsAt:{lte:now},OR:[{endsAt:null},{endsAt:{gt:now}}]},select:{moduleId:true}}),
   tx.branchActivation.findMany({where:{organizationId,schoolId,moduleId:{in:[...modules]},state:'ACTIVE'},select:{moduleId:true}})
  ]);
  if(new Set(entitlements.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_NOT_LICENSED');
  if(new Set(activations.map(row=>row.moduleId)).size!==modules.length)throw new AccessError('MODULE_DISABLED');
  const day=atDate(schoolDate),binding=await tx.accountPersonBinding.findFirst({where:{organizationId,accountId:actor.accountId},select:{personId:true}});
  let issue:TeacherReadinessIssue='TEACHER_ELIGIBILITY_NOT_READY',offeringIds:string[]=[];
  if(binding){
   const teacher=await tx.teacher.findFirst({where:{organizationId,schoolId,active:true,employee:{personId:binding.personId,status:'ACTIVE',employedFrom:{lte:day},OR:[{employedTo:null},{employedTo:{gt:day}}]}},select:{id:true}});
   if(teacher){
    const assignments=await tx.teacherAssignment.findMany({where:{organizationId,schoolId,teacherId:teacher.id,validFrom:{lte:day},validTo:{gt:day},offering:{active:true,section:{active:true},year:{status:'OPEN',startsOn:{lte:day},endsOn:{gt:day}}}},select:{offeringId:true},take:101});
    if(assignments.length>100)throw new AccessError('VALIDATION');
    offeringIds=assignments.map(row=>row.offeringId);
    issue=offeringIds.length?(await this.sessions.hasCurrentSession(tx,{organizationId,schoolId,offeringIds,schoolDate})?'READY':'SESSION_CHANGED_OR_CANCELLED'):'NO_ACTIVE_ASSIGNMENT';
   }
  }
  return {date:schoolDate,timezone:school.timezone,issue,issueLabel:labels[issue],supportReference:this.reference(actor,organizationId,schoolId,schoolDate,issue)};
 },{isolationLevel:'RepeatableRead'});}catch(error){return fail(error);}}
}
