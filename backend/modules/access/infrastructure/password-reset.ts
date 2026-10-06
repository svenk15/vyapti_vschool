import {randomUUID} from "node:crypto";
import type {Prisma,PrismaClient} from "../../../../generated/prisma/client";
import type {PasswordResetRepository,TrustMode} from "../application/password-reset";
import {evaluatePasswordRecoveryPolicy} from "../application/password-reset";
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';

const ADVISORY_KEY_1=1448302674,ADVISORY_KEY_2=1;
const safeFailure=(value:string|undefined)=>{
 if(!value)return null;
 const normalized=value.toLowerCase();
 if(normalized.includes("reject"))return "Mail provider rejected the message";
 if(normalized.includes("timeout"))return "Mail provider timed out";
 return "Mail provider unavailable";
};
type AccountRow={id:string;status:string;passwordHash:string|null;emailVerifiedAt:Date|null;normalizedEmail:string;failedAttempts:number;lockedUntil:Date|null;tokenVersion:number;version:number};

/** Access-owned persistence for global password recovery. All policy snapshots are read
 * and consumed while holding the shared low-frequency access/configuration guard. */
export class PrismaPasswordResetRepository implements PasswordResetRepository{
 constructor(private readonly db:PrismaClient,private readonly databaseContext:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}
 private async lock(tx:Prisma.TransactionClient){await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ADVISORY_KEY_1},${ADVISORY_KEY_2})`;}
 private async account(tx:Prisma.TransactionClient,id:string):Promise<AccountRow|null>{
  return tx.userAccount.findUnique({where:{id},select:{id:true,status:true,passwordHash:true,emailVerifiedAt:true,normalizedEmail:true,failedAttempts:true,lockedUntil:true,tokenVersion:true,version:true}});
 }
 private async policy(tx:Prisma.TransactionClient,account:AccountRow){
  const organizations=await tx.organization.findMany({where:{OR:[
   {schools:{some:{memberships:{some:{accountId:account.id,status:"ACTIVE"}}}}},
   {institutionGrants:{some:{accountId:account.id,status:"ACTIVE"}}}
  ]},select:{id:true,trustMode:true,configurationVersion:true}});
  const records=organizations.map(o=>({organizationId:o.id,trustMode:o.trustMode as TrustMode,configurationVersion:o.configurationVersion})).sort((a,b)=>a.organizationId.localeCompare(b.organizationId));
  return {records,decision:evaluatePasswordRecoveryPolicy({accountStatus:account.status,emailVerified:account.emailVerifiedAt!==null,hasPassword:account.passwordHash!==null,organizations:records})};
 }
 async issue(input:{normalizedEmail:string;tokenHash:string;expiresAt:Date;requestId:string}){
  return this.db.$transaction(async tx=>{
   await this.lock(tx);
   const accountId=await this.databaseContext.findAccountByEmail(tx,input.normalizedEmail);
   if(!accountId){await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:null,kind:"PASSWORD_RESET_DENIED",decision:"DENY",safeReason:"ACCOUNT_NOT_FOUND",requestId:input.requestId,occurredAt:this.now()}});return null;}
   const initial=await this.account(tx,accountId);if(!initial||!await this.databaseContext.establishAccount(tx,initial.id,initial.tokenVersion))return null;
   await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${accountId}::uuid FOR UPDATE`;
   const account=await this.account(tx,accountId);if(!account)return null;
   const {records,decision}=await this.policy(tx,account),now=this.now(),attempts=await tx.authSecurityEvent.count({where:{accountId:account.id,kind:{in:["PASSWORD_RESET_ISSUED","PASSWORD_RESET_DENIED"]},occurredAt:{gte:new Date(now.getTime()-15*60_000)}}}),effective=attempts>=5?{...decision,allowed:false,reason:"RATE_LIMITED" as const}:decision;
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account.id,kind:effective.allowed?"PASSWORD_RESET_ISSUED":"PASSWORD_RESET_DENIED",decision:effective.allowed?"ALLOW":"DENY",safeReason:effective.reason,policySnapshot:{organizations:records},requestId:input.requestId,occurredAt:now}});
   if(!effective.allowed)return null;
   await tx.passwordResetToken.updateMany({where:{accountId:account.id,consumedAt:null,revokedAt:null},data:{revokedAt:now}});
   const token=await tx.passwordResetToken.create({data:{id:randomUUID(),accountId:account.id,issuingOrganizationId:null,tokenHash:input.tokenHash,deliveryStatus:"PENDING_DELIVERY",policySnapshot:{organizations:records},organizationConfigurationVersions:records.map(r=>({organizationId:r.organizationId,configurationVersion:r.configurationVersion,trustMode:r.trustMode})),createdAt:now,expiresAt:input.expiresAt}});
   return {id:token.id,recipient:account.normalizedEmail};
  },{timeout:10000,maxWait:10000});
 }
 async finishDelivery(input:{id:string;status:"SENT"|"FAILED";failureReason?:string;requestId:string}){
  await this.db.$transaction(async tx=>{
   await this.lock(tx);
   const token=await tx.passwordResetToken.findUnique({where:{id:input.id},select:{id:true,accountId:true}});if(!token)return;
   const now=this.now(),result=await tx.passwordResetToken.updateMany({where:{id:input.id,deliveryStatus:"PENDING_DELIVERY",revokedAt:null,consumedAt:null},data:{deliveryStatus:input.status,...(input.status==="FAILED"?{deliveryFailedAt:now,deliveryFailureReason:safeFailure(input.failureReason)}:{})}});
   if(result.count)await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:token.accountId,kind:input.status==="SENT"?"PASSWORD_RESET_SENT":"PASSWORD_RESET_DELIVERY_FAILED",decision:input.status==="SENT"?"ALLOW":"DENY",safeReason:input.status==="SENT"?"DELIVERY_ACCEPTED":"DELIVERY_FAILED",requestId:input.requestId,occurredAt:now}});
  },{timeout:10000,maxWait:10000});
 }
 async consume(input:{tokenHash:string;passwordHash:string;requestId:string}):Promise<boolean>{
  return this.db.$transaction(async tx=>{
   await this.lock(tx);
   const accountId=await this.databaseContext.findAccountForPasswordReset(tx,input.tokenHash);if(!accountId){await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:null,kind:"PASSWORD_RESET_CONSUME_DENIED",decision:"DENY",safeReason:"TOKEN_INVALID",requestId:input.requestId,occurredAt:this.now()}});return false;}
   const initial=await this.account(tx,accountId);if(!initial||!await this.databaseContext.establishAccount(tx,initial.id,initial.tokenVersion))return false;
   await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${accountId}::uuid FOR UPDATE`;
   const account=await this.account(tx,accountId),now=this.now();if(!account)return false;
   const {records,decision}=await this.policy(tx,account);
   const token=await tx.passwordResetToken.findUnique({where:{tokenHash:input.tokenHash}});
   const valid=!!token&&token.accountId===account.id&&token.tokenHash===input.tokenHash&&token.deliveryStatus==="SENT"&&token.consumedAt===null&&token.revokedAt===null&&token.expiresAt>now&&decision.allowed;
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account.id,kind:valid?"PASSWORD_RESET_CONSUMED":"PASSWORD_RESET_CONSUME_DENIED",decision:valid?"ALLOW":"DENY",safeReason:valid?"ELIGIBLE":(!decision.allowed?decision.reason:"TOKEN_INVALID"),policySnapshot:{organizations:records},requestId:input.requestId,occurredAt:now}});
   if(!valid)return false;
   const consumed=await tx.passwordResetToken.updateMany({where:{id:token!.id,deliveryStatus:"SENT",consumedAt:null,revokedAt:null,expiresAt:{gt:now}},data:{consumedAt:now}});if(consumed.count!==1)return false;
   await tx.userAccount.update({where:{id:account.id},data:{passwordHash:input.passwordHash,failedAttempts:0,lockedUntil:null,tokenVersion:{increment:1},version:{increment:1}}});
   await tx.passwordResetToken.updateMany({where:{accountId:account.id,id:{not:token!.id},consumedAt:null,revokedAt:null},data:{revokedAt:now}});
   return true;
  },{timeout:10000,maxWait:10000});
 }
}
