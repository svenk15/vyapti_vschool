import {randomUUID} from "node:crypto";
import type {Prisma} from "../../../../generated/prisma/client";
import type {AccessTrustModeInvalidator,TrustModeInvalidationResult} from "../contracts/trust-mode-invalidation";

/** Owns Access token tables while participating in Tenancy's enlisted transaction. */
export class PrismaAccessTrustModeInvalidator implements AccessTrustModeInvalidator<Prisma.TransactionClient>{
 async invalidateForOperatorOnly(input:{transaction:Prisma.TransactionClient;organizationId:string;configurationVersion:number;requestId:string;occurredAt:Date}):Promise<TrustModeInvalidationResult>{
  const {transaction:tx,organizationId,configurationVersion,requestId,occurredAt}=input;
  const accessInOrganization={OR:[{memberships:{some:{organizationId,status:"ACTIVE"}}},{institutionGrants:{some:{organizationId,status:"ACTIVE"}}}]};
  const candidates=await tx.passwordResetToken.findMany({where:{consumedAt:null,revokedAt:null,OR:[{issuingOrganizationId:organizationId},{account:accessInOrganization}]},select:{accountId:true}});
  const accounts=[...new Set(candidates.map(x=>x.accountId))].sort();
  const resets=await tx.passwordResetToken.updateMany({where:{consumedAt:null,revokedAt:null,OR:[{issuingOrganizationId:organizationId},{account:accessInOrganization}]},data:{revokedAt:occurredAt}});
  const invites=await tx.accessInvite.updateMany({where:{organizationId,acceptedAt:null,revokedAt:null},data:{revokedAt:occurredAt}});
  for(let start=0;start<accounts.length;start+=500)await tx.authSecurityEvent.createMany({data:accounts.slice(start,start+500).map(accountId=>({id:randomUUID(),accountId,kind:"TRUST_MODE_POLICY_INVALIDATED",decision:"DENY",safeReason:"OPERATOR_CLI_REQUIRED",policySnapshot:{organizationId,configurationVersion,revokedResetTokenCount:resets.count},requestId,occurredAt}))});
  return {revokedInvites:invites.count,revokedResetTokens:resets.count,affectedAccounts:accounts.length};
 }
}
