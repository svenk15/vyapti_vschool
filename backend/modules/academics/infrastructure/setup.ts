import {createHash,randomUUID} from 'node:crypto';
import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {AcademicCommandResult,AcademicSectionRecord,AcademicYearRecord,AcademicsWorkspace} from '../../../../shared/contracts/academics';
import type {AcademicSetupRepository,AcademicCapability} from '../application/setup';
import {validateTerms} from '../domain/setup';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest} from '../../tenancy/contracts/index';
import type {InstitutionEvidenceWriter} from "../../tenancy/contracts/index";

type Scope={organizationId:string;schoolId:string};
type Guard={scope:Scope;configurationVersion:number};
const canonical=(v:unknown):string=>Array.isArray(v)?`[${v.map(canonical).join(',')}]`:v&&typeof v==='object'?`{${Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>`${JSON.stringify(k)}:${canonical(x)}`).join(',')}}`:JSON.stringify(v);
const hash=(value:unknown)=>createHash('sha256').update(canonical(value)).digest('hex');
const dateText=(value:Date)=>value.toISOString().slice(0,10);
const fail=(error:unknown):never=>{if(error instanceof AccessError)throw error;const e=error as {code?:string;meta?:{driverAdapterError?:{cause?:{kind?:string}}}};if(e.code==='P2002'||e.code==='P2014')throw new AccessError('CONFLICT');if(e.code==='P2034'||e.code==='40001'||e.code==='40P01'||e.code==='P2010'&&e.meta?.driverAdapterError?.cause?.kind==='TransactionWriteConflict')throw new AccessError('STALE_VERSION');throw new AccessError('UNAVAILABLE');};
function yearDto(row:{id:string;version:number;code:string;name:string;startsOn:Date;endsOn:Date;status:string;terms:{id:string;code:string;name:string;startsOn:Date;endsOn:Date}[];calendar:{id:string}|null}):AcademicYearRecord{
 return {id:row.id,version:row.version,code:row.code,name:row.name,startsOn:dateText(row.startsOn),endsOn:dateText(row.endsOn),status:row.status as AcademicYearRecord['status'],calendarId:row.calendar?.id??'',terms:row.terms.map(t=>({id:t.id,code:t.code,name:t.name,startsOn:dateText(t.startsOn),endsOn:dateText(t.endsOn)}))};
}

