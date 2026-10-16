import { randomUUID } from "node:crypto";
import type { Prisma,PrismaClient } from "../../../../generated/prisma/client";
import type { IssueActivationInput } from "../../../../shared/contracts/activation";
import type { OperatorPrincipal } from "../../../../shared/contracts/access";
import type { ActivationRepository } from "../application/activation";
import type { AccessSecurityEvidenceWriter } from "../../platform/contracts/access-security-evidence";
import { AccessError } from "../domain/policy";
import { liveActivation } from "../domain/activation";
export class PrismaActivationRepository implements ActivationRepository {
 constructor(private readonly db:PrismaClient,private readonly evidence:(tx:Prisma.TransactionClient)=>AccessSecurityEvidenceWriter,private readonly now:()=>Date){}
 private async transaction<T>(work:(tx:Prisma.TransactionClient)=>Promise<T>):Promise<T>{
  for(let attempt=0;attempt<3;attempt++)try{return await this.db.$transaction(async tx=>{await tx.$executeRaw`SELECT pg_advisory_xact_lock(1448302674,1)`;return work(tx);},{timeout:10000,maxWait:10000});}catch(error){
   const record=error&&typeof error==="object"?error as {code?:string;meta?:{code?:string;driverAdapterError?:{cause?:{originalCode?:string}}}}:{};
   const retryable=[record.code,record.meta?.code,record.meta?.driverAdapterError?.cause?.originalCode].some(code=>["P2034","40001","40P01"].includes(code??""));
   if(!retryable||attempt===2)throw error;
  }
  throw new AccessError("UNAVAILABLE");
 }
 private fail(error:unknown):never {if(error instanceof AccessError)throw error;throw new AccessError("UNAVAILABLE");}
 private async accountLock(tx:Prisma.TransactionClient,accountId:string){await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${accountId}::uuid FOR UPDATE`;}
 private async guards(tx:Prisma.TransactionClient,accountId:string){
  const memberships=await tx.schoolMembership.findMany({where:{accountId},include:{school:{include:{organization:true}}}});
  for(const id of [...new Set(memberships.map(m=>m.organizationId))].sort())await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${id}::uuid FOR SHARE`;
  for(const id of [...new Set(memberships.map(m=>m.schoolId))].sort())await tx.$queryRaw`SELECT id FROM vs_access_school WHERE id=${id}::uuid FOR UPDATE`;
  // Re-read scope state after guards; pre-lock snapshots never authorize writes.
  return tx.schoolMembership.findMany({where:{accountId},include:{school:{include:{organization:true}}}});
 }
 async issue(input:IssueActivationInput,operator:OperatorPrincipal,recovery:boolean,tokenHash:string,expiresAt:Date){try{return await this.transaction(async tx=>{
  await this.accountLock(tx,input.accountId);const account=await tx.userAccount.findUnique({where:{id:input.accountId}});
  if(!account||account.status==="DISABLED")throw new AccessError("NOT_FOUND");if(!recovery&&account.status!=="PENDING")throw new AccessError("CONFLICT");
  const memberships=await this.guards(tx,account.id),selected=memberships.filter(m=>input.membershipIds.includes(m.id));
  if(selected.length!==input.membershipIds.length||selected.some(m=>m.status!=="PENDING"||m.school.status!=="ACTIVE"||m.school.organization.status!=="ACTIVE"||m.version<1))throw new AccessError("NOT_FOUND");
  const now=this.now(),requestId=randomUUID();let version=account.version,tokenVersion=account.tokenVersion;
  if(recovery){const updated=await tx.userAccount.update({where:{id:account.id},data:{passwordHash:null,status:"PENDING",tokenVersion:{increment:1},version:{increment:1},failedAttempts:0,lockedUntil:null}});version=updated.version;tokenVersion=updated.tokenVersion;}
  await tx.accountActivation.updateMany({where:{accountId:account.id,consumedAt:null,revokedAt:null},data:{revokedAt:now}});
  const activation=await tx.accountActivation.create({data:{id:randomUUID(),accountId:account.id,tokenHash,expiresAt,createdBy:account.id,operatorId:operator.operatorId,caseReference:input.caseReference,reason:input.reason,issuedTokenVersion:tokenVersion}});
  if(selected.length)await tx.accountActivationMembership.createMany({data:selected.map(m=>({id:randomUUID(),activationId:activation.id,accountId:account.id,organizationId:m.organizationId,schoolId:m.schoolId,membershipId:m.id,expectedVersion:m.version}))});
  await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account.id,kind:recovery?"RECOVERY_REQUESTED":"ACTIVATION_ISSUED",requestId,occurredAt:now}});
  for(const m of memberships)await this.evidence(tx).append({organizationId:m.organizationId,schoolId:m.schoolId,accountId:account.id,operatorId:operator.operatorId,caseReference:input.caseReference,reason:input.reason,command:recovery?"RecoveryRequested":"ActivationIssued",version,requestId,occurredAt:now});
  return {activationId:activation.id};
 });}catch(error){return this.fail(error);}}
 async begin(tokenHash:string){try{
  const candidate=await this.db.accountActivation.findUnique({where:{tokenHash},select:{accountId:true}});if(!candidate)return null;
  return await this.transaction(async tx=>{
   await this.accountLock(tx,candidate.accountId);const now=this.now(),activation=await tx.accountActivation.findUnique({where:{tokenHash},include:{account:true}});
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:candidate.accountId,kind:"ACTIVATION_ATTEMPT",occurredAt:now,requestId:randomUUID()}});
   const count=await tx.authSecurityEvent.count({where:{accountId:candidate.accountId,kind:"ACTIVATION_ATTEMPT",occurredAt:{gte:new Date(now.getTime()-900000)}}});
   if(count>5||!activation||!liveActivation(activation.expiresAt,activation.consumedAt,activation.revokedAt,now)||activation.account.status==="DISABLED"||activation.account.tokenVersion!==activation.issuedTokenVersion)return null;
   return {accountId:candidate.accountId,tokenVersion:activation.issuedTokenVersion};
  });
 }catch(error){return this.fail(error);}}
 async redeem(tokenHash:string,accountId:string,tokenVersion:number,passwordHash:string){try{return await this.transaction(async tx=>{
  await this.accountLock(tx,accountId);let now=this.now();const activation=await tx.accountActivation.findUnique({where:{tokenHash},include:{account:true,intents:true}});
  if(!activation||activation.accountId!==accountId||activation.account.status==="DISABLED"||activation.account.tokenVersion!==tokenVersion||activation.issuedTokenVersion!==tokenVersion||!liveActivation(activation.expiresAt,activation.consumedAt,activation.revokedAt,now))return false;
  const memberships=await this.guards(tx,accountId);now=this.now();
  if(!liveActivation(activation.expiresAt,activation.consumedAt,activation.revokedAt,now))return false;
  if(activation.intents.some(intent=>!memberships.some(m=>m.id===intent.membershipId&&m.accountId===intent.accountId&&m.organizationId===intent.organizationId&&m.schoolId===intent.schoolId&&m.version===intent.expectedVersion&&m.status==="PENDING"&&m.school.status==="ACTIVE"&&m.school.organization.status==="ACTIVE")))return false;
  await tx.accountActivation.update({where:{id:activation.id},data:{consumedAt:now}});
  const account=await tx.userAccount.update({where:{id:accountId},data:{passwordHash,status:"ACTIVE",failedAttempts:0,lockedUntil:null,tokenVersion:{increment:1},version:{increment:1}}});
  for(const intent of activation.intents)await tx.schoolMembership.update({where:{id:intent.membershipId},data:{status:"ACTIVE",version:{increment:1}}});
  const requestId=randomUUID();await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId,kind:"ACCOUNT_ACTIVATED",requestId,occurredAt:now}});
  for(const m of memberships)await this.evidence(tx).append({organizationId:m.organizationId,schoolId:m.schoolId,accountId,command:"AccountActivated",version:account.version,requestId,occurredAt:now});
  return true;
 });}catch(error){return this.fail(error);}}
}
