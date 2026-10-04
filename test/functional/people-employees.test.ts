import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createPeopleServices} from '../../backend/composition/people';
import {createPeopleUseCases} from '../../backend/modules/people/application/employees';
import {PrismaPeopleRepository} from '../../backend/modules/people/infrastructure/employees';
import {PrismaInstitutionEvidence} from '../../backend/modules/tenancy/infrastructure/evidence';
import {capabilityReleaseManifest} from '../../backend/modules/tenancy/domain/entitlements';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {activeStaffFixture} from '../fixtures/access-management';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated People PostgreSQL test DB required');
const access=createAccessServices({databaseUrl:url}),tenancy=createTenancyServices({databaseUrl:url,releasedModules:['academic_core']}),people=createPeopleServices({databaseUrl:url,cursorSecret:'people-test-cursor-secret-32-bytes-minimum',releasedModules:['academic_core']}),db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
let primary:Awaited<ReturnType<typeof access.provisionSchool>>,foreign:Awaited<ReturnType<typeof access.provisionSchool>>,identity:{accountId:string;tokenVersion:number};
beforeAll(async()=>{primary=await access.provisionSchool(schoolInput(),{operatorId:randomUUID(),verified:true});foreign=await access.provisionSchool(schoolInput(),{operatorId:randomUUID(),verified:true});identity={accountId:primary.accountId,tokenVersion:1};const operator={operatorId:randomUUID(),verified:true as const};await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:primary.organizationId,accountId:primary.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic PER-02 entitlement authority'},operator);await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:primary.organizationId,actorAccountId:primary.accountId,moduleId:'academic_core',state:'ACTIVE',startsAt:new Date('2026-01-01T00:00:00Z').toISOString(),endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Synthetic PER-02 contract'});const preview=await tenancy.preview(identity,primary.organizationId,primary.schoolId,['academic_core']);await tenancy.confirm(identity,primary.organizationId,primary.schoolId,{enabled:['academic_core'],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:'Synthetic PER-02 branch activation'});});
afterAll(async()=>{await people.disconnect();await access.disconnect();await tenancy.disconnect();await db.$disconnect();});
function input(staffNumber:string,firstName='Synthetic',lastName='Teacher'){return {firstName,lastName,contactEmail:null,staffNumber,employedFrom:'2026-04-01',key:randomUUID()};}

describe('PER-01 PostgreSQL employee profiles',()=>{
 it('creates distinct same-name People profiles, pages scoped staff, and leaves accounts unlinked',async()=>{
  const firstIntent=input('STAFF-001','Alex','Morgan'),one=await people.createEmployee(identity,primary.organizationId,primary.schoolId,firstIntent),replayed=await people.createEmployee(identity,primary.organizationId,primary.schoolId,firstIntent),two=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('STAFF-002','Alex','Morgan'));expect(replayed).toMatchObject({employeeId:one.employeeId,replayed:true});
  expect(one).toMatchObject({staffNumber:'STAFF-001',person:{displayName:'Alex Morgan'},portalAccess:'UNLINKED'});expect(two.person.id).not.toBe(one.person.id);
  const first=await people.workspace(identity,primary.organizationId,primary.schoolId,{limit:1});expect(first.employees).toHaveLength(1);expect(first.nextCursor).toBeTruthy();
  const second=await people.workspace(identity,primary.organizationId,primary.schoolId,{limit:1,cursor:first.nextCursor});expect(second.employees).toHaveLength(1);expect(second.employees[0]?.employeeId).not.toBe(first.employees[0]?.employeeId);expect(second.nextCursor).toBeNull();
  const searched=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:'Alex'});expect(searched.employees).toHaveLength(2);expect(searched.employees.every(employee=>employee.portalAccess==='UNLINKED')).toBe(true);
  await db.accountPersonBinding.create({data:{id:randomUUID(),organizationId:primary.organizationId,accountId:primary.accountId,personId:one.person.id,verifiedAt:new Date(),verifiedBy:primary.accountId}});const linked=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:'STAFF-001'});expect(linked.employees[0]?.portalAccess).toBe('ACTIVE');
  await expect(people.workspace(identity,foreign.organizationId,foreign.schoolId)).rejects.toMatchObject({code:'FORBIDDEN'});
 });

 it('serializes duplicate staff numbers and enforces the organization-scoped Person FK',async()=>{
  const attempts=await Promise.allSettled([people.createEmployee(identity,primary.organizationId,primary.schoolId,input('RACE-01')),people.createEmployee(identity,primary.organizationId,primary.schoolId,input('RACE-01'))]);expect(attempts.filter(value=>value.status==='fulfilled')).toHaveLength(1);expect(attempts.filter(value=>value.status==='rejected')).toHaveLength(1);expect(await db.employee.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,staffNumber:'RACE-01'}})).toBe(1);
  const foreignPerson=await db.person.create({data:{id:randomUUID(),organizationId:foreign.organizationId,firstName:'Foreign',lastName:'Person',contactEmail:null,version:1,createdAt:new Date()}});
  await expect(db.employee.create({data:{id:randomUUID(),organizationId:primary.organizationId,schoolId:primary.schoolId,personId:foreignPerson.id,staffNumber:'FORGED',employedFrom:new Date('2026-01-01T00:00:00Z'),employedTo:null,status:'ACTIVE',version:1}})).rejects.toMatchObject({code:'P2003'});
 });

 it('rolls back both Person and Employee with school revision, receipt and events if evidence fails',async()=>{
  const failing=createPeopleUseCases(new PrismaPeopleRepository(db,()=>({async append(){throw new Error('synthetic evidence writer failure');}}),()=>new Date('2026-05-01T00:00:00Z'),'people-test-cursor-secret-32-bytes-minimum'));
  const before=await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}}),persons=await db.person.count({where:{organizationId:primary.organizationId}}),employees=await db.employee.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}}),receipts=await db.tenantCommandReceipt.count({where:{organizationId:primary.organizationId,actorAccountId:primary.accountId,command:'EmployeeCreated'}}),events=await db.tenantOutbox.count({where:{organizationId:primary.organizationId,type:'PersonRegistered.v1'}});
  await expect(failing.createEmployee(identity,primary.organizationId,primary.schoolId,{...input('ROLLBACK'),key:randomUUID()})).rejects.toMatchObject({code:'UNAVAILABLE'});
  expect(await db.person.count({where:{organizationId:primary.organizationId}})).toBe(persons);expect(await db.employee.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}})).toBe(employees);expect((await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}})).configurationVersion).toBe(before.configurationVersion);expect(await db.tenantCommandReceipt.count({where:{organizationId:primary.organizationId,actorAccountId:primary.accountId,command:'EmployeeCreated'}})).toBe(receipts);expect(await db.tenantOutbox.count({where:{organizationId:primary.organizationId,type:'PersonRegistered.v1'}})).toBe(events);
 });
});

