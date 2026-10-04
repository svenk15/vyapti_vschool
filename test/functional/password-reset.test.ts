import {afterAll,it,expect} from "vitest";
import {randomUUID} from "node:crypto";
import {PrismaClient} from "../../generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";
import {createAccessServices} from "../../backend/composition/access";
import {PrismaPasswordResetRepository} from "../../backend/modules/access/infrastructure/password-reset";
import {OpaqueActivationTokens} from "../../backend/modules/access/infrastructure/activation-tokens";
import {BcryptPasswords} from "../../backend/modules/access/infrastructure/passwords";
import {createPasswordResetUseCases} from "../../backend/modules/access/application/password-reset";
import {schoolInput} from "../fixtures/access-management";

const url=process.env.TEST_DATABASE_URL??"";if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test DB required");
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),service=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const},repo=new PrismaPasswordResetRepository(db);
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function activeAccount(){
 const school=await service.provisionSchool(schoolInput(),operator);
 const organization=await db.organization.findUniqueOrThrow({where:{id:school.organizationId}});
 expect(organization.trustMode).toBe("HYBRID");
 const now=new Date(),account=await db.userAccount.update({where:{id:school.accountId},data:{emailVerifiedAt:now,failedAttempts:4,lockedUntil:new Date(now.getTime()+60000)}});
 return {school,account};
}
const requestId=()=>randomUUID(),hashToken=(value:string)=>new OpaqueActivationTokens().hash(value),expiry=()=>new Date(Date.now()+30*60_000);

it("defaults new raw organizations to OPERATOR_CLI and refuses reset for any CLI institution",async()=>{
 const now=new Date(),org=await db.organization.create({data:{id:randomUUID(),name:`Policy default ${randomUUID()}`,status:"ACTIVE",version:1,createdAt:now}});
 expect(org.trustMode).toBe("OPERATOR_CLI");
 const {school,account}=await activeAccount();await db.organization.update({where:{id:school.organizationId},data:{trustMode:"OPERATOR_CLI"}});
 expect(await repo.issue({normalizedEmail:account.normalizedEmail,tokenHash:hashToken("a".repeat(48)),expiresAt:expiry(),requestId:requestId()})).toBeNull();
 const event=await db.authSecurityEvent.findFirstOrThrow({where:{accountId:account.id,kind:"PASSWORD_RESET_DENIED"},orderBy:{occurredAt:"desc"}});expect(event.safeReason).toBe("OPERATOR_CLI_REQUIRED");
});

it("includes institution-level grant access even when there is no branch membership",async()=>{
 const {account}=await activeAccount(),now=new Date(),organizationId=randomUUID();
 await db.organization.create({data:{id:organizationId,name:`Grant-only scope ${organizationId.slice(0,8)}`,status:"ACTIVE",version:1,createdAt:now}});
 await db.institutionGrant.create({data:{id:randomUUID(),organizationId,accountId:account.id,role:"INSTITUTION_ADMIN",status:"ACTIVE",version:1,grantedAt:now,grantedBy:account.id}});
 expect(await db.schoolMembership.count({where:{accountId:account.id,organizationId}})).toBe(0);
 expect(await repo.issue({normalizedEmail:account.normalizedEmail,tokenHash:hashToken(randomUUID().replaceAll("-","")),expiresAt:expiry(),requestId:requestId()})).toBeNull();
 const event=await db.authSecurityEvent.findFirstOrThrow({where:{accountId:account.id,kind:"PASSWORD_RESET_DENIED"},orderBy:{occurredAt:"desc"}});
 expect(JSON.stringify(event.policySnapshot)).toContain(organizationId);
});

it("rate limits repeated known-account reset requests with a generic-denial record",async()=>{
 const {account}=await activeAccount(),tokens=new OpaqueActivationTokens();
 for(let i=0;i<5;i++)expect(await repo.issue({normalizedEmail:account.normalizedEmail,tokenHash:tokens.hash(tokens.generate()),expiresAt:expiry(),requestId:requestId()})).not.toBeNull();
 expect(await repo.issue({normalizedEmail:account.normalizedEmail,tokenHash:tokens.hash(tokens.generate()),expiresAt:expiry(),requestId:requestId()})).toBeNull();
 const event=await db.authSecurityEvent.findFirstOrThrow({where:{accountId:account.id,kind:"PASSWORD_RESET_DENIED"},orderBy:{occurredAt:"desc"}});expect(event.safeReason).toBe("RATE_LIMITED");
});

