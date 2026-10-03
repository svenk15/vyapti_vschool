import { randomUUID } from "node:crypto";
import { afterAll,it,expect } from "vitest";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createAccessServices } from "../../backend/composition/access";
import { PrismaManagementRepository } from "../../backend/modules/access/infrastructure/management";
import { createManagementUseCases } from "../../backend/modules/access/application/management";
import { PrismaCommandEvidence } from "../../backend/modules/platform/infrastructure/command-evidence";
import { PrismaScheduledSessions } from "../../backend/modules/attendance/infrastructure/scheduled-sessions";
import { schoolInput,activeStaffFixture } from "../fixtures/access-management";
const url=process.env.TEST_DATABASE_URL??"";if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test DB required");
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),service=createAccessServices({databaseUrl:url,cursorSecret:randomUUID()});
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function setup(){const input=schoolInput(),ids=await service.provisionSchool(input,{operatorId:randomUUID(),verified:true});return {input,ids,identity:{accountId:ids.accountId,tokenVersion:1}};}
it("settings persist with atomic envelopes, identical replay and stale/changed-key conflicts",async()=>{
 const {ids,identity}=await setup(),key=randomUUID(),body={payload:{name:"Saved synthetic school",timezone:"Europe/London"},expectedVersion:1};const result=await service.command(identity,"UpdateSchool",body,key);
 expect(result.version).toBe(2);expect((await service.command(identity,"UpdateSchool",body,key)).replayed).toBe(true);expect(await db.auditEntry.count({where:{resourceId:ids.schoolId,command:"UpdateSchool"}})).toBe(1);expect(await db.outboxEvent.count({where:{aggregateId:ids.schoolId,type:"UpdateSchool.v1"}})).toBe(1);
 await expect(service.command(identity,"UpdateSchool",{...body,payload:{...body.payload,name:"Different"}},key)).rejects.toThrow("IDEMPOTENCY_CONFLICT");await expect(service.command(identity,"UpdateSchool",body,randomUUID())).rejects.toThrow("STALE_VERSION");expect((await service.getSettings(identity)).name).toBe("Saved synthetic school");
});
it("rolls settings and all actual envelopes back after an enlisted evidence failure",async()=>{
 const {ids,identity}=await setup();let appended=false;
 const faulty=createManagementUseCases(new PrismaManagementRepository(db,tx=>({append:async e=>{await new PrismaCommandEvidence(tx).append(e);appended=true;throw new Error("injected");}}),tx=>new PrismaScheduledSessions(tx),randomUUID()));
 await expect(faulty.command(identity,"UpdateSchool",{payload:{name:"Never persisted",timezone:"Asia/Kolkata"},expectedVersion:1},randomUUID())).rejects.toThrow("UNAVAILABLE");expect(appended).toBe(true);expect((await service.getSettings(identity)).version).toBe(1);expect(await db.auditEntry.count({where:{resourceId:ids.schoolId,command:"UpdateSchool"}})).toBe(0);expect(await db.commandReceipt.count({where:{schoolId:ids.schoolId}})).toBe(0);
});
it("creates pending staff, campuses and duplicate-safe retries without hashes in DTO/evidence",async()=>{
 const {identity,ids}=await setup(),email=`pending-${randomUUID()}@vschool.example`,key=randomUUID(),body={payload:{email,roles:["TEACHER"]}};
 const member=await service.command(identity,"CreateMembership",body,key);expect(member.status).toBe("PENDING");expect((await service.command(identity,"CreateMembership",body,key)).resourceId).toBe(member.resourceId);await expect(service.command(identity,"CreateMembership",body,randomUUID())).rejects.toThrow("CONFLICT");
 const account=await db.userAccount.findUniqueOrThrow({where:{normalizedEmail:email}});expect(account.passwordHash).toBeNull();const list=await service.listMembers(identity);expect(JSON.stringify(list)).not.toMatch(/passwordHash|failedAttempts|lockedUntil/);
 await service.command(identity,"CreateCampus",{payload:{code:"SITE",name:"Synthetic site"}},randomUUID());await expect(service.command(identity,"CreateCampus",{payload:{code:"SITE",name:"Duplicate"}},randomUUID())).rejects.toThrow("CONFLICT");expect((await service.getSettings(identity)).campuses).toHaveLength(1);
 const foreign=await setup();await expect(db.campus.create({data:{id:randomUUID(),organizationId:foreign.ids.organizationId,schoolId:ids.schoolId,code:"FORGED",name:"Denied",status:"ACTIVE",version:1}})).rejects.toMatchObject({code:"P2003"});
 await service.command(identity,"UpdateMembership",{payload:{action:"SET_ROLES",roles:["SCHOOL_ADMIN"],reason:"Synthetic pending administrator"},expectedVersion:1},randomUUID(),ids.schoolId,member.resourceId);await expect(service.command(identity,"UpdateMembership",{payload:{action:"REVOKE",reason:"Pending administrator cannot replace active"},expectedVersion:1},randomUUID(),ids.schoolId,ids.membershipId)).rejects.toThrow("LAST_ADMIN");
 expect(JSON.stringify(await db.auditEntry.findMany({where:{schoolId:ids.schoolId}}))).not.toContain(email);
});
it("two concurrent self-revocations leave exactly one active administrator",async()=>{
 const {identity,ids}=await setup(),second=await activeStaffFixture(db,ids,["SCHOOL_ADMIN"]);
 const results=await Promise.allSettled([[identity,ids.membershipId],[second.identity,second.membershipId]].map(async([actor,id])=>service.command(actor as typeof identity,"UpdateMembership",{payload:{action:"REVOKE",reason:"Synthetic race verification"},expectedVersion:1},randomUUID(),ids.schoolId,id as string)));
 expect(results.filter(r=>r.status==="fulfilled")).toHaveLength(1);expect((results.find(r=>r.status==="rejected") as PromiseRejectedResult).reason.code).toBe("LAST_ADMIN");expect(await db.schoolMembership.count({where:{schoolId:ids.schoolId,status:"ACTIVE",grants:{some:{code:"SCHOOL_ADMIN"}}}})).toBe(1);
});
it("current teacher membership/roles revoke immediately, replay reauthorizes and foreign attachment is denied",async()=>{
 const {identity,ids}=await setup(),teacher=await activeStaffFixture(db,ids),foreign=await setup();expect((await service.getAccountHome(teacher.identity)).scope.schoolId).toBe(ids.schoolId);
 const key=randomUUID();await service.command(identity,"UpdateMembership",{payload:{action:"SUSPEND",reason:"Synthetic access check"},expectedVersion:1},key,ids.schoolId,teacher.membershipId);await expect(service.getAccountHome(teacher.identity)).rejects.toThrow("NOT_FOUND");
 await service.command(identity,"UpdateMembership",{payload:{action:"REINSTATE",reason:"Synthetic access restored"},expectedVersion:2},randomUUID(),ids.schoolId,teacher.membershipId);expect(await service.getAccountHome(teacher.identity)).toBeDefined();
 await expect(service.command(identity,"CreateMembership",{payload:{targetAccountId:foreign.ids.accountId,roles:["TEACHER"]}},randomUUID())).rejects.toThrow("NOT_FOUND");await expect(service.command(identity,"UpdateMembership",{payload:{action:"REVOKE",reason:"Foreign request"},expectedVersion:1},randomUUID(),ids.schoolId,foreign.ids.membershipId)).rejects.toThrow("NOT_FOUND");
 await expect(service.command(teacher.identity,"CreateCampus",{payload:{code:"NO",name:"Denied"}},randomUUID())).rejects.toThrow("NOT_FOUND");
 await db.schoolMembership.update({where:{id:ids.membershipId},data:{status:"SUSPENDED",version:{increment:1}}});await expect(service.command(identity,"UpdateMembership",{payload:{action:"SUSPEND",reason:"Synthetic access check"},expectedVersion:1},key,ids.schoolId,teacher.membershipId)).rejects.toThrow("NOT_FOUND");
});
it("timezone decision calls the scoped owner port and fails closed",async()=>{
 const {identity,ids}=await setup();const guarded=createManagementUseCases(new PrismaManagementRepository(db,tx=>new PrismaCommandEvidence(tx),()=>({hasAny:async(org,school)=>{expect(org).toBe(ids.organizationId);expect(school).toBe(ids.schoolId);return true;}}),randomUUID()));
 await expect(guarded.command(identity,"UpdateSchool",{payload:{name:"Synthetic school",timezone:"Europe/London"},expectedVersion:1},randomUUID())).rejects.toThrow("TIMEZONE_IN_USE");expect((await service.getSettings(identity)).version).toBe(1);
 const unavailable=createManagementUseCases(new PrismaManagementRepository(db,tx=>new PrismaCommandEvidence(tx),()=>({hasAny:async()=>{throw new Error("injected owner read failure");}}),randomUUID()));await expect(unavailable.command(identity,"UpdateSchool",{payload:{name:"Never persisted",timezone:"Europe/London"},expectedVersion:1},randomUUID())).rejects.toThrow("UNAVAILABLE");expect((await service.getSettings(identity)).version).toBe(1);
});
it("opaque staff cursors are scoped, signed and bounded at 50 records",async()=>{
 const {identity,ids}=await setup();await db.$transaction(async tx=>{for(let i=0;i<51;i++){const accountId=randomUUID();await tx.userAccount.create({data:{id:accountId,normalizedEmail:`page-${accountId}@vschool.example`,status:"PENDING",tokenVersion:1,failedAttempts:0,version:1,createdAt:new Date()}});await tx.schoolMembership.create({data:{id:randomUUID(),organizationId:ids.organizationId,schoolId:ids.schoolId,accountId,status:"PENDING",version:1}});}});
 const page=await service.listMembers(identity);expect(page.items).toHaveLength(50);expect(page.nextCursor).not.toBeNull();const next=await service.listMembers(identity,ids.schoolId,page.nextCursor!);expect(next.items).toHaveLength(2);expect(new Set([...page.items,...next.items].map(m=>m.accountId)).size).toBe(52);await expect(service.listMembers(identity,ids.schoolId,page.nextCursor!+"invalid")).rejects.toThrow("INVALID_CURSOR");const other=await setup();await expect(service.listMembers(other.identity,other.ids.schoolId,page.nextCursor!)).rejects.toThrow("INVALID_CURSOR");
});
