import {createHash,createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import type {Prisma,PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {EmployeeProfile,PeopleWorkspace} from '../../../../shared/contracts/people';
import type {PeopleRepository} from '../application/employees';
import type {EmployeeInput} from '../domain/employee';
import {displayName} from '../domain/employee';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {InstitutionEvidenceWriter} from '../../tenancy/contracts/index';

type Guard={configurationVersion:number};
const canonical=(value:unknown):string=>Array.isArray(value)?`[${value.map(canonical).join(',')}]`:value&&typeof value==='object'?`{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`:JSON.stringify(value);
const hash=(value:unknown)=>createHash('sha256').update(canonical(value)).digest('hex');
const dateText=(value:Date)=>value.toISOString().slice(0,10);
const fail=(error:unknown):never=>{if(error instanceof AccessError)throw error;const value=error as {code?:string;meta?:{driverAdapterError?:{cause?:{kind?:string}}}};if(value.code==='P2002')throw new AccessError('CONFLICT');if(value.code==='P2003')throw new AccessError('NOT_FOUND');if(value.code==='P2034'||value.code==='40001'||value.code==='40P01'||value.code==='P2010'&&value.meta?.driverAdapterError?.cause?.kind==='TransactionWriteConflict')throw new AccessError('STALE_VERSION');throw new AccessError('UNAVAILABLE');};
type Cursor={organizationId:string;schoolId:string;accountId:string;search:string;staffNumber:string;employeeId:string};
function sign(value:string,secret:string){return createHmac('sha256',secret).update(value).digest('base64url');}
function encodeCursor(value:Cursor,secret:string){const payload=Buffer.from(JSON.stringify(value)).toString('base64url');return `${payload}.${sign(payload,secret)}`;}
function decodeCursor(cursor:string|null,expected:Omit<Cursor,'staffNumber'|'employeeId'>,secret:string):Pick<Cursor,'staffNumber'|'employeeId'>|null{
 if(!cursor)return null;if(secret.length<32)throw new AccessError('UNAVAILABLE');const [payload,signature,...extra]=cursor.split('.');if(!payload||!signature||extra.length||!/^[A-Za-z0-9_-]{43}$/.test(signature))throw new AccessError('INVALID_CURSOR');const expectedSignature=sign(payload,secret);if(!timingSafeEqual(Buffer.from(signature),Buffer.from(expectedSignature)))throw new AccessError('INVALID_CURSOR');
 try{const value=JSON.parse(Buffer.from(payload,'base64url').toString('utf8')) as Cursor;if(value.organizationId!==expected.organizationId||value.schoolId!==expected.schoolId||value.accountId!==expected.accountId||value.search!==expected.search||typeof value.staffNumber!=='string'||typeof value.employeeId!=='string')throw new Error();return {staffNumber:value.staffNumber,employeeId:value.employeeId};}catch{throw new AccessError('INVALID_CURSOR');}
}
function dto(row:{id:string;version:number;staffNumber:string;employedFrom:Date;employedTo:Date|null;status:string;person:{id:string;firstName:string;lastName:string;accountBinding:{account:{status:string;memberships:{id:string}[]}}|null}}):EmployeeProfile{
 const binding=row.person.accountBinding,portalAccess=!binding?'UNLINKED':binding.account.status==='ACTIVE'&&binding.account.memberships.length?'ACTIVE':'LINKED';
 return {employeeId:row.id,version:row.version,staffNumber:row.staffNumber,person:{id:row.person.id,displayName:displayName(row.person.firstName,row.person.lastName)},employment:{from:dateText(row.employedFrom),to:row.employedTo?dateText(row.employedTo):null,status:row.status as 'ACTIVE'|'ENDED'},portalAccess};
}
export class PrismaPeopleRepository implements PeopleRepository{
 constructor(private readonly db:PrismaClient,private readonly evidence:(tx:Prisma.TransactionClient)=>InstitutionEvidenceWriter,private readonly now:()=>Date=()=>new Date(),private readonly cursorSecret=''){}
 private async guard(tx:Prisma.TransactionClient,actor:Identity,organizationId:string,schoolId:string,lock:boolean):Promise<Guard>{
  if(lock)await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${actor.accountId}::uuid FOR UPDATE`;
  const account=await tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}});if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(lock)await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${organizationId}::uuid FOR UPDATE`;
  const organization=await tx.organization.findFirst({where:{id:organizationId,status:'ACTIVE'},select:{id:true}});if(!organization)throw new AccessError('NOT_FOUND');
  if(lock)await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${organizationId}::uuid AND id=${schoolId}::uuid FOR UPDATE`;
  const school=await tx.school.findFirst({where:{organizationId,id:schoolId,status:'ACTIVE'},select:{configurationVersion:true}});if(!school)throw new AccessError('NOT_FOUND');
  const membership=await tx.schoolMembership.findFirst({where:{accountId:actor.accountId,organizationId,schoolId,status:'ACTIVE'},select:{grants:{select:{code:true}}}});if(!membership)throw new AccessError('FORBIDDEN');
  if(!capabilitiesFor(membership.grants.map(grant=>grant.code as 'SCHOOL_ADMIN'|'TEACHER')).includes('class.manage'))throw new AccessError('FORBIDDEN');return {configurationVersion:school.configurationVersion};
 }
 async listEmployees(actor:Identity,organizationId:string,schoolId:string,query:{search:string;cursor:string|null;limit:number}):Promise<PeopleWorkspace>{try{return await this.db.$transaction(async tx=>{
  if(this.cursorSecret.length<32)throw new AccessError('UNAVAILABLE');
  await this.guard(tx,actor,organizationId,schoolId,false);
  const scope={organizationId,schoolId,accountId:actor.accountId,search:query.search},last=decodeCursor(query.cursor,scope,this.cursorSecret),where:Prisma.EmployeeWhereInput={organizationId,schoolId,...(query.search?{OR:[{staffNumber:{contains:query.search,mode:'insensitive'}},{person:{firstName:{contains:query.search,mode:'insensitive'}}},{person:{lastName:{contains:query.search,mode:'insensitive'}}}]}:{}),...(last?{AND:[{OR:[{staffNumber:{gt:last.staffNumber}},{staffNumber:last.staffNumber,id:{gt:last.employeeId}}]}]}:{})};
  const rows=await tx.employee.findMany({where,orderBy:[{staffNumber:'asc'},{id:'asc'}],take:query.limit+1,include:{person:{include:{accountBinding:{include:{account:{select:{status:true,memberships:{where:{organizationId,schoolId,status:'ACTIVE',grants:{some:{code:{in:['SCHOOL_ADMIN','TEACHER']}}}},select:{id:true}}}}}}}}}}),hasMore=rows.length>query.limit,items=rows.slice(0,query.limit);
  const nextCursor=hasMore&&items.length?encodeCursor({...scope,staffNumber:items.at(-1)!.staffNumber,employeeId:items.at(-1)!.id},this.cursorSecret):null;return {employees:items.map(dto),nextCursor};
 },{isolationLevel:'RepeatableRead',timeout:10000,maxWait:10000});}catch(error){return fail(error);}}
 async createEmployee(actor:Identity,organizationId:string,schoolId:string,input:EmployeeInput&{key:string}):Promise<EmployeeProfile&{replayed:boolean}>{try{return await this.db.$transaction(async tx=>{
  const guard=await this.guard(tx,actor,organizationId,schoolId,true),command='EmployeeCreated',inputHash=hash({schemaVersion:1,organizationId,schoolId,actorAccountId:actor.accountId,...input}),prior=await tx.tenantCommandReceipt.findUnique({where:{organizationId_actorAccountId_command_key:{organizationId,actorAccountId:actor.accountId,command,key:input.key}}});
  if(prior){if(prior.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');return {...prior.response as EmployeeProfile,replayed:true};}
  if(await tx.employee.findFirst({where:{organizationId,schoolId,staffNumber:input.staffNumber},select:{id:true}}))throw new AccessError('CONFLICT');
  const personId=randomUUID(),employeeId=randomUUID(),now=this.now();
  const person=await tx.person.create({data:{id:personId,organizationId,firstName:input.firstName,lastName:input.lastName,contactEmail:input.contactEmail,version:1,createdAt:now}});
  const employee=await tx.employee.create({data:{id:employeeId,organizationId,schoolId,personId,staffNumber:input.staffNumber,employedFrom:new Date(`${input.employedFrom}T00:00:00.000Z`),employedTo:null,status:'ACTIVE',version:1}});
  const result={...dto({...employee,person:{id:person.id,firstName:person.firstName,lastName:person.lastName,accountBinding:null}}),replayed:false},next=guard.configurationVersion+1,changed=await tx.school.updateMany({where:{organizationId,id:schoolId,configurationVersion:guard.configurationVersion},data:{configurationVersion:next,version:{increment:1}}});if(changed.count!==1)throw new AccessError('STALE_VERSION');
  const occurredAt=now.toISOString(),requestId=randomUUID();
  await this.evidence(tx).append({organizationId,schoolId,actorAccountId:actor.accountId,command,key:input.key,inputHash,response:result,expectedRevision:guard.configurationVersion,newRevision:next,reason:'Create staff profile',requestId,occurredAt,changes:{schemaVersion:1,principalKind:'ACCOUNT',resourceId:employeeId,version:1,status:'ACTIVE'}});
  await tx.tenantOutbox.create({data:{id:randomUUID(),organizationId,type:'PersonRegistered.v1',schemaVersion:1,payload:{schemaVersion:1,principalKind:'ACCOUNT',resourceId:personId,version:1},occurredAt,state:'PENDING',attempts:0,availableAt:occurredAt}});
  return result;
 },{isolationLevel:'Serializable',timeout:15000,maxWait:10000});}catch(error){return fail(error);}}
}
