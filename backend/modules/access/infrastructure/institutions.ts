import { createHash,randomUUID } from 'node:crypto';
import type { Prisma,PrismaClient } from '../../../../generated/prisma/client';
import type { Identity,OperatorPrincipal,RoleCode } from '../../../../shared/contracts/access';
import type { BranchInput,ContextDirectory,InstitutionCommand,InstitutionResult,SwitchedContext } from '../../../../shared/contracts/tenancy';
import type { InstitutionRepository } from '../application/institutions';
import type { InstitutionEvidenceWriter } from '../../tenancy/contracts/evidence';
import { AccessError } from '../domain/policy';
import { guardLastAdmin } from '../domain/management';
const canonical=(value:unknown):string=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}':JSON.stringify(value);
export class PrismaInstitutionRepository implements InstitutionRepository {
 constructor(private readonly db:PrismaClient,private readonly writer:(tx:Prisma.TransactionClient)=>InstitutionEvidenceWriter,private readonly home:(identity:Identity,schoolId:string)=>Promise<SwitchedContext>,private readonly now:()=>Date=()=>new Date()){}
 private fail(error:unknown):never {if(error instanceof AccessError)throw error;if(error&&typeof error==='object'&&'code' in error&&error.code==='P2002')throw new AccessError('CONFLICT');throw new AccessError('UNAVAILABLE');}
 private async current(tx:Prisma.TransactionClient,identity:Identity){const a=await tx.userAccount.findUnique({where:{id:identity.accountId},select:{status:true,tokenVersion:true}});if(!a||a.status!=='ACTIVE'||a.tokenVersion!==identity.tokenVersion)throw new AccessError('UNAUTHENTICATED');}
 async directory(identity:Identity):Promise<ContextDirectory>{try{return await this.db.$transaction(async tx=>{
  await this.current(tx,identity);
  const membership={accountId:identity.accountId,status:'ACTIVE',grants:{some:{code:{in:['SCHOOL_ADMIN','TEACHER','PRINCIPAL']}}}};
  const organizations=await tx.organization.findMany({where:{status:'ACTIVE',OR:[{institutionGrants:{some:{accountId:identity.accountId,status:'ACTIVE',role:'INSTITUTION_ADMIN'}}},{schools:{some:{status:'ACTIVE',memberships:{some:membership}}}}]},orderBy:[{name:'asc'},{id:'asc'}],take:101,include:{institutionGrants:{where:{accountId:identity.accountId,status:'ACTIVE',role:'INSTITUTION_ADMIN'},select:{id:true}}}});
  if(organizations.length>100)throw new AccessError('UNAVAILABLE');
  const institutions=[];
  for(const o of organizations){const canManage=!!o.institutionGrants.length,schools=await tx.school.findMany({where:{organizationId:o.id,status:'ACTIVE',...(!canManage?{memberships:{some:membership}}:{})},orderBy:{code:'asc'},take:101,include:{memberships:{where:membership,select:{id:true,grants:{select:{code:true}}}}}});if(schools.length>100)throw new AccessError('UNAVAILABLE');institutions.push({id:o.id,name:o.name,revision:o.configurationVersion,canManage,branches:schools.map(s=>{const roles:RoleCode[]=s.memberships.flatMap(m=>m.grants).flatMap(g=>g.code==='SCHOOL_ADMIN'||g.code==='TEACHER'||g.code==='PRINCIPAL'?[g.code]:[]);return {id:s.id,code:s.code,name:s.name,timezone:s.timezone,selectable:roles.length>0,roles};})});}
  return {institutions};
 },{isolationLevel:'RepeatableRead'});}catch(e){return this.fail(e);}}
 async switchContext(identity:Identity,organizationId:string,schoolId:string){try{const home=await this.home(identity,schoolId);if(home.scope.organizationId!==organizationId)throw new AccessError('NOT_FOUND');return home;}catch(e){return this.fail(e);}}
 private async retry<T>(work:(tx:Prisma.TransactionClient)=>Promise<T>):Promise<T>{for(let i=0;i<3;i++)try{return await this.db.$transaction(work,{timeout:10000,maxWait:10000});}catch(e){const error=e as {code?:string;meta?:{code?:string;driverAdapterError?:{cause?:{originalCode?:string}}}};if(i<2&&[error?.code,error?.meta?.code,error?.meta?.driverAdapterError?.cause?.originalCode].some(c=>['P2034','40001','40P01'].includes(c??'')))continue;return this.fail(e);}throw new AccessError('UNAVAILABLE');}
 private async receipt(tx:Prisma.TransactionClient,organizationId:string,actorAccountId:string,command:string,key:string,inputHash:string){const r=await tx.tenantCommandReceipt.findUnique({where:{organizationId_actorAccountId_command_key:{organizationId,actorAccountId,command,key}}});if(r){if(r.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');return {...r.response as InstitutionResult,replayed:true};}return null;}
 async createBranch(identity:Identity,organizationId:string,input:BranchInput){const hash=createHash('sha256').update(canonical({schemaVersion:1,organizationId,input})).digest('hex');return this.retry(async tx=>{
  await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${identity.accountId}::uuid FOR UPDATE`;
  await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${organizationId}::uuid FOR UPDATE`;
  await this.current(tx,identity);const org=await tx.organization.findFirst({where:{id:organizationId,status:'ACTIVE',institutionGrants:{some:{accountId:identity.accountId,status:'ACTIVE',role:'INSTITUTION_ADMIN'}}}});if(!org)throw new AccessError('NOT_FOUND');
  const replay=await this.receipt(tx,organizationId,identity.accountId,'CreateBranch',input.key,hash);if(replay)return replay;
  if(org.configurationVersion!==input.expectedRevision)throw new AccessError('STALE_VERSION');if(await tx.school.count({where:{organizationId}})>=100)throw new AccessError('CONFLICT');
  const now=this.now(),s=await tx.school.create({data:{id:randomUUID(),organizationId,code:input.code,name:input.name,timezone:input.timezone,status:'ACTIVE',version:1,createdAt:now}}),revision=org.configurationVersion+1;
  await tx.organization.update({where:{id:org.id},data:{configurationVersion:revision,version:{increment:1}}});const result={organizationId,resourceId:s.id,version:1,revision,replayed:false};
  await this.writer(tx).append({organizationId,schoolId:s.id,actorAccountId:identity.accountId,command:'CreateBranch',key:input.key,inputHash:hash,response:result,expectedRevision:org.configurationVersion,newRevision:revision,reason:input.reason,requestId:randomUUID(),occurredAt:now.toISOString(),changes:{schemaVersion:1,principalKind:'ACCOUNT',resourceId:s.id,version:1}});return result;
 });}
 async operate(command:InstitutionCommand,operator:OperatorPrincipal){const {organizationId,accountId,key,reason}=command,hash=createHash('sha256').update(canonical({schemaVersion:1,operatorId:operator.operatorId,command})).digest('hex');return this.retry(async tx=>{
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(1448302674,1)`;
   await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${accountId}::uuid FOR UPDATE`;
  // Explicit new institution ID gives a stable lock/replay address before the row exists.
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${organizationId},1))`;
  await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${organizationId}::uuid FOR UPDATE`;
  const account=await tx.userAccount.findUnique({where:{id:accountId}});if(!account||account.status==='DISABLED')throw new AccessError('NOT_FOUND');
  let org=await tx.organization.findUnique({where:{id:organizationId}});if(command.kind!=='CreateInstitution'&&org?.status!=='ACTIVE')throw new AccessError('NOT_FOUND');
  if(command.kind==='SetBranchMembership'){await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${organizationId}::uuid AND id=${command.schoolId}::uuid FOR UPDATE`;if(!await tx.school.findFirst({where:{id:command.schoolId,organizationId,status:'ACTIVE'}}))throw new AccessError('NOT_FOUND');}
  const replay=org?await this.receipt(tx,organizationId,accountId,command.kind,key,hash):null;if(replay)return replay;
  const now=this.now(),expectedRevision=org?.configurationVersion??0;let resourceId:string,version:number;
  if(command.kind==='CreateInstitution'){
   if(org)throw new AccessError('CONFLICT');org=await tx.organization.create({data:{id:organizationId,name:command.name,status:'ACTIVE',trustMode:'HYBRID',version:1,createdAt:now}});
   const grant=await tx.institutionGrant.create({data:{id:randomUUID(),organizationId,accountId,role:'INSTITUTION_ADMIN',status:'ACTIVE',version:1,grantedAt:now,grantedBy:operator.operatorId}});resourceId=grant.id;version=1;
  }else if(command.kind==='SetInstitutionGrant'){
   const old=await tx.institutionGrant.findUnique({where:{organizationId_accountId_role:{organizationId,accountId,role:'INSTITUTION_ADMIN'}}});if((old?.version??0)!==command.expectedVersion)throw new AccessError('STALE_VERSION');if(!old&&command.status==='REVOKED')throw new AccessError('NOT_FOUND');
   const grant=old?await tx.institutionGrant.update({where:{id:old.id},data:{status:command.status,version:{increment:1},grantedAt:now,grantedBy:operator.operatorId}}):await tx.institutionGrant.create({data:{id:randomUUID(),organizationId,accountId,role:'INSTITUTION_ADMIN',status:'ACTIVE',version:1,grantedAt:now,grantedBy:operator.operatorId}});resourceId=grant.id;version=grant.version;
  }else{
   const scope={organizationId,schoolId:command.schoolId},old=await tx.schoolMembership.findUnique({where:{organizationId_schoolId_accountId:{...scope,accountId}},include:{grants:true}});
   if((old?.version??0)!==command.expectedVersion)throw new AccessError('STALE_VERSION');if(!old&&command.status==='REVOKED')throw new AccessError('NOT_FOUND');if(command.status==='ACTIVE'&&account.status!=='ACTIVE')throw new AccessError('CONFLICT');
   const count=await tx.schoolMembership.count({where:{...scope,status:'ACTIVE',account:{status:'ACTIVE'},grants:{some:{code:'SCHOOL_ADMIN'}}}});
   guardLastAdmin(count,old?.status==='ACTIVE'&&account.status==='ACTIVE'&&old.grants.some(g=>g.code==='SCHOOL_ADMIN'),command.status==='ACTIVE'&&command.roles.includes('SCHOOL_ADMIN'));
   const member=old?await tx.schoolMembership.update({where:{id:old.id},data:{status:command.status,version:{increment:1}}}):await tx.schoolMembership.create({data:{id:randomUUID(),...scope,accountId,status:command.status,version:1}});
   await tx.roleGrant.deleteMany({where:{...scope,membershipId:member.id}});await tx.roleGrant.createMany({data:command.roles.map(code=>({id:randomUUID(),...scope,membershipId:member.id,code}))});resourceId=member.id;version=member.version;
  }
  const revision=expectedRevision+1;if(command.kind!=='CreateInstitution')await tx.organization.update({where:{id:organizationId},data:{configurationVersion:revision,version:{increment:1}}});
  const result={organizationId,resourceId,version,revision,replayed:false};await this.writer(tx).append({organizationId,...(command.kind==='SetBranchMembership'?{schoolId:command.schoolId}:{}),actorAccountId:accountId,command:command.kind,key,inputHash:hash,response:result,expectedRevision,newRevision:revision,reason,requestId:randomUUID(),occurredAt:now.toISOString(),changes:{schemaVersion:1,principalKind:'OPERATOR',operatorId:operator.operatorId,resourceId,version,...(command.kind!=='CreateInstitution'?{status:command.status}:{}),...(command.kind==='SetBranchMembership'?{roles:command.roles}:{})}});return result;
 });}
}
