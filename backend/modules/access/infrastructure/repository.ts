import { randomUUID } from "node:crypto";
import type { PrismaClient, Prisma } from "../../../../generated/prisma/client";
import type { AccessRepository } from "../contracts";
import type { LoginRecord } from "../application/services";
import type { Identity, OperatorPrincipal, ProvisionInput } from "../../../../shared/contracts/access";
import { AccessError, nextFailure } from "../domain/policy";
import type { ProvisionEvidenceWriter } from "../../platform/contracts/provision-evidence";
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';
import type {DelegatedAuthorityPort} from '../contracts/delegated-authority';
export class PrismaAccessRepository implements AccessRepository {
 constructor(private readonly db:PrismaClient,private readonly evidence:(tx:Prisma.TransactionClient)=>ProvisionEvidenceWriter,private readonly databaseContext:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date(),private readonly delegatedAuthority:DelegatedAuthorityPort={resolve:async()=>null}) {}
 async provision(input:Omit<ProvisionInput,"password">,passwordHash:string,operator:OperatorPrincipal,requestId:string) {
  try {return await this.db.$transaction(async tx=>{
   await tx.$executeRaw`SELECT pg_advisory_xact_lock(1448302674,1)`;
   await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${"bootstrap:"+input.organizationName},0))`;
   if(await tx.organization.findFirst({where:{name:input.organizationName},select:{id:true}})||await tx.userAccount.findUnique({where:{normalizedEmail:input.adminEmail},select:{id:true}}))throw new AccessError("PROVISION_CONFLICT");
   const ids={organizationId:randomUUID(),schoolId:randomUUID(),accountId:randomUUID(),membershipId:randomUUID()},createdAt=this.now();
   await tx.userAccount.create({data:{id:ids.accountId,normalizedEmail:input.adminEmail,passwordHash,status:"ACTIVE",tokenVersion:1,failedAttempts:0,version:1,createdAt}});
   await tx.organization.create({data:{id:ids.organizationId,name:input.organizationName,status:"ACTIVE",trustMode:"HYBRID",themeId:input.themeId??'forest',version:1,createdAt}});
   await tx.school.create({data:{id:ids.schoolId,organizationId:ids.organizationId,code:input.schoolCode,name:input.schoolName,timezone:input.timezone,status:"ACTIVE",version:1,createdAt}});
   await tx.schoolMembership.create({data:{id:ids.membershipId,organizationId:ids.organizationId,schoolId:ids.schoolId,accountId:ids.accountId,status:"ACTIVE",version:1}});
   await tx.roleGrant.create({data:{id:randomUUID(),organizationId:ids.organizationId,schoolId:ids.schoolId,membershipId:ids.membershipId,code:"SCHOOL_ADMIN"}});
   await this.evidence(tx).appendProvisioned({...ids,operatorId:operator.operatorId,requestId,occurredAt:createdAt});
   return ids;
  },{timeout:10000});}catch(error){if(error instanceof AccessError)throw error;if(typeof error==="object"&&error!==null&&"code" in error&&error.code==="P2002")throw new AccessError("PROVISION_CONFLICT");throw new AccessError("UNAVAILABLE");}
 }
 loginRecord(email:string) {return this.db.$transaction(async tx=>{const accountId=await this.databaseContext.findAccountByEmail(tx,email);if(!accountId)return null;return tx.userAccount.findUnique({where:{id:accountId},select:{id:true,passwordHash:true,tokenVersion:true}});},{isolationLevel:'RepeatableRead'});}
 async finishLogin(record:LoginRecord|null,verified:boolean,requestId:string):Promise<Identity|null> {
  return this.db.$transaction(async tx=>{
   const contextVerified=record?await this.databaseContext.establishAccount(tx,record.id,record.tokenVersion):false;
   if(contextVerified)await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${record!.id}::uuid FOR UPDATE`;
   const account=contextVerified?await tx.userAccount.findUnique({where:{id:record!.id}}):null,now=this.now();
   const success=!!account&&verified&&account.passwordHash===record?.passwordHash&&account.status==="ACTIVE"&&(!account.lockedUntil||account.lockedUntil<=now);
   if(account){
    if(success)await tx.userAccount.update({where:{id:account.id},data:{failedAttempts:0,lockedUntil:null,version:{increment:1}}});
    else if(account.status==="ACTIVE"&&(!account.lockedUntil||account.lockedUntil<=now))await tx.userAccount.update({where:{id:account.id},data:{...nextFailure(account.failedAttempts,account.lockedUntil,now),version:{increment:1}}});
   }
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account?.id??null,actorAccountId:success?account!.id:null,kind:success?"LOGIN_SUCCEEDED":"LOGIN_FAILED",occurredAt:now,requestId}});
   return success?{accountId:account!.id,tokenVersion:account!.tokenVersion}:null;
  });
 }
 account(identity:Identity) {return this.db.$transaction(async tx=>{if(!await this.databaseContext.establishAccount(tx,identity.accountId,identity.tokenVersion))return null;return tx.userAccount.findUnique({where:{id:identity.accountId},select:{status:true,tokenVersion:true,normalizedEmail:true,createdAt:true}});},{isolationLevel:'RepeatableRead'});}
 adminContext(identity:Identity,schoolId?:string){return this.context(identity,schoolId,'SCHOOL_ADMIN');}
 leadershipContext(identity:Identity,schoolId?:string){return this.context(identity,schoolId,'PRINCIPAL',true);}
 memberContext(identity:Identity,schoolId?:string){return this.context(identity,schoolId);}
 private async context(identity:Identity,schoolId:string|undefined,requiredRole?:'SCHOOL_ADMIN'|'PRINCIPAL',allowDelegation=false) {
  const context=await this.db.$transaction(async tx=>{if(!await this.databaseContext.establishAccount(tx,identity.accountId,identity.tokenVersion))return null;
  // One SQL statement gives a current authorized snapshot; scope appears in every join.
  const rows=await tx.$queryRaw<{account_id:string;membership_id:string;organization_id:string;school_id:string;institution_name:string;school_name:string;school_code:string;timezone:string;roles:string[]}[]>`
   SELECT a.id AS account_id,m.id AS membership_id,o.id AS organization_id,s.id AS school_id,o.name AS institution_name,s.name AS school_name,s.code AS school_code,s.timezone,array_agg(g.code) AS roles
   FROM vs_access_user_account a JOIN vs_access_school_membership m ON m.account_id=a.id
   JOIN vs_access_school s ON s.organization_id=m.organization_id AND s.id=m.school_id
   JOIN vs_access_organization o ON o.id=s.organization_id
   JOIN vs_access_role_grant g ON g.organization_id=m.organization_id AND g.school_id=m.school_id AND g.membership_id=m.id
   WHERE a.id=${identity.accountId}::uuid AND a.token_version=${identity.tokenVersion} AND a.status='ACTIVE' AND m.status='ACTIVE' AND s.status='ACTIVE' AND o.status='ACTIVE'
   AND (${schoolId??null}::uuid IS NULL OR s.id=${schoolId??null}::uuid)
   GROUP BY a.id,m.id,o.id,s.id HAVING (${allowDelegation?null:requiredRole??null}::text IS NULL OR bool_or(g.code=${allowDelegation?null:requiredRole??null})) ORDER BY s.id LIMIT 1`;
  const r=rows[0];if(!r)return null;const roles=r.roles.filter((v):v is "SCHOOL_ADMIN"|"TEACHER"|"PRINCIPAL"=>v==="SCHOOL_ADMIN"||v==="TEACHER"||v==="PRINCIPAL"),base={accountId:r.account_id,membershipId:r.membership_id,scope:{organizationId:r.organization_id,schoolId:r.school_id},institutionName:r.institution_name,schoolName:r.school_name,schoolCode:r.school_code,timezone:r.timezone,roles};
  if(!allowDelegation||roles.includes('PRINCIPAL'))return base;
  const delegated=await this.delegatedAuthority.resolve(tx,identity,{organizationId:r.organization_id,schoolId:r.school_id,requiredAction:'leadership.read',at:this.now()});
  return delegated?{...base,delegatedCapabilities:delegated.actions,actingDelegation:{delegationId:delegated.delegationId,startsAt:delegated.startsAt.toISOString(),endsAt:delegated.endsAt.toISOString(),actions:delegated.actions}}:null;
  },{isolationLevel:'RepeatableRead'});return context;
 }
}
