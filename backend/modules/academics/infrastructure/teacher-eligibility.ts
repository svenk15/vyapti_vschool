import {createHash,randomUUID} from 'node:crypto';
import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {TeacherEligibilityImpact,TeacherEligibilityPeriod,TeacherEligibilityPreview,TeacherEligibilityResult} from '../../../../shared/contracts/academics';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {InstitutionEvidenceWriter,ReleaseManifest,VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {TeacherEligibilityInput,TeacherEligibilityRepository} from '../application/teacher-eligibility';
import type {TeacherEligibilityAttendanceImpactPort,TeacherEligibilityEmployeeFactsPort} from '../contracts/teacher-eligibility';

const canonical=(value:unknown):string=>Array.isArray(value)?`[${value.map(canonical).join(',')}]`:value&&typeof value==='object'?`{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`:JSON.stringify(value);
const hash=(value:unknown)=>createHash('sha256').update(canonical(value)).digest('hex');
const civil=(value:Date)=>value.toISOString().slice(0,10);
type Guard={configurationVersion:number;timezone:string};
type Snapshot={employeeId:string;teacherId:string|null;teacherVersion:number;periodVersion:number;validFrom:string;validTo:string|null;blockingAssignments:TeacherEligibilityImpact[]};

export class PrismaTeacherEligibilityRepository implements TeacherEligibilityRepository {
 constructor(private readonly db:PrismaClient,private readonly manifest:ReleaseManifest,private readonly databaseContext:VerifiedDatabaseContextPort,private readonly employeeFacts:TeacherEligibilityEmployeeFactsPort,private readonly attendanceImpact:TeacherEligibilityAttendanceImpactPort,private readonly evidence:(tx:Prisma.TransactionClient)=>InstitutionEvidenceWriter,private readonly now:()=>Date=()=>new Date()){}
 private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string,lock:boolean):Promise<Guard>{
  await this.databaseContext.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId,branchId:schoolId});
  if(lock)await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${actor.accountId}::uuid FOR UPDATE`;
  const account=await tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}});if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(lock)await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${organizationId}::uuid FOR UPDATE`;
  if(!await tx.organization.findFirst({where:{id:organizationId,status:'ACTIVE'},select:{id:true}}))throw new AccessError('NOT_FOUND');
  if(lock)await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${organizationId}::uuid AND id=${schoolId}::uuid FOR UPDATE`;
  const school=await tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE'},select:{configurationVersion:true,timezone:true}});if(!school)throw new AccessError('NOT_FOUND');
  const membership=await tx.schoolMembership.findFirst({where:{organizationId,schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}});if(!membership||!capabilitiesFor(membership.grants.map(grant=>grant.code as 'SCHOOL_ADMIN'|'TEACHER')).includes('class.manage'))throw new AccessError('FORBIDDEN');
  const at=this.now(),entitlement=await tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId,moduleId:'academic_core'}}}),activation=await tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId,schoolId,moduleId:'academic_core'}}});
  if(!this.manifest.academic_core)throw new AccessError('RELEASE_UNAVAILABLE');
  if(!entitlement||entitlement.state!=='ACTIVE'||entitlement.startsAt>at||(entitlement.endsAt!==null&&entitlement.endsAt<=at))throw new AccessError('MODULE_NOT_LICENSED');
  if(!activation||activation.state!=='ACTIVE')throw new AccessError('MODULE_DISABLED');
  return school;
 }
 private async snapshot(tx:Prisma.TransactionClient,organizationId:string,schoolId:string,employeeId:string,guard:Guard,input:{expectedTeacherVersion:number;validFrom:string;validTo:string|null}):Promise<Snapshot>{
  const employee=await this.employeeFacts.read(tx,{organizationId,schoolId,employeeId});if(!employee)throw new AccessError('NOT_FOUND');
  if(employee.status!=='ACTIVE'||input.validFrom<employee.employedFrom||(employee.employedTo!==null&&(input.validTo===null||input.validTo>employee.employedTo)))throw new AccessError('CONFLICT');
  const teacher=await tx.teacher.findFirst({where:{organizationId,schoolId,employeeId},include:{eligibilityPeriods:{where:{supersededAt:null},take:2,orderBy:{version:'desc'}}}});
  if((teacher?.version??0)!==input.expectedTeacherVersion)throw new AccessError('STALE_VERSION');
  if(teacher&&teacher.eligibilityPeriods.length!==1)throw new AccessError('CONFLICT');
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:guard.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(this.now()),assignments=teacher?await tx.teacherAssignment.findMany({where:{organizationId,schoolId,teacherId:teacher.id,validTo:{gt:new Date(`${today}T00:00:00Z`)}},orderBy:[{validFrom:'asc'},{id:'asc'}],take:101,include:{offering:{include:{subject:{select:{name:true}},section:{select:{name:true,grade:{select:{name:true}}}}}}}}):[];
  if(assignments.length>100)throw new AccessError('UNAVAILABLE');
  const outside=assignments.filter(item=>civil(item.validFrom)<input.validFrom||(input.validTo!==null&&civil(item.validTo)>input.validTo)),frozen=new Set(await this.attendanceImpact.frozenAssignmentIds(tx,{organizationId,schoolId,assignmentIds:outside.map(item=>item.id)}));
  return {employeeId,teacherId:teacher?.id??null,teacherVersion:teacher?.version??0,periodVersion:teacher?.eligibilityPeriods[0]?.version??0,validFrom:input.validFrom,validTo:input.validTo,blockingAssignments:outside.map(item=>({assignmentId:item.id,subjectName:item.offering.subject.name,sectionName:`${item.offering.section.grade.name} ${item.offering.section.name}`,validFrom:civil(item.validFrom),validTo:civil(item.validTo),frozenAttendance:frozen.has(item.id)}))};
 }
 private previewOf(organizationId:string,schoolId:string,snapshot:Snapshot):TeacherEligibilityPreview{
  const reviewDigest=hash({schemaVersion:1,organizationId,schoolId,...snapshot});
  return {employeeId:snapshot.employeeId,teacherId:snapshot.teacherId,expectedTeacherVersion:snapshot.teacherVersion,validFrom:snapshot.validFrom,validTo:snapshot.validTo,ready:snapshot.blockingAssignments.length===0,blockingAssignments:snapshot.blockingAssignments,reviewDigest};
 }
 async preview(actor:Identity,organizationId:string,schoolId:string,employeeId:string,input:{expectedTeacherVersion:number;validFrom:string;validTo:string|null}){try{return await this.db.$transaction(async tx=>{const guard=await this.guard(tx,actor,organizationId,schoolId,false);return this.previewOf(organizationId,schoolId,await this.snapshot(tx,organizationId,schoolId,employeeId,guard,input));},{isolationLevel:'RepeatableRead',timeout:10000,maxWait:10000});}catch(error){if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');}}
 async set(actor:Identity,organizationId:string,schoolId:string,employeeId:string,input:TeacherEligibilityInput):Promise<TeacherEligibilityResult>{try{return await this.db.$transaction(async tx=>{
  const guard=await this.guard(tx,actor,organizationId,schoolId,true),command='TeacherEligibilitySet',inputHash=hash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,employeeId,...input}),prior=await tx.tenantCommandReceipt.findUnique({where:{organizationId_actorAccountId_command_key:{organizationId,actorAccountId:actor.accountId,command,key:input.key}}});
  if(prior){if(prior.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');return {...prior.response as Omit<TeacherEligibilityResult,'replayed'>,replayed:true};}
  const preview=this.previewOf(organizationId,schoolId,await this.snapshot(tx,organizationId,schoolId,employeeId,guard,input));if(preview.reviewDigest!==input.reviewDigest)throw new AccessError('STALE_VERSION');if(!preview.ready)throw new AccessError('CALENDAR_IN_USE');
  const at=this.now(),to=input.validTo?new Date(`${input.validTo}T00:00:00Z`):null,from=new Date(`${input.validFrom}T00:00:00Z`),active=to===null||to>new Date(`${new Intl.DateTimeFormat('en-CA',{timeZone:guard.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(at)}T00:00:00Z`);
  let teacherId=preview.teacherId,teacherVersion:number,periodVersion:number;
  if(teacherId===null){const teacher=await tx.teacher.create({data:{id:randomUUID(),organizationId,schoolId,employeeId,active,version:1}});teacherId=teacher.id;teacherVersion=1;periodVersion=1;}else{
   const changed=await tx.teacher.updateMany({where:{id:teacherId,organizationId,schoolId,version:input.expectedTeacherVersion},data:{active,version:{increment:1}}});if(changed.count!==1)throw new AccessError('STALE_VERSION');teacherVersion=input.expectedTeacherVersion+1;periodVersion=preview.teacherId?((await tx.teacherEligibilityPeriod.aggregate({where:{organizationId,schoolId,teacherId},_max:{version:true}}))._max.version??0)+1:1;
   const superseded=await tx.teacherEligibilityPeriod.updateMany({where:{organizationId,schoolId,teacherId,supersededAt:null},data:{supersededAt:at}});if(superseded.count!==1)throw new AccessError('STALE_VERSION');
  }
  const period=await tx.teacherEligibilityPeriod.create({data:{id:randomUUID(),organizationId,schoolId,teacherId,validFrom:from,validTo:to,version:periodVersion,reason:input.reason,recordedByAccountId:actor.accountId,recordedAt:at,source:'ADMIN'}}),periodDto:TeacherEligibilityPeriod={id:period.id,version:period.version,validFrom:civil(period.validFrom),validTo:period.validTo?civil(period.validTo):null,reason:period.reason,recordedAt:period.recordedAt.toISOString(),current:true},result:TeacherEligibilityResult={employeeId,teacherId,teacherVersion,period:periodDto,replayed:false};
  const next=guard.configurationVersion+1,changedSchool=await tx.school.updateMany({where:{organizationId,id:schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:next,version:{increment:1}}});if(changedSchool.count!==1)throw new AccessError('STALE_VERSION');
  await this.evidence(tx).append({organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key,inputHash,response:result,expectedRevision:guard.configurationVersion,newRevision:next,reason:input.reason,requestId:randomUUID(),occurredAt:at.toISOString(),changes:{schemaVersion:1,principalKind:'ACCOUNT',resourceId:teacherId,version:teacherVersion,status:active?'ACTIVE':'ENDED'}});
  return result;
 },{isolationLevel:'Serializable',timeout:15000,maxWait:10000});}catch(error){if(error instanceof AccessError)throw error;const code=(error as {code?:string}).code;if(code==='P2002'||code==='P2003')throw new AccessError('CONFLICT');if(code==='P2034'||code==='40001'||code==='40P01')throw new AccessError('STALE_VERSION');throw new AccessError('UNAVAILABLE');}}
}
