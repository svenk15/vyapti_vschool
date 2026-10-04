import { afterAll,beforeAll,describe,expect,it } from "vitest";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createAccessServices } from "../../backend/composition/access";
import { createTenancyServices } from "../../backend/composition/tenancy";
import { createStudentsServices } from "../../backend/composition/students";
import { createStudentUseCases } from "../../backend/modules/students/application/students";
import { PrismaStudentRepository } from "../../backend/modules/students/infrastructure/students";
import { PrismaPersonIdentity } from "../../backend/modules/people/infrastructure/person-identity";
import { createPersonIdentityUseCases } from "../../backend/modules/people/application/person-identity";
import { activeStaffFixture,schoolInput } from "../fixtures/access-management";

const url=process.env.TEST_DATABASE_URL??"";if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated Students PostgreSQL test DB required");
const access=createAccessServices({databaseUrl:url}),tenancy=createTenancyServices({databaseUrl:url,releasedModules:["student_core"]}),students=createStudentsServices({databaseUrl:url,cursorSecret:"students-test-cursor-secret-32-bytes-minimum",releasedModules:["student_core"]}),db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),operator={operatorId:randomUUID(),verified:true as const};
type School=Awaited<ReturnType<typeof access.provisionSchool>>;
let primary:School,foreign:School,identity:{accountId:string;tokenVersion:number},foreignIdentity:{accountId:string;tokenVersion:number};
async function provision(){const school=await access.provisionSchool(schoolInput(),operator),actor={accountId:school.accountId,tokenVersion:1};await access.institutionOperation({kind:"SetInstitutionGrant",organizationId:school.organizationId,accountId:school.accountId,status:"ACTIVE",expectedVersion:0,key:randomUUID(),reason:"Synthetic student test authority"},operator);await tenancy.setEntitlement(operator,{kind:"SetOrganizationEntitlement",organizationId:school.organizationId,actorAccountId:school.accountId,moduleId:"student_core",state:"ACTIVE",startsAt:"2026-01-01T00:00:00.000Z",endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:"Synthetic student test entitlement"});const preview=await tenancy.preview(actor,school.organizationId,school.schoolId,["student_core"]);await tenancy.confirm(actor,school.organizationId,school.schoolId,{enabled:["student_core"],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:"Synthetic student test activation"});return {school,actor};}
beforeAll(async()=>{const a=await provision(),b=await provision();primary=a.school;identity=a.actor;foreign=b.school;foreignIdentity=b.actor;});
afterAll(async()=>{await students.disconnect();await tenancy.disconnect();await access.disconnect();await db.$disconnect();});
function input(admissionNumber:string,firstName="Synthetic",lastName="Student"){return {firstName,lastName,admissionNumber,key:randomUUID()};}

