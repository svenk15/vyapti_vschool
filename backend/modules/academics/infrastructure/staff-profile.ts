import type {PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {StaffProfileAcademics} from '../../../../shared/contracts/people';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {StaffAcademicsProfilePort} from '../contracts/staff-profile';

const civil=(value:Date)=>value.toISOString().slice(0,10);
export class PrismaStaffAcademicsProfile implements StaffAcademicsProfilePort{
 constructor(private readonly db:PrismaClient,private readonly manifest:ReleaseManifest,private readonly databaseContext:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}
 async read(actor:Identity,input:{organizationId:string;schoolId:string;employeeId:string}):Promise<StaffProfileAcademics>{try{return await this.db.$transaction(async tx=>{
  await this.databaseContext.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:input.organizationId,branchId:input.schoolId});
  const [account,organization,school,membership]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.organization.findFirst({where:{id:input.organizationId,status:'ACTIVE'},select:{id:true}}),
   tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId,status:'ACTIVE'},select:{timezone:true}}),
   tx.schoolMembership.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}}),
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!organization||!school)throw new AccessError('NOT_FOUND');
  if(!membership||!capabilitiesFor(membership.grants.map(grant=>grant.code as 'SCHOOL_ADMIN'|'TEACHER')).includes('class.manage'))throw new AccessError('FORBIDDEN');
  const at=this.now(),entitlement=await tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId:input.organizationId,moduleId:'academic_core'}}}),activation=await tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId:input.organizationId,schoolId:input.schoolId,moduleId:'academic_core'}}});
  if(!this.manifest.academic_core)throw new AccessError('RELEASE_UNAVAILABLE');
  if(!entitlement||entitlement.state!=='ACTIVE'||entitlement.startsAt>at||(entitlement.endsAt!==null&&entitlement.endsAt<=at))throw new AccessError('MODULE_NOT_LICENSED');
  if(!activation||activation.state!=='ACTIVE')throw new AccessError('MODULE_DISABLED');
  const teacher=await tx.teacher.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,employeeId:input.employeeId},include:{eligibilityPeriods:{orderBy:{version:'desc'},take:21},assignments:{orderBy:[{validFrom:'desc'},{id:'desc'}],take:101,include:{offering:{include:{subject:{select:{name:true}},section:{select:{name:true}}}}}}}});
  if(!teacher)return {teacherId:null,teacherVersion:0,eligibility:'NOT_ENABLED',eligibilityPeriod:null,eligibilityHistory:[],assignments:[]};
  if(teacher.assignments.length>100||teacher.eligibilityPeriods.length>20)throw new AccessError('UNAVAILABLE');
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:school.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(at),day=new Date(`${today}T00:00:00Z`);
  const periods=teacher.eligibilityPeriods.map(item=>({id:item.id,version:item.version,validFrom:civil(item.validFrom),validTo:item.validTo?civil(item.validTo):null,reason:item.reason,recordedAt:item.recordedAt.toISOString(),current:item.supersededAt===null})),current=periods.find(item=>item.current)??null;
  return {teacherId:teacher.id,teacherVersion:teacher.version,eligibility:teacher.active?'ENABLED':'DISABLED',eligibilityPeriod:current,eligibilityHistory:periods,assignments:teacher.assignments.map(item=>({assignmentId:item.id,subjectName:item.offering.subject.name,sectionName:item.offering.section.name,validFrom:civil(item.validFrom),validTo:civil(item.validTo),current:item.validFrom<=day&&item.validTo>day}))};
 },{isolationLevel:'RepeatableRead',timeout:10000,maxWait:10000});}catch(error){if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');}}
}