it("records missing-account denial without retaining the submitted address",async()=>{
 const email=`missing-${randomUUID()}@example.test`;
 expect(await repo.issue({normalizedEmail:email,tokenHash:hashToken(randomUUID().replaceAll("-","")),expiresAt:expiry(),requestId:requestId()})).toBeNull();
 const event=await db.authSecurityEvent.findFirstOrThrow({where:{accountId:null,kind:"PASSWORD_RESET_DENIED"},orderBy:{occurredAt:"desc"}});expect(event.safeReason).toBe("ACCOUNT_NOT_FOUND");expect(JSON.stringify(event)).not.toContain(email);
});

it("requires SENT delivery, rechecks tightened policy, and rejects failed/pending tokens",async()=>{
 const {school,account}=await activeAccount(),tokens=new OpaqueActivationTokens(),pendingToken=tokens.generate(),pending=await repo.issue({normalizedEmail:account.normalizedEmail,tokenHash:tokens.hash(pendingToken),expiresAt:expiry(),requestId:requestId()});expect(pending).not.toBeNull();
 expect(await repo.consume({tokenHash:tokens.hash(pendingToken),passwordHash:"must-not-apply",requestId:requestId()})).toBe(false);
 await repo.finishDelivery({id:pending!.id,status:"FAILED",failureReason:"provider rejected message",requestId:requestId()});
 expect((await db.passwordResetToken.findUniqueOrThrow({where:{id:pending!.id}})).deliveryFailureReason).toBe("Mail provider rejected the message");
 expect(await repo.consume({tokenHash:tokens.hash(pendingToken),passwordHash:"must-not-apply",requestId:requestId()})).toBe(false);
 const sentToken=tokens.generate(),next=await repo.issue({normalizedEmail:account.normalizedEmail,tokenHash:tokens.hash(sentToken),expiresAt:expiry(),requestId:requestId()});await repo.finishDelivery({id:next!.id,status:"SENT",requestId:requestId()});
 await db.organization.update({where:{id:school.organizationId},data:{trustMode:"OPERATOR_CLI",configurationVersion:{increment:1}}});
 expect(await repo.consume({tokenHash:tokens.hash(sentToken),passwordHash:"must-not-apply",requestId:requestId()})).toBe(false);
 expect((await db.passwordResetToken.findUniqueOrThrow({where:{id:next!.id}})).consumedAt).toBeNull();
});

it("atomically consumes once, revokes sessions and preserves memberships and roles",async()=>{
 const {account}=await activeAccount(),oldTokenVersion=account.tokenVersion,membership=await db.schoolMembership.findFirstOrThrow({where:{accountId:account.id},include:{grants:true}}),membershipStatus=membership.status,roles=membership.grants.map(g=>g.code).sort();let sentToken="";
 const tokens=new OpaqueActivationTokens(),flow=createPasswordResetUseCases(repo,{sendPasswordReset:async input=>{sentToken=input.token;return {ok:true};},sendStaffInvite:async()=>({ok:true})},tokens,new BcryptPasswords(),()=>new Date());
 await flow.requestPasswordReset(account.normalizedEmail,requestId());expect(sentToken).not.toBe("");
 const outcomes=await Promise.all([repo.consume({tokenHash:tokens.hash(sentToken),passwordHash:"replacement-password-hash",requestId:requestId()}),repo.consume({tokenHash:tokens.hash(sentToken),passwordHash:"replacement-password-hash",requestId:requestId()})]);expect(outcomes.filter(Boolean)).toHaveLength(1);
 const updated=await db.userAccount.findUniqueOrThrow({where:{id:account.id}});expect(updated.tokenVersion).toBe(oldTokenVersion+1);expect(updated.failedAttempts).toBe(0);expect(updated.lockedUntil).toBeNull();expect(updated.passwordHash).toBe("replacement-password-hash");
 const after=await db.schoolMembership.findUniqueOrThrow({where:{id:membership.id},include:{grants:true}});expect(after.status).toBe(membershipStatus);expect(after.grants.map(g=>g.code).sort()).toEqual(roles);await expect(service.getAccountHome({accountId:account.id,tokenVersion:oldTokenVersion})).rejects.toThrow("UNAUTHENTICATED");
 const saved=await db.passwordResetToken.findUniqueOrThrow({where:{tokenHash:tokens.hash(sentToken)}});expect(saved.consumedAt).not.toBeNull();expect(saved.tokenHash).not.toBe(sentToken);
});
