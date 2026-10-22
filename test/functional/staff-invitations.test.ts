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
import {PrismaEmployeeAccessVerification} from "../../backend/modules/people/infrastructure/employee-access";
import {PrismaCommandEvidence} from "../../backend/modules/platform/infrastructure/command-evidence";

const url=process.env.TEST_DATABASE_URL??"";if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test DB required");
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),service=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const},repo=new PrismaStaffInviteRepository(db,new PrismaVerifiedDatabaseContext(),new PrismaEmployeeAccessVerification(),tx=>new PrismaCommandEvidence(tx)),tokens=new OpaqueActivationTokens(),passwords=new BcryptPasswords();
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function fixture(){const school=await service.provisionSchool(schoolInput(),operator);return {school,identity:{accountId:school.accountId,tokenVersion:1}};}
async function employee(admin:Awaited<ReturnType<typeof fixture>>,suffix=randomUUID()){
 const person=await db.person.create({data:{id:randomUUID(),organizationId:admin.school.organizationId,firstName:'Asha',lastName:'Demo',contactEmail:null,version:1,createdAt:new Date()}});
 return db.employee.create({data:{id:randomUUID(),organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,personId:person.id,staffNumber:`SA14-${suffix}`.slice(0,40),category:'TEACHING',employedFrom:new Date('2025-01-01T00:00:00Z'),employedTo:null,status:'ACTIVE',version:1}});
}
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

it("atomically anchors a pending invitation to an active Employee and replays without redelivery",async()=>{
 const admin=await fixture(),selected=await employee(admin),email=`employee-grant-${randomUUID()}@example.test`,key=randomUUID();let sends=0;
 const grant=()=>flow(sender(async()=>{sends++;return {ok:false,reason:'mail provider timeout'}})).grantEmployeeAccess({employeeId:selected.id,email,verificationReference:'VERIFY-SA14-001',confirmed:true,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,roles:['TEACHER'],inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID(),key});
 const first=await grant();expect(first).toMatchObject({deliveryStatus:'FAILED',deliveryFailureReason:'Mail provider timed out',replayed:false});
 const account=await db.userAccount.findUniqueOrThrow({where:{normalizedEmail:email}}),membership=await db.schoolMembership.findUniqueOrThrow({where:{organizationId_schoolId_accountId:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,accountId:account.id}},include:{grants:true}}),binding=await db.accountPersonBinding.findUniqueOrThrow({where:{organizationId_accountId:{organizationId:admin.school.organizationId,accountId:account.id}}});
 expect({status:membership.status,roles:membership.grants.map(g=>g.code),personId:binding.personId}).toEqual({status:'PENDING',roles:['TEACHER'],personId:selected.personId});
 expect(await db.commandReceipt.count({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,actorAccountId:admin.identity.accountId,command:'GrantEmployeeAccess',key}})).toBe(1);
 const event=await db.authSecurityEvent.findFirstOrThrow({where:{accountId:account.id,kind:'PERSON_BINDING_VERIFIED'}});expect(JSON.stringify(event.policySnapshot)).toContain('VERIFY-SA14-001');
 const unrestrictedEvidence=JSON.stringify(await Promise.all([db.auditEntry.findMany({where:{requestId:event.requestId}}),db.outboxEvent.findMany({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,aggregateId:membership.id}}),db.commandReceipt.findMany({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,command:'GrantEmployeeAccess',key}})]));expect(unrestrictedEvidence).not.toContain('VERIFY-SA14-001');expect(unrestrictedEvidence).not.toContain(email);
 await expect(grant()).resolves.toMatchObject({invitationId:first.invitationId,deliveryStatus:'FAILED',replayed:true});expect(sends).toBe(1);
 await expect(flow(sender(async()=>({ok:true}))).grantEmployeeAccess({employeeId:selected.id,email,verificationReference:'DIFFERENT-REFERENCE',confirmed:true,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,roles:['TEACHER'],inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID(),key})).rejects.toThrow('IDEMPOTENCY_CONFLICT');
});

it("rejects foreign Employees and binding or duplicate grant conflicts without partial rows",async()=>{
 const admin=await fixture(),foreignAdmin=await fixture(),foreignEmployee=await employee(foreignAdmin),email=`foreign-${randomUUID()}@example.test`;
 await expect(flow(sender(async()=>({ok:true}))).grantEmployeeAccess({employeeId:foreignEmployee.id,email,verificationReference:'VERIFY-FOREIGN',confirmed:true,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,roles:['TEACHER'],inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID(),key:randomUUID()})).rejects.toThrow('NOT_FOUND');expect(await db.userAccount.count({where:{normalizedEmail:email}})).toBe(0);
 const selected=await employee(admin),firstEmail=`bound-${randomUUID()}@example.test`,grantInput={employeeId:selected.id,email:firstEmail,verificationReference:'VERIFY-BOUND',confirmed:true,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,roles:['TEACHER'] as const,inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID()};
 await flow(sender(async()=>({ok:false,reason:'offline'}))).grantEmployeeAccess({...grantInput,key:randomUUID()});
 await expect(flow(sender(async()=>({ok:true}))).grantEmployeeAccess({...grantInput,key:randomUUID()})).rejects.toThrow('CONFLICT');expect(await db.schoolMembership.count({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,account:{normalizedEmail:firstEmail}}})).toBe(1);
});

