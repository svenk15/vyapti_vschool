import { randomBytes,randomUUID } from "node:crypto";
import { afterAll,it,expect } from "vitest";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createAccessServices } from "../../backend/composition/access";
import { createAccessUseCases } from "../../backend/modules/access/application/services";
import { PrismaAccessRepository } from "../../backend/modules/access/infrastructure/repository";
import { BcryptPasswords } from "../../backend/modules/access/infrastructure/passwords";
import { PrismaProvisionEvidence } from "../../backend/modules/platform/infrastructure/provision-evidence";
import {PrismaVerifiedDatabaseContext} from '../../backend/modules/tenancy/infrastructure/verified-db-context';
const url=process.env.TEST_DATABASE_URL??"";
if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test database required");
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url,connectionTimeoutMillis:5000,max:10}),log:[]});
const service=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const};
function fixture(){const suffix=randomUUID();return {organizationName:`Synthetic test ${suffix}`,schoolName:`Synthetic school ${suffix}`,schoolCode:"MAIN",timezone:"Asia/Kolkata",adminEmail:`test-${suffix}@vschool.example`,password:randomBytes(24).toString("base64url")};}
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
it("provisions all aggregates and safe operator evidence atomically",async()=>{
 const input=fixture(),ids=await service.provisionSchool(input,operator);
 const account=await db.userAccount.findUniqueOrThrow({where:{id:ids.accountId}});expect(account.passwordHash).toMatch(/^\$2[ab]\$12\$/);expect(account.passwordHash).not.toBe(input.password);
 expect(await db.schoolMembership.count({where:{id:ids.membershipId}})).toBe(1);expect(await db.roleGrant.count({where:{membershipId:ids.membershipId,code:"SCHOOL_ADMIN"}})).toBe(1);
 const audit=await db.auditEntry.findFirstOrThrow({where:{resourceId:ids.schoolId}}),event=await db.outboxEvent.findFirstOrThrow({where:{aggregateId:ids.schoolId}});
 expect(audit.after).toMatchObject({principalKind:"OPERATOR",operatorId:operator.operatorId});expect(event.state).toBe("PENDING");expect(JSON.stringify([audit,event])).not.toContain(input.password);expect(JSON.stringify([audit,event])).not.toContain(input.adminEmail);
});
it("rolls the entire provision back when enlisted evidence fails",async()=>{
 let enlistedSchool:string|undefined;
 const input=fixture();const failing=createAccessUseCases(new PrismaAccessRepository(db,tx=>({appendProvisioned:async evidence=>{enlistedSchool=evidence.schoolId;await new PrismaProvisionEvidence(tx).appendProvisioned(evidence);throw new Error("injected platform failure");}}),new PrismaVerifiedDatabaseContext()),new BcryptPasswords(),randomUUID);
 await expect(failing.provisionSchool(input,operator)).rejects.toThrow("UNAVAILABLE");expect(await db.organization.count({where:{name:input.organizationName}})).toBe(0);expect(await db.userAccount.count({where:{normalizedEmail:input.adminEmail}})).toBe(0);
 expect(enlistedSchool).toBeDefined();expect(await db.auditEntry.count({where:{resourceId:enlistedSchool}})).toBe(0);expect(await db.outboxEvent.count({where:{aggregateId:enlistedSchool}})).toBe(0);
});
it("serializes duplicate institution bootstrap and handles unique email races without partial schools",async()=>{
 const input=fixture();const results=await Promise.allSettled([service.provisionSchool(input,operator),service.provisionSchool({...input,adminEmail:fixture().adminEmail},operator)]);
 expect(results.filter(r=>r.status==="fulfilled")).toHaveLength(1);expect((results.find(r=>r.status==="rejected") as PromiseRejectedResult).reason.code).toBe("PROVISION_CONFLICT");expect(await db.organization.count({where:{name:input.organizationName}})).toBe(1);
 const sharedEmail=fixture().adminEmail,a={...fixture(),adminEmail:sharedEmail},b={...fixture(),adminEmail:sharedEmail};const race=await Promise.allSettled([service.provisionSchool(a,operator),service.provisionSchool(b,operator)]);expect(race.filter(r=>r.status==="fulfilled")).toHaveLength(1);expect((race.find(r=>r.status==="rejected") as PromiseRejectedResult).reason.code).toBe("PROVISION_CONFLICT");expect(await db.organization.count({where:{name:{in:[a.organizationName,b.organizationName]}}})).toBe(1);
});
it("rejects invalid zone before writes",async()=>{const input={...fixture(),timezone:"Invalid/Zone"};await expect(service.provisionSchool(input,operator)).rejects.toThrow("VALIDATION");expect(await db.organization.count({where:{name:input.organizationName}})).toBe(0);});
it("serializes concurrent failures, locks valid credentials, and recovers after expiry",async()=>{
 let clock=new Date();const timed=createAccessUseCases(new PrismaAccessRepository(db,tx=>new PrismaProvisionEvidence(tx),new PrismaVerifiedDatabaseContext(),()=>clock),new BcryptPasswords(),randomUUID);
 const input=fixture(),ids=await timed.provisionSchool(input,operator),wrong=randomBytes(24).toString("hex");
 const failures=await Promise.all(Array.from({length:5},()=>timed.authenticate(input.adminEmail,wrong)));expect(failures).toEqual([null,null,null,null,null]);
 const locked=await db.userAccount.findUniqueOrThrow({where:{id:ids.accountId}});expect(locked.failedAttempts).toBe(5);expect(locked.lockedUntil).toEqual(new Date(clock.getTime()+900000));expect(await timed.authenticate(input.adminEmail,input.password)).toBeNull();
 clock=new Date(clock.getTime()+900001);expect(await timed.authenticate(input.adminEmail,input.password)).toEqual({accountId:ids.accountId,tokenVersion:1});expect((await db.userAccount.findUniqueOrThrow({where:{id:ids.accountId}})).failedAttempts).toBe(0);
});
it("checks disabled, token revocation, current membership and foreign scope on every read",async()=>{
 const input=fixture(),ids=await service.provisionSchool(input,operator),other=await service.provisionSchool(fixture(),operator),identity=await service.authenticate(input.adminEmail,input.password);
 expect(await service.getSelfAccount(identity)).toMatchObject({accountId:ids.accountId,email:input.adminEmail,status:'ACTIVE'});
 expect((await service.getAdminHome(identity)).scope.schoolId).toBe(ids.schoolId);await expect(service.getAdminHome(identity,other.schoolId)).rejects.toThrow("NOT_FOUND");
 await db.schoolMembership.update({where:{id:ids.membershipId},data:{status:"SUSPENDED",version:{increment:1}}});await expect(service.getAdminHome(identity)).rejects.toThrow("NOT_FOUND");
 await db.schoolMembership.update({where:{id:ids.membershipId},data:{status:"ACTIVE",version:{increment:1}}});
 await db.userAccount.update({where:{id:ids.accountId},data:{tokenVersion:{increment:1},version:{increment:1}}});await expect(service.getAdminHome(identity)).rejects.toThrow("UNAUTHENTICATED");await expect(service.getSelfAccount(identity)).rejects.toThrow('UNAUTHENTICATED');
 await db.userAccount.update({where:{id:ids.accountId},data:{status:"DISABLED",version:{increment:1}}});expect(await service.authenticate(input.adminEmail,input.password)).toBeNull();expect(await service.authenticate(fixture().adminEmail,input.password)).toBeNull();
});
it("rechecks organization, branch and administrator grant on each read",async()=>{
 const input=fixture(),ids=await service.provisionSchool(input,operator),identity=await service.authenticate(input.adminEmail,input.password);
 await db.organization.update({where:{id:ids.organizationId},data:{status:"SUSPENDED",version:{increment:1}}});await expect(service.getAdminHome(identity)).rejects.toThrow("NOT_FOUND");
 await db.organization.update({where:{id:ids.organizationId},data:{status:"ACTIVE",version:{increment:1}}});
 await db.school.update({where:{id:ids.schoolId},data:{status:"SUSPENDED",version:{increment:1}}});await expect(service.getAdminHome(identity)).rejects.toThrow("NOT_FOUND");
 await db.school.update({where:{id:ids.schoolId},data:{status:"ACTIVE",version:{increment:1}}});
 await db.roleGrant.updateMany({where:{membershipId:ids.membershipId},data:{code:"TEACHER"}});await expect(service.getAdminHome(identity)).rejects.toThrow("NOT_FOUND");
});
it("scoped composite foreign keys reject a forged grant and history guards reject mutation",async()=>{
 const a=await service.provisionSchool(fixture(),operator),b=await service.provisionSchool(fixture(),operator);
 await expect(db.roleGrant.create({data:{id:randomUUID(),organizationId:b.organizationId,schoolId:b.schoolId,membershipId:a.membershipId,code:"TEACHER"}})).rejects.toMatchObject({code:"P2003"});
 const audit=await db.auditEntry.findFirstOrThrow({where:{resourceId:a.schoolId}});
 await expect(db.$executeRaw`UPDATE vs_platform_audit_entry SET reason='changed' WHERE id=${audit.id}::uuid`).rejects.toThrow();
 expect((await db.auditEntry.findUniqueOrThrow({where:{id:audit.id}})).reason).toBe(audit.reason);
 const receipt=await db.commandReceipt.create({data:{id:randomUUID(),organizationId:a.organizationId,schoolId:a.schoolId,actorAccountId:a.accountId,command:"test",key:randomBytes(16).toString("hex"),inputHash:"a".repeat(64),response:{ok:true},createdAt:new Date()}});
 await expect(db.commandReceipt.delete({where:{id:receipt.id}})).rejects.toThrow();
});
it("login evidence is append-only and contains no submitted identifiers or credentials",async()=>{
 const input=fixture(),ids=await service.provisionSchool(input,operator);await service.authenticate(input.adminEmail,input.password);
 const event=await db.authSecurityEvent.findFirstOrThrow({where:{accountId:ids.accountId}});expect(event.kind).toBe("LOGIN_SUCCEEDED");expect(JSON.stringify(event)).not.toContain(input.adminEmail);await expect(db.authSecurityEvent.delete({where:{id:event.id}})).rejects.toThrow();
});