describe("STU-01 PostgreSQL student registration",()=>{
  it("preserves zeros, records a PII-free replay receipt and reads scoped list/detail",async()=>{
    const command={...input("0007"),key:randomUUID()},created=await students.create(identity,primary.organizationId,primary.schoolId,command),replayed=await students.create(identity,primary.organizationId,primary.schoolId,command);
    expect(created).toMatchObject({admissionNumber:"0007",displayName:"Synthetic Student",status:"ACTIVE",enrollment:null,replayed:false});expect(replayed).toMatchObject({studentId:created.studentId,replayed:true});
    await students.create(identity,primary.organizationId,primary.schoolId,input("0008","Synthetic","Next"));
    const receipt=await db.commandReceipt.findFirstOrThrow({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,command:"StudentRegistered",key:command.key},select:{response:true}});expect(receipt.response).not.toHaveProperty("displayName");expect(receipt.response).not.toHaveProperty("admissionNumber");
    expect(await students.list(identity,primary.organizationId,primary.schoolId,{search:"0007"})).toMatchObject({items:[{studentId:created.studentId,admissionNumber:"0007"}],nextCursor:null});expect(await students.get(identity,primary.organizationId,primary.schoolId,created.studentId)).toMatchObject({studentId:created.studentId,history:[],enrollment:null});
    const firstPage=await students.list(identity,primary.organizationId,primary.schoolId,{search:"",limit:1});expect(firstPage.nextCursor).toBeTruthy();await expect(students.list(identity,primary.organizationId,primary.schoolId,{search:"",status:"ALL",cursor:firstPage.nextCursor,limit:1})).rejects.toMatchObject({code:"INVALID_CURSOR"});
  });

  it("allows only exact authorized same-institution Person selection and keeps list search separate",async()=>{
    const person=await db.person.create({data:{id:randomUUID(),organizationId:primary.organizationId,firstName:"Exact",lastName:"Selection",contactEmail:null,version:1,createdAt:new Date()}}),foreignPerson=await db.person.create({data:{id:randomUUID(),organizationId:foreign.organizationId,firstName:"Exact",lastName:"Selection",contactEmail:null,version:1,createdAt:new Date()}});
    const choices=await students.findExistingPeople(identity,primary.organizationId,primary.schoolId,"Exact Selection");expect(choices).toEqual([{personId:person.id,displayName:"Exact Selection"}]);expect(await students.findExistingPeople(identity,primary.organizationId,primary.schoolId,"Exact Sele")).toEqual([]);
    const before=await db.person.count({where:{organizationId:primary.organizationId}}),created=await students.create(identity,primary.organizationId,primary.schoolId,{...input("EXIST-01","Exact","Selection"),existingPersonId:person.id});expect(created.personId).toBe(person.id);expect(await db.person.count({where:{organizationId:primary.organizationId}})).toBe(before);
    await expect(students.create(identity,primary.organizationId,primary.schoolId,{...input("FOREIGN-PERSON"),existingPersonId:foreignPerson.id})).rejects.toMatchObject({code:"NOT_FOUND"});
    await expect(students.findExistingPeople(foreignIdentity,primary.organizationId,primary.schoolId,"Exact Selection")).rejects.toMatchObject({code:"FORBIDDEN"});
  });

  it("enforces branch ownership and admission uniqueness under PostgreSQL concurrency",async()=>{
    const [one,two]=await Promise.allSettled([students.create(identity,primary.organizationId,primary.schoolId,input("RACE-0001","Synthetic One")),students.create(identity,primary.organizationId,primary.schoolId,input("RACE-0001","Synthetic Two"))]);
    expect([one,two].filter(value=>value.status==="fulfilled")).toHaveLength(1);expect([one,two].filter(value=>value.status==="rejected")).toHaveLength(1);expect(await db.student.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,admissionNumber:"RACE-0001"}})).toBe(1);expect(await db.person.count({where:{organizationId:primary.organizationId,firstName:{in:["Synthetic One","Synthetic Two"]}}})).toBe(1);
    const otherBranch=await students.create(foreignIdentity,foreign.organizationId,foreign.schoolId,input("RACE-0001"));await expect(students.get(identity,primary.organizationId,primary.schoolId,otherBranch.studentId)).rejects.toMatchObject({code:"NOT_FOUND"});await expect(students.list(foreignIdentity,primary.organizationId,primary.schoolId)).rejects.toMatchObject({code:"FORBIDDEN"});
  });

  it("rolls back Person and Student if platform evidence fails and keeps read/manage permission distinct",async()=>{
    const personPort=createPersonIdentityUseCases(new PrismaPersonIdentity()),failing=createStudentUseCases(new PrismaStudentRepository(db,()=>({async append(){throw new Error("synthetic platform evidence failure");}}),personPort,()=>new Date(),"students-test-cursor-secret-32-bytes-minimum",{student_core:true,academic_core:false,staff_core:false,attendance:false,fees:false,admissions:false,assessments:false,family:false,communication:false,timetable:false,homework:false,transport:false,hr:false,library:false,inventory:false,health:false,analytics:false,ai:false}));
    const peopleBefore=await db.person.count({where:{organizationId:primary.organizationId}}),studentsBefore=await db.student.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}}),schoolBefore=await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}});
    await expect(failing.create(identity,primary.organizationId,primary.schoolId,input("ROLLBACK-01"))).rejects.toMatchObject({code:"UNAVAILABLE"});expect(await db.person.count({where:{organizationId:primary.organizationId}})).toBe(peopleBefore);expect(await db.student.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}})).toBe(studentsBefore);expect((await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}})).configurationVersion).toBe(schoolBefore.configurationVersion);
    const teacher=await activeStaffFixture(db,primary,["TEACHER"]);expect((await students.list(teacher.identity,primary.organizationId,primary.schoolId)).items).toBeDefined();await expect(students.create(teacher.identity,primary.organizationId,primary.schoolId,input("READ-ONLY"))).rejects.toMatchObject({code:"FORBIDDEN"});
    const noRelease=createStudentsServices({databaseUrl:url,cursorSecret:"students-test-cursor-secret-32-bytes-minimum",releasedModules:[]});try{await expect(noRelease.list(identity,primary.organizationId,primary.schoolId)).rejects.toMatchObject({code:"RELEASE_UNAVAILABLE"});}finally{await noRelease.disconnect();}
  });
});