describe('PER-02 PostgreSQL cross-owner staff lifecycle',()=>{
 it('enables a scoped teacher, binds only a verified same-branch teacher account, and ends employment atomically',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-STAFF','Teacher','Synthetic'));
  const enabled=await people.enableTeacher(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,key:randomUUID()});expect(enabled).toMatchObject({teachingEligibility:'ENABLED',teacherId:expect.any(String)});expect(await db.teacher.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,employeeId:employee.employeeId,active:true}})).toBe(1);
  const target=await activeStaffFixture(db,primary,['TEACHER']);await db.userAccount.update({where:{id:target.accountId},data:{emailVerifiedAt:new Date()}});
  const bound=await people.bindAccount(identity,primary.organizationId,primary.schoolId,employee.employeeId,{accountId:target.accountId,verificationReference:'synthetic-check-42',reason:'Identity verified out of band',key:randomUUID()});expect(bound.portalAccess).toBe('ACTIVE');expect(await db.accountPersonBinding.count({where:{organizationId:primary.organizationId,accountId:target.accountId,personId:employee.person.id}})).toBe(1);expect(await db.authSecurityEvent.count({where:{accountId:target.accountId,kind:'PERSON_BINDING_VERIFIED',policySnapshot:{path:['verificationReference'],equals:'synthetic-check-42'}}})).toBe(1);
  const next=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-OTHER'));await expect(people.bindAccount(identity,primary.organizationId,primary.schoolId,next.employeeId,{accountId:target.accountId,verificationReference:'synthetic-check-43',reason:'Second binding attempt',key:randomUUID()})).rejects.toMatchObject({code:'CONFLICT'});
  const ended=await people.endEmployment(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,effectiveDate:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),reason:'Employment ended today',key:randomUUID()});expect(ended.employment.status).toBe('ENDED');expect(ended.teachingEligibility).toBe('DISABLED');expect(ended.employment.to).not.toBeNull();expect(await db.teacher.findFirstOrThrow({where:{employeeId:employee.employeeId}})).toMatchObject({active:false,version:2});
 });
 it('rolls back Teacher eligibility when an owner facade fails',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-ROLLBACK'));
  const failing=createPeopleUseCases(new PrismaPeopleRepository(db,tx=>new PrismaInstitutionEvidence(tx),()=>new Date(),'people-test-cursor-secret-32-bytes-minimum',undefined,{async enable(){throw new Error('synthetic academics failure');},async disable(){return null;}},capabilityReleaseManifest(['academic_core'])));
  const receipts=await db.commandReceipt.count({where:{organizationId:primary.organizationId,command:'TeacherEligibilityEnabled'}});await expect(failing.enableTeacher(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,key:randomUUID()})).rejects.toMatchObject({code:'UNAVAILABLE'});expect(await db.teacher.count({where:{employeeId:employee.employeeId}})).toBe(0);expect(await db.commandReceipt.count({where:{organizationId:primary.organizationId,command:'TeacherEligibilityEnabled'}})).toBe(receipts);
 });
});