export class PrismaAcademicSetupRepository implements AcademicSetupRepository{
 constructor(private readonly db:PrismaClient,private readonly evidence:(tx:Prisma.TransactionClient)=>InstitutionEvidenceWriter,private readonly manifest:ReleaseManifest,private readonly now:()=>Date=()=>new Date()){}
 private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string,needed:AcademicCapability[]=['school.manage','class.manage']):Promise<Guard>{
  await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${actor.accountId}::uuid FOR UPDATE`;
  const account=await tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}});if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${organizationId}::uuid FOR UPDATE`;
  const organization=await tx.organization.findFirst({where:{id:organizationId,status:'ACTIVE'}});if(!organization)throw new AccessError('NOT_FOUND');
  await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${organizationId}::uuid AND id=${schoolId}::uuid FOR UPDATE`;
  const school=await tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE'},select:{configurationVersion:true}});if(!school)throw new AccessError('NOT_FOUND');
  const membership=await tx.schoolMembership.findFirst({where:{accountId:actor.accountId,organizationId,schoolId,status:'ACTIVE'},select:{grants:{select:{code:true}}}});if(!membership)throw new AccessError('FORBIDDEN');
  const capabilities=capabilitiesFor(membership.grants.map(g=>g.code as 'SCHOOL_ADMIN'|'TEACHER'));if(needed.some(capability=>!capabilities.includes(capability)))throw new AccessError('FORBIDDEN');
  if(!this.manifest.academic_core)throw new AccessError('RELEASE_UNAVAILABLE');
  const now=this.now(),entitlement=await tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId,moduleId:'academic_core'}}}),activation=await tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId,schoolId,moduleId:'academic_core'}}});
  if(!entitlement||entitlement.state!=='ACTIVE'||entitlement.startsAt>now||(entitlement.endsAt!==null&&entitlement.endsAt<=now))throw new AccessError('MODULE_NOT_LICENSED');
  if(!activation||activation.state!=='ACTIVE')throw new AccessError('MODULE_DISABLED');
  return {scope:{organizationId,schoolId},configurationVersion:school.configurationVersion};
 }
 private async receipt(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,command:string,key:string,inputHash:string){const receipt=await tx.tenantCommandReceipt.findUnique({where:{organizationId_actorAccountId_command_key:{organizationId,actorAccountId:actor.accountId,command,key}}});if(!receipt)return null;if(receipt.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');return receipt.response as Record<string,unknown>;}
 private async revision(tx:Prisma.TransactionClient,actor:Identity,command:string,key:string,inputHash:string,result:Record<string,unknown>,guard:Guard,resourceId:string,version:number,status:string,reason:string){
  const next=guard.configurationVersion+1,changed=await tx.school.updateMany({where:{organizationId:guard.scope.organizationId,id:guard.scope.schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:next,version:{increment:1}}});if(changed.count!==1)throw new AccessError('STALE_VERSION');
  const occurredAt=this.now().toISOString();await this.evidence(tx).append({organizationId:guard.scope.organizationId,schoolId:guard.scope.schoolId,actorAccountId:actor.accountId,command,key,inputHash,response:result,expectedRevision:guard.configurationVersion,newRevision:next,reason,requestId:randomUUID(),occurredAt,changes:{schemaVersion:1,principalKind:'ACCOUNT',resourceId,version,status}});
 }
 async workspace(actor:Identity,organizationId:string,schoolId:string):Promise<AcademicsWorkspace>{try{return await this.db.$transaction(async tx=>{
  await this.guard(tx,actor,organizationId,schoolId);
  const [years,grades,subjects,campuses,sections]=await Promise.all([
   tx.academicYear.findMany({where:{organizationId,schoolId},orderBy:[{startsOn:'desc'},{code:'asc'}],include:{terms:{orderBy:[{startsOn:'asc'},{code:'asc'}]},calendar:{select:{id:true}}}}),
   tx.gradeLevel.findMany({where:{organizationId,schoolId,active:true},orderBy:[{sortOrder:'asc'},{code:'asc'}],select:{id:true,code:true,name:true,active:true}}),
   tx.subject.findMany({where:{organizationId,schoolId,active:true},orderBy:{code:'asc'},select:{id:true,code:true,name:true,active:true}}),
   tx.campus.findMany({where:{organizationId,schoolId,status:'ACTIVE'},orderBy:{code:'asc'},select:{id:true,code:true,name:true,status:true}}),
   tx.section.findMany({where:{organizationId,schoolId},orderBy:[{year:{startsOn:'desc'}},{grade:{sortOrder:'asc'}},{code:'asc'}],include:{year:{select:{id:true}},grade:{select:{name:true}},campus:{select:{name:true}}}}),
  ]);
  const sectionRecords:AcademicSectionRecord[]=sections.map(s=>({id:s.id,code:s.code,name:s.name,yearId:s.yearId,gradeId:s.gradeId,gradeName:s.grade.name,campusId:s.campusId,campusName:s.campus?.name??null,active:s.active}));
  return {years:years.map(yearDto),grades,subjects,campuses:campuses.map(c=>({id:c.id,code:c.code,name:c.name,active:true})),sections:sectionRecords};
 },{isolationLevel:'RepeatableRead',timeout:10000,maxWait:10000});}catch(e){return fail(e);}}
 async createYear(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;startsOn:string;endsOn:string;key:string;reason:string}){try{return await this.db.$transaction(async tx=>{
  const guard=await this.guard(tx,actor,organizationId,schoolId,['school.manage']),command='AcademicYearCreated',inputHash=hash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,...input});
  const prior=await this.receipt(tx,actor,organizationId,command,input.key,inputHash);if(prior)return {...prior,replayed:true} as AcademicCommandResult & {calendarId:string;status:'DRAFT'};
  if(await tx.academicYear.findFirst({where:{organizationId,schoolId,code:input.code},select:{id:true}}))throw new AccessError('CONFLICT');
  const id=randomUUID(),calendarId=randomUUID();await tx.academicYear.create({data:{id,organizationId,schoolId,code:input.code,name:input.name,startsOn:new Date(`${input.startsOn}T00:00:00.000Z`),endsOn:new Date(`${input.endsOn}T00:00:00.000Z`),status:'DRAFT',version:1}});
  await tx.schoolCalendar.create({data:{id:calendarId,organizationId,schoolId,yearId:id,currentRevisionId:null,version:1}});
  const result={id,version:1,code:input.code,name:input.name,replayed:false,calendarId,status:'DRAFT' as const};await this.revision(tx,actor,command,input.key,inputHash,result,guard,id,1,'DRAFT',input.reason);return result;
 },{isolationLevel:'Serializable',timeout:10000,maxWait:10000});}catch(e){return fail(e);}}
 async replaceTerms(actor:Identity,organizationId:string,schoolId:string,yearId:string,input:{expectedVersion:number;terms:{code:string;name:string;startsOn:string;endsOn:string}[];key:string;reason:string}){try{return await this.db.$transaction(async tx=>{
  const guard=await this.guard(tx,actor,organizationId,schoolId,['school.manage']),command='AcademicTermsReplaced',inputHash=hash({schemaVersion:1,organizationId,schoolId,yearId,actorAccountId:actor.accountId,...input}),prior=await this.receipt(tx,actor,organizationId,command,input.key,inputHash);if(prior)return {...prior,replayed:true} as {yearId:string;version:number;terms:AcademicsWorkspace['years'][number]['terms'];replayed:boolean};
  const year=await tx.academicYear.findFirst({where:{id:yearId,organizationId,schoolId}});if(!year)throw new AccessError('NOT_FOUND');if(year.version!==input.expectedVersion)throw new AccessError('STALE_VERSION');if(year.status!=='DRAFT')throw new AccessError('CONFLICT');
  const terms=validateTerms(input.terms,{startsOn:dateText(year.startsOn),endsOn:dateText(year.endsOn)});
  const changed=await tx.academicYear.updateMany({where:{id:yearId,organizationId,schoolId,version:input.expectedVersion,status:'DRAFT'},data:{version:{increment:1}}});if(changed.count!==1)throw new AccessError('STALE_VERSION');await tx.academicTerm.deleteMany({where:{organizationId,schoolId,yearId}});
  const rows=terms.map(term=>({id:randomUUID(),organizationId,schoolId,yearId,...term,startsOn:new Date(`${term.startsOn}T00:00:00.000Z`),endsOn:new Date(`${term.endsOn}T00:00:00.000Z`)}));if(rows.length)await tx.academicTerm.createMany({data:rows});
  const result={yearId,version:input.expectedVersion+1,terms:rows.map(t=>({id:t.id,code:t.code,name:t.name,startsOn:termDate(t.startsOn),endsOn:termDate(t.endsOn)})),replayed:false};await this.revision(tx,actor,command,input.key,inputHash,result,guard,yearId,result.version,'DRAFT',input.reason);return result;
 },{isolationLevel:'Serializable',timeout:10000,maxWait:10000});}catch(e){return fail(e);}}
 private async createCatalog<T extends AcademicCommandResult>(actor:Identity,organizationId:string,schoolId:string,command:string,input:{code:string;name:string;key:string;reason:string},work:(tx:Prisma.TransactionClient,id:string)=>Promise<T>):Promise<T>{try{return await this.db.$transaction(async tx=>{
  const guard=await this.guard(tx,actor,organizationId,schoolId,['class.manage']),inputHash=hash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,...input}),prior=await this.receipt(tx,actor,organizationId,command,input.key,inputHash);if(prior)return {...prior,replayed:true} as T;const result=await work(tx,randomUUID());await this.revision(tx,actor,command,input.key,inputHash,result,guard,result.id,result.version,'ACTIVE',input.reason);return result;
 },{isolationLevel:'Serializable',timeout:10000,maxWait:10000});}catch(e){return fail(e);}}
 async createGrade(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;key:string;reason:string}){return this.createCatalog(actor,organizationId,schoolId,'GradeLevelCreated',input,async(tx,id)=>{const last=await tx.gradeLevel.findFirst({where:{organizationId,schoolId},orderBy:{sortOrder:'desc'},select:{sortOrder:true}}),row=await tx.gradeLevel.create({data:{id,organizationId,schoolId,code:input.code,name:input.name,sortOrder:(last?.sortOrder??0)+1,active:true,version:1}});return {id:row.id,version:row.version,code:row.code,name:row.name,replayed:false};});}
 async createSubject(actor:Identity,organizationId:string,schoolId:string,input:{code:string;name:string;key:string;reason:string}){return this.createCatalog(actor,organizationId,schoolId,'AcademicSubjectCreated',input,async(tx,id)=>{const row=await tx.subject.create({data:{id,organizationId,schoolId,code:input.code,name:input.name,active:true,version:1}});return {id:row.id,version:row.version,code:row.code,name:row.name,replayed:false};});}
 async createSection(actor:Identity,organizationId:string,schoolId:string,input:{yearId:string;gradeId:string;campusId:string|null;code:string;name:string;key:string;reason:string}){try{return await this.db.$transaction(async tx=>{
  const guard=await this.guard(tx,actor,organizationId,schoolId,['class.manage']),command='AcademicSectionCreated',inputHash=hash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,...input}),prior=await this.receipt(tx,actor,organizationId,command,input.key,inputHash);if(prior)return {...prior,replayed:true} as AcademicCommandResult & {yearId:string;gradeId:string;campusId:string|null};
  const [year,grade,campus]=await Promise.all([tx.academicYear.findFirst({where:{id:input.yearId,organizationId,schoolId},select:{id:true,status:true}}),tx.gradeLevel.findFirst({where:{id:input.gradeId,organizationId,schoolId,active:true},select:{id:true}}),input.campusId?tx.campus.findFirst({where:{id:input.campusId,organizationId,schoolId,status:'ACTIVE'},select:{id:true}}):Promise.resolve({id:null})]);
  if(!year||!grade||input.campusId&&!campus)throw new AccessError('NOT_FOUND');
  if(year.status==='CLOSED')throw new AccessError('CONFLICT');
  const id=randomUUID(),row=await tx.section.create({data:{id,organizationId,schoolId,yearId:year.id,gradeId:grade.id,campusId:campus?.id??null,code:input.code,name:input.name,active:true,version:1}}),result={id:row.id,version:row.version,code:row.code,name:row.name,replayed:false,yearId:row.yearId,gradeId:row.gradeId,campusId:row.campusId};await this.revision(tx,actor,command,input.key,inputHash,result,guard,id,1,'ACTIVE',input.reason);return result;
 },{isolationLevel:'Serializable',timeout:10000,maxWait:10000});}catch(e){return fail(e);}}
}
function termDate(date:Date){return dateText(date);}