it("keeps the verified Employee link for OPERATOR_CLI without creating or sending an email invitation",async()=>{
 const admin=await fixture(),selected=await employee(admin),email=`operator-grant-${randomUUID()}@example.test`;await db.organization.update({where:{id:admin.school.organizationId},data:{trustMode:'OPERATOR_CLI'}});let sends=0;
 const result=await flow(sender(async()=>{sends++;return {ok:true}})).grantEmployeeAccess({employeeId:selected.id,email,verificationReference:'VERIFY-OPERATOR',confirmed:true,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,roles:['TEACHER'],inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID(),key:randomUUID()});
 expect(result).toMatchObject({activationPath:'OPERATOR_ACTIVATION',deliveryStatus:'NOT_APPLICABLE',replayed:false});expect(sends).toBe(0);const account=await db.userAccount.findUniqueOrThrow({where:{normalizedEmail:email}});expect(await db.accountPersonBinding.count({where:{organizationId:admin.school.organizationId,accountId:account.id,personId:selected.personId}})).toBe(1);expect(await db.schoolMembership.count({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,accountId:account.id,status:'PENDING'}})).toBe(1);expect(await db.accessInvite.count({where:{accountId:account.id}})).toBe(0);
});

it("reasoned Employee resend replaces one failed invitation, replays exactly and denies protected replay after revocation",async()=>{
 const admin=await fixture(),selected=await employee(admin),email=`employee-resend-${randomUUID()}@example.test`;await db.organization.update({where:{id:admin.school.organizationId},data:{trustMode:'HYBRID'}});
 const failed=await flow(sender(async()=>({ok:false,reason:'mail provider timeout'}))).grantEmployeeAccess({employeeId:selected.id,email,verificationReference:'VERIFY-RESEND',confirmed:true,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,roles:['TEACHER'],inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID(),key:randomUUID()});
 expect(failed.deliveryStatus).toBe('FAILED');const key=randomUUID(),reason='Corrected the fictional delivery configuration';let sends=0;
 const resend=()=>flow(sender(async()=>{sends++;return {ok:true}})).resendEmployeeInvitation({employeeId:selected.id,invitationId:failed.invitationId,reason,organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID(),key});
 const first=await resend();expect(first).toMatchObject({deliveryStatus:'SENT',replayed:false});expect(first.invitationId).not.toBe(failed.invitationId);
 await expect(resend()).resolves.toMatchObject({invitationId:first.invitationId,deliveryStatus:'SENT',replayed:true});expect(sends).toBe(1);
 const invites=await db.accessInvite.findMany({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,account:{normalizedEmail:email}},orderBy:{createdAt:'asc'}});expect(invites).toHaveLength(2);expect(invites[0].revokedAt).not.toBeNull();expect(invites[1]).toMatchObject({id:first.invitationId,deliveryStatus:'SENT',revokedAt:null});
 expect(await db.commandReceipt.count({where:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,actorAccountId:admin.identity.accountId,command:'ResendEmployeeInvitation',key}})).toBe(1);const event=await db.authSecurityEvent.findFirstOrThrow({where:{kind:'STAFF_INVITE_REISSUED',account:{normalizedEmail:email}}});expect(JSON.stringify(event.policySnapshot)).toContain(reason);
 await expect(flow(sender(async()=>({ok:true}))).resendEmployeeInvitation({employeeId:selected.id,invitationId:failed.invitationId,reason:'A different reviewed resend reason',organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,inviterAccountId:admin.identity.accountId,inviterTokenVersion:admin.identity.tokenVersion,requestId:randomUUID(),key})).rejects.toThrow('IDEMPOTENCY_CONFLICT');
 const actorMembership=await db.schoolMembership.findUniqueOrThrow({where:{organizationId_schoolId_accountId:{organizationId:admin.school.organizationId,schoolId:admin.school.schoolId,accountId:admin.identity.accountId}}});await db.schoolMembership.update({where:{id:actorMembership.id},data:{status:'SUSPENDED',version:{increment:1}}});await expect(resend()).rejects.toThrow('FORBIDDEN');expect(sends).toBe(1);
});
