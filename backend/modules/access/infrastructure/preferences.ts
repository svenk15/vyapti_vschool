import {createHash,randomUUID} from 'node:crypto';
import type {PrismaClient} from '../../../../generated/prisma/client';
import type {AccountPreferenceBundle,AccountPreferenceUpdateResult,Identity,SchoolSupportConfiguration} from '../../../../shared/contracts/access';
import type {AccountPreferenceRepository} from '../application/preferences';
import {AccessError} from '../domain/policy';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';

const defaults:AccountPreferenceBundle={density:'COMFORTABLE',reducedMotion:'SYSTEM',versions:{density:0,reducedMotion:0},updatedAt:null};
function canonical(value:unknown):string{if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;if(value&&typeof value==='object')return `{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;return JSON.stringify(value);}
function bundle(rows:readonly {key:string;value:string;version:number;updatedAt:Date}[]):AccountPreferenceBundle{
 const density=rows.find(row=>row.key==='TABLE_DENSITY'),motion=rows.find(row=>row.key==='REDUCED_MOTION'),latest=rows.map(row=>row.updatedAt).sort((a,b)=>b.getTime()-a.getTime())[0];
 if((density&&!['COMFORTABLE','COMPACT'].includes(density.value))||(motion&&!['SYSTEM','REDUCE'].includes(motion.value)))throw new AccessError('UNAVAILABLE');
 return {density:(density?.value??defaults.density) as AccountPreferenceBundle['density'],reducedMotion:(motion?.value??defaults.reducedMotion) as AccountPreferenceBundle['reducedMotion'],versions:{density:density?.version??0,reducedMotion:motion?.version??0},updatedAt:latest?.toISOString()??null};
}
export class PrismaAccountPreferenceRepository implements AccountPreferenceRepository{
 constructor(private readonly db:PrismaClient,private readonly context:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}
 private fail(error:unknown):never{if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');}
 async read(identity:Identity){try{return await this.db.$transaction(async tx=>{if(!await this.context.establishAccount(tx,identity.accountId,identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');const account=await tx.userAccount.findUnique({where:{id:identity.accountId},select:{status:true,tokenVersion:true}});if(!account||account.status!=='ACTIVE'||account.tokenVersion!==identity.tokenVersion)throw new AccessError('UNAUTHENTICATED');return bundle(await tx.accountPreference.findMany({where:{accountId:identity.accountId,key:{in:['TABLE_DENSITY','REDUCED_MOTION']}},orderBy:{key:'asc'}}));},{isolationLevel:'RepeatableRead'});}catch(error){return this.fail(error);}}
 async update(identity:Identity,input:{density:'COMFORTABLE'|'COMPACT';reducedMotion:'SYSTEM'|'REDUCE';expectedVersions:{density:number;reducedMotion:number}},key:string):Promise<AccountPreferenceUpdateResult>{
  for(let attempt=0;attempt<3;attempt++)try{return await this.db.$transaction(async tx=>{
   if(!await this.context.establishAccount(tx,identity.accountId,identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');
   await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${identity.accountId}::uuid FOR UPDATE`;
   if(!await this.context.establishAccount(tx,identity.accountId,identity.tokenVersion))throw new AccessError('UNAUTHENTICATED');
   const command='UpdateOwnPreferences',inputHash=createHash('sha256').update(canonical({schemaVersion:1,accountId:identity.accountId,...input})).digest('hex'),receipt=await tx.accountPreferenceReceipt.findUnique({where:{accountId_command_key:{accountId:identity.accountId,command,key}}});
   if(receipt){if(receipt.inputHash!==inputHash)throw new AccessError('IDEMPOTENCY_CONFLICT');return {...receipt.response as AccountPreferenceUpdateResult,replayed:true};}
   await tx.$queryRaw`SELECT id FROM vs_access_account_preference WHERE account_id=${identity.accountId}::uuid AND key IN ('REDUCED_MOTION','TABLE_DENSITY') ORDER BY key FOR UPDATE`;
   const current=bundle(await tx.accountPreference.findMany({where:{accountId:identity.accountId,key:{in:['TABLE_DENSITY','REDUCED_MOTION']}},orderBy:{key:'asc'}}));
   if(current.versions.density!==input.expectedVersions.density||current.versions.reducedMotion!==input.expectedVersions.reducedMotion)throw new AccessError('STALE_VERSION');
   const occurredAt=this.now(),densityVersion=current.versions.density+1,motionVersion=current.versions.reducedMotion+1;
   await tx.accountPreference.upsert({where:{accountId_key:{accountId:identity.accountId,key:'TABLE_DENSITY'}},create:{id:randomUUID(),accountId:identity.accountId,key:'TABLE_DENSITY',value:input.density,version:densityVersion,updatedAt:occurredAt},update:{value:input.density,version:densityVersion,updatedAt:occurredAt}});
   await tx.accountPreference.upsert({where:{accountId_key:{accountId:identity.accountId,key:'REDUCED_MOTION'}},create:{id:randomUUID(),accountId:identity.accountId,key:'REDUCED_MOTION',value:input.reducedMotion,version:motionVersion,updatedAt:occurredAt},update:{value:input.reducedMotion,version:motionVersion,updatedAt:occurredAt}});
   const response:AccountPreferenceUpdateResult={density:input.density,reducedMotion:input.reducedMotion,versions:{density:densityVersion,reducedMotion:motionVersion},updatedAt:occurredAt.toISOString(),replayed:false};
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:identity.accountId,actorAccountId:identity.accountId,kind:'PREFERENCES_UPDATED',decision:'ALLOW',safeReason:'SELF_AUTHORIZED',policySnapshot:{density:input.density,reducedMotion:input.reducedMotion,densityVersion,motionVersion},requestId:randomUUID(),occurredAt}});
   await tx.accountPreferenceReceipt.create({data:{id:randomUUID(),accountId:identity.accountId,command,key,inputHash,response,occurredAt}});
   return response;
  },{isolationLevel:'Serializable',timeout:10000,maxWait:10000});}catch(error){const record=error&&typeof error==='object'?error as {code?:string;meta?:{code?:string;driverAdapterError?:{cause?:{originalCode?:string}}}}:{};const codes=[record.code,record.meta?.code,record.meta?.driverAdapterError?.cause?.originalCode];if(codes.some(code=>['P2034','40001','40P01'].includes(code??''))&&attempt<2)continue;return this.fail(error);}throw new AccessError('UNAVAILABLE');
 }
 async support(identity:Identity,organizationId:string,schoolId:string):Promise<SchoolSupportConfiguration|null>{try{return await this.db.$transaction(async tx=>{if(!await this.context.establish(tx,{accountId:identity.accountId,tokenVersion:identity.tokenVersion,organizationId,branchId:schoolId}))throw new AccessError('NOT_FOUND');const school=await tx.school.findFirst({where:{id:schoolId,organizationId,status:'ACTIVE',organization:{status:'ACTIVE'},memberships:{some:{accountId:identity.accountId,status:'ACTIVE'}}},select:{timezone:true,supportLabel:true,supportEmail:true,supportPhone:true,supportHours:true,supportPublishedAt:true}});if(!school)throw new AccessError('NOT_FOUND');if(!school.supportLabel||!school.supportHours||!school.supportPublishedAt||!school.supportEmail&&!school.supportPhone)return null;return {label:school.supportLabel,email:school.supportEmail,phone:school.supportPhone,hours:school.supportHours,timezone:school.timezone,publishedAt:school.supportPublishedAt.toISOString()};},{isolationLevel:'RepeatableRead'});}catch(error){return this.fail(error);}}
}
