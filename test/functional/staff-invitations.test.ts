import {afterAll,it,expect} from "vitest";
import {randomUUID,randomBytes} from "node:crypto";
import {PrismaClient} from "../../generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";
import {createAccessServices} from "../../backend/composition/access";
import {createStaffInviteUseCases,type AccessEmailSender} from "../../backend/modules/access/application/password-reset";
import {PrismaStaffInviteRepository} from "../../backend/modules/access/infrastructure/staff-invites";
import {PrismaVerifiedDatabaseContext} from "../../backend/modules/tenancy/infrastructure/verified-db-context";
import {OpaqueActivationTokens} from "../../backend/modules/access/infrastructure/activation-tokens";
import {BcryptPasswords} from "../../backend/modules/access/infrastructure/passwords";
import {schoolInput} from "../fixtures/access-management";

const url=process.env.TEST_DATABASE_URL??"";if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test DB required");
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),service=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const},repo=new PrismaStaffInviteRepository(db,new PrismaVerifiedDatabaseContext()),tokens=new OpaqueActivationTokens(),passwords=new BcryptPasswords();
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function fixture(){const school=await service.provisionSchool(schoolInput(),operator);return {school,identity:{accountId:school.accountId,tokenVersion:1}};}
function flow(sender:AccessEmailSender){return createStaffInviteUseCases(repo,sender,tokens,passwords,()=>new Date());}
const sender=(send:AccessEmailSender["sendStaffInvite"]):AccessEmailSender=>({sendPasswordReset:async()=>({ok:true}),sendStaffInvite:send});
async function issue(admin:Awaited<ReturnType<typeof fixture>>,email:string,send:AccessEmailSender["sendStaffInvite"]){return flow(sender(send)).inviteStaff({email,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,roles:["TEACHER"],inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID()});}

it("shows sanitized delivery failure, resends with a fresh token and accepts a new global account",async()=>{
 const admin=await fixture(),email=`invite-${randomUUID()}@vschool.example`,failed=await issue(admin,email,async()=>({ok:false,reason:"mail provider rejected the message"}));
 expect(failed).toMatchObject({deliveryStatus:"FAILED",deliveryFailureReason:"Mail provider rejected the message"});
 const visible=await service.listMembers(admin.identity,admin.school.schoolId);expect(visible.failedInvitations).toContainEqual(expect.objectContaining({email,deliveryFailureReason:"Mail provider rejected the message"}));
 let token="";const resent=await issue(admin,email,async input=>{token=input.token;return {ok:true};});expect(resent.deliveryStatus).toBe("SENT");expect(token).not.toBe("");
 const invites=await db.accessInvite.findMany({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,account:{normalizedEmail:email}},orderBy:{createdAt:"asc"}});expect(invites).toHaveLength(2);expect(invites[0].revokedAt).not.toBeNull();expect(invites[1].tokenHash).not.toBe(token);
 const initialPassword=randomBytes(24).toString("base64url");await flow(sender(async()=>({ok:true}))).acceptStaffInvite({token,initialPassword,confirmation:initialPassword,requestId:randomUUID()});
 const account=await db.userAccount.findUniqueOrThrow({where:{normalizedEmail:email}}),membership=await db.schoolMembership.findUniqueOrThrow({where:{organizationId_schoolId_accountId:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,accountId:account.id}},include:{grants:true}});
 expect(account.status).toBe("ACTIVE");expect(account.emailVerifiedAt).not.toBeNull();expect(account.passwordHash).not.toContain(initialPassword);expect(membership.status).toBe("ACTIVE");expect(membership.grants.map(g=>g.code)).toEqual(["TEACHER"]);expect(await db.accountPersonBinding.count({where:{accountId:account.id}})).toBe(0);expect(await db.employee.count({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId}})).toBe(0);
 await expect(flow(sender(async()=>({ok:true}))).acceptStaffInvite({token,initialPassword,confirmation:initialPassword,requestId:randomUUID()})).rejects.toThrow("INVALID_INVITATION");
});

it("attaches an existing active account without changing its global credentials or status",async()=>{
 const admin=await fixture(),existing=await fixture(),target=await db.userAccount.findUniqueOrThrow({where:{id:existing.school.accountId}}),email=target.normalizedEmail,passwordHash=target.passwordHash,version=target.tokenVersion;let token="";
 await issue(admin,email,async input=>{token=input.token;return {ok:true};});
 await flow(sender(async()=>({ok:true}))).acceptStaffInvite({token,initialPassword:"candidate password should not replace",confirmation:"candidate password should not replace",requestId:randomUUID()});
 const after=await db.userAccount.findUniqueOrThrow({where:{id:target.id}}),membership=await db.schoolMembership.findUniqueOrThrow({where:{organizationId_schoolId_accountId:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,accountId:target.id}}});
 expect(after.status).toBe("ACTIVE");expect(after.passwordHash).toBe(passwordHash);expect(after.tokenVersion).toBe(version);expect(membership.status).toBe("ACTIVE");
});

it("rechecks current inviter authority and refuses acceptance after it is revoked",async()=>{
 const admin=await fixture(),email=`recheck-${randomUUID()}@vschool.example`;let token="";await issue(admin,email,async input=>{token=input.token;return {ok:true};});
 const membership=await db.schoolMembership.findUniqueOrThrow({where:{organizationId_schoolId_accountId:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,accountId:admin.identity.accountId}}});await db.schoolMembership.update({where:{id:membership.id},data:{status:"SUSPENDED",version:{increment:1}}});
 await expect(flow(sender(async()=>({ok:true}))).acceptStaffInvite({token,initialPassword:"long enough initial password",confirmation:"long enough initial password",requestId:randomUUID()})).rejects.toThrow("INVALID_INVITATION");
 const account=await db.userAccount.findUniqueOrThrow({where:{normalizedEmail:email}});expect(account.status).toBe("PENDING");
});
