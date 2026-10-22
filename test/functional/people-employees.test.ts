import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createPeopleServices} from '../../backend/composition/people';
import {createPeopleUseCases} from '../../backend/modules/people/application/employees';
import {PrismaPeopleRepository} from '../../backend/modules/people/infrastructure/employees';
import {PrismaVerifiedDatabaseContext} from '../../backend/modules/tenancy/infrastructure/verified-db-context';
import {PrismaInstitutionEvidence} from '../../backend/modules/tenancy/infrastructure/evidence';
import {capabilityReleaseManifest} from '../../backend/modules/tenancy/domain/entitlements';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {activeStaffFixture} from '../fixtures/access-management';
import {schoolInput} from '../fixtures/access-management';
import {PrismaVerifiedPersonBinding} from '../../backend/modules/access/infrastructure/person-binding';
import {PrismaTeacherProfile} from '../../backend/modules/academics/infrastructure/teacher-profile';

const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated People PostgreSQL test DB required');
const access=createAccessServices({databaseUrl:url}),tenancy=createTenancyServices({databaseUrl:url,releasedModules:['academic_core']}),people=createPeopleServices({databaseUrl:url,cursorSecret:'people-test-cursor-secret-32-bytes-minimum',releasedModules:['academic_core']}),db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
let primary:Awaited<ReturnType<typeof access.provisionSchool>>,foreign:Awaited<ReturnType<typeof access.provisionSchool>>,identity:{accountId:string;tokenVersion:number};
beforeAll(async()=>{primary=await access.provisionSchool(schoolInput(),{operatorId:randomUUID(),verified:true});foreign=await access.provisionSchool(schoolInput(),{operatorId:randomUUID(),verified:true});identity={accountId:primary.accountId,tokenVersion:1};const operator={operatorId:randomUUID(),verified:true as const};await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:primary.organizationId,accountId:primary.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic PER-02 entitlement authority'},operator);await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:primary.organizationId,actorAccountId:primary.accountId,moduleId:'academic_core',state:'ACTIVE',startsAt:new Date('2026-01-01T00:00:00Z').toISOString(),endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Synthetic PER-02 contract'});const preview=await tenancy.preview(identity,primary.organizationId,primary.schoolId,['academic_core']);await tenancy.confirm(identity,primary.organizationId,primary.schoolId,{enabled:['academic_core'],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:'Synthetic PER-02 branch activation'});});
afterAll(async()=>{await people.disconnect();await access.disconnect();await tenancy.disconnect();await db.$disconnect();});
function input(staffNumber:string,firstName='Synthetic',lastName='Teacher'){return {firstName,lastName,contactEmail:null,staffNumber,category:'TEACHING',employedFrom:'2026-04-01',key:randomUUID()};}

describe('PER-01 PostgreSQL employee profiles',()=>{
 it('filters and sorts the complete People-owned Staff result before signed pagination',async()=>{
  const prefix=`QUERY-${randomUUID().slice(0,8)}`;
  const ada=await people.createEmployee(identity,primary.organizationId,primary.schoolId,{...input(`${prefix}-20`,'Ada','North'),category:'TEACHING'}),bea=await people.createEmployee(identity,primary.organizationId,primary.schoolId,{...input(`${prefix}-10`,'Bea','South'),category:'SUPPORT'}),cy=await people.createEmployee(identity,primary.organizationId,primary.schoolId,{...input(`${prefix}-30`,'Cy','West'),category:'SUPPORT'});
  await people.endEmployment(identity,primary.organizationId,primary.schoolId,cy.employeeId,{expectedVersion:cy.version,effectiveDate:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),reason:'Synthetic Staff directory query fixture',key:randomUUID()});
  const support=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:prefix,by:'employeeCode',category:'SUPPORT',employment:'ANY',sort:'employeeCode',order:'asc',limit:1});expect(support.total).toBe(2);expect(support.employees.map(item=>item.employeeId)).toEqual([bea.employeeId]);expect(support.previousCursor).toBeNull();expect(support.nextCursor).toBeTruthy();
  const second=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:prefix,by:'employeeCode',category:'SUPPORT',employment:'ANY',sort:'employeeCode',order:'asc',limit:1,cursor:support.nextCursor});expect(second.employees.map(item=>item.employeeId)).toEqual([cy.employeeId]);expect(second.previousCursor).toBeTruthy();expect(second.nextCursor).toBeNull();
  const firstAgain=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:prefix,by:'employeeCode',category:'SUPPORT',employment:'ANY',sort:'employeeCode',order:'asc',limit:1,cursor:second.previousCursor});expect(firstAgain.employees.map(item=>item.employeeId)).toEqual([bea.employeeId]);expect(firstAgain.previousCursor).toBeNull();expect(firstAgain.nextCursor).toBeTruthy();
  const active=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:prefix,by:'employeeCode',category:'ANY',employment:'ACTIVE',sort:'name',order:'desc'});expect(active.total).toBe(2);expect(active.employees.map(item=>item.employeeId)).toEqual([bea.employeeId,ada.employeeId]);
  await expect(people.workspace(identity,primary.organizationId,primary.schoolId,{search:prefix,by:'employeeCode',category:'TEACHING',employment:'ANY',sort:'employeeCode',order:'asc',limit:1,cursor:support.nextCursor})).rejects.toMatchObject({code:'INVALID_CURSOR'});
 });
 it('creates distinct same-name People profiles, pages scoped staff, and leaves accounts unlinked',async()=>{
  const firstIntent=input('STAFF-001','Alex','Morgan'),one=await people.createEmployee(identity,primary.organizationId,primary.schoolId,firstIntent),replayed=await people.createEmployee(identity,primary.organizationId,primary.schoolId,firstIntent),two=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('STAFF-002','Alex','Morgan'));expect(replayed).toMatchObject({employeeId:one.employeeId,replayed:true});
  expect(one).toMatchObject({staffNumber:'STAFF-001',person:{displayName:'Alex Morgan'},portalAccess:'UNLINKED'});expect(two.person.id).not.toBe(one.person.id);
  const first=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:'Alex',limit:1});expect(first.employees).toHaveLength(1);expect(first.nextCursor).toBeTruthy();
  const second=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:'Alex',limit:1,cursor:first.nextCursor});expect(second.employees).toHaveLength(1);expect(second.employees[0]?.employeeId).not.toBe(first.employees[0]?.employeeId);expect(second.nextCursor).toBeNull();
  const searched=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:'Alex'});expect(searched.employees).toHaveLength(2);expect(searched.employees.every(employee=>employee.portalAccess==='UNLINKED')).toBe(true);
  await db.accountPersonBinding.create({data:{id:randomUUID(),organizationId:primary.organizationId,accountId:primary.accountId,personId:one.person.id,verifiedAt:new Date(),verifiedBy:primary.accountId}});const linked=await people.workspace(identity,primary.organizationId,primary.schoolId,{search:'STAFF-001',by:'employeeCode'});expect(linked.employees[0]?.portalAccess).toBe('ACTIVE');
  await expect(people.workspace(identity,foreign.organizationId,foreign.schoolId)).rejects.toMatchObject({code:'FORBIDDEN'});
 });

 it('requires an approved category, preserves legacy UNCLASSIFIED, and changes category without authority side effects',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,{...input('CATEGORY-01','Category','Teacher'),category:'TEACHING'});
  const enabled=await people.enableTeacher(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,key:randomUUID()});
  const intent={expectedVersion:enabled.version,category:'SUPPORT' as const,reason:'Correct descriptive staff category',key:randomUUID()},changed=await people.updateCategory(identity,primary.organizationId,primary.schoolId,employee.employeeId,intent);
  expect(changed).toMatchObject({category:'SUPPORT',teachingEligibility:'ENABLED',portalAccess:'UNLINKED',replayed:false});
  expect(await people.updateCategory(identity,primary.organizationId,primary.schoolId,employee.employeeId,intent)).toMatchObject({category:'SUPPORT',replayed:true});
  await expect(people.updateCategory(identity,primary.organizationId,primary.schoolId,employee.employeeId,{...intent,key:randomUUID(),category:'ADMINISTRATION'})).rejects.toMatchObject({code:'STALE_VERSION'});
  await expect(people.updateCategory(identity,foreign.organizationId,foreign.schoolId,employee.employeeId,{...intent,key:randomUUID()})).rejects.toMatchObject({code:'FORBIDDEN'});
  expect(await db.teacher.findFirstOrThrow({where:{employeeId:employee.employeeId}})).toMatchObject({active:true,version:1});
  expect(await db.auditEntry.findFirstOrThrow({where:{resourceId:employee.employeeId,command:'EmployeeCategoryChanged'}})).toMatchObject({reason:intent.reason,before:expect.objectContaining({category:'TEACHING'}),after:expect.objectContaining({category:'SUPPORT'})});
  const legacyPerson=await db.person.create({data:{id:randomUUID(),organizationId:primary.organizationId,firstName:'Legacy',lastName:'Staff',contactEmail:null,version:1,createdAt:new Date()}}),legacy=await db.employee.create({data:{id:randomUUID(),organizationId:primary.organizationId,schoolId:primary.schoolId,personId:legacyPerson.id,staffNumber:`LEGACY-${randomUUID().slice(0,6)}`,employedFrom:new Date('2026-04-01T00:00:00Z'),employedTo:null,status:'ACTIVE',version:1}});
  expect(legacy.category).toBe('UNCLASSIFIED');
  const [column]=await db.$queryRaw<{column_default:string;is_nullable:string}[]>`SELECT column_default,is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name='vs_people_employee' AND column_name='category'`;
  expect(column).toMatchObject({column_default:"'UNCLASSIFIED'::character varying",is_nullable:'NO'});
 });

 it('serializes duplicate staff numbers and enforces the organization-scoped Person FK',async()=>{
  const attempts=await Promise.allSettled([people.createEmployee(identity,primary.organizationId,primary.schoolId,input('RACE-01')),people.createEmployee(identity,primary.organizationId,primary.schoolId,input('RACE-01'))]);expect(attempts.filter(value=>value.status==='fulfilled')).toHaveLength(1);expect(attempts.filter(value=>value.status==='rejected')).toHaveLength(1);expect(await db.employee.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,staffNumber:'RACE-01'}})).toBe(1);
  const foreignPerson=await db.person.create({data:{id:randomUUID(),organizationId:foreign.organizationId,firstName:'Foreign',lastName:'Person',contactEmail:null,version:1,createdAt:new Date()}});
  await expect(db.employee.create({data:{id:randomUUID(),organizationId:primary.organizationId,schoolId:primary.schoolId,personId:foreignPerson.id,staffNumber:'FORGED',category:'TEACHING',employedFrom:new Date('2026-01-01T00:00:00Z'),employedTo:null,status:'ACTIVE',version:1}})).rejects.toMatchObject({code:'P2003'});
 });

 it('rolls back both Person and Employee with school revision, receipt and events if evidence fails',async()=>{
  const failing=createPeopleUseCases(new PrismaPeopleRepository(db,()=>({async append(){throw new Error('synthetic evidence writer failure');}}),()=>new Date('2026-05-01T00:00:00Z'),'people-test-cursor-secret-32-bytes-minimum',undefined,undefined,undefined,new PrismaVerifiedDatabaseContext()));
  const before=await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}}),persons=await db.person.count({where:{organizationId:primary.organizationId}}),employees=await db.employee.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}}),receipts=await db.tenantCommandReceipt.count({where:{organizationId:primary.organizationId,actorAccountId:primary.accountId,command:'EmployeeCreated'}}),events=await db.tenantOutbox.count({where:{organizationId:primary.organizationId,type:'PersonRegistered.v1'}});
  await expect(failing.createEmployee(identity,primary.organizationId,primary.schoolId,{...input('ROLLBACK'),key:randomUUID()})).rejects.toMatchObject({code:'UNAVAILABLE'});
  expect(await db.person.count({where:{organizationId:primary.organizationId}})).toBe(persons);expect(await db.employee.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}})).toBe(employees);expect((await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}})).configurationVersion).toBe(before.configurationVersion);expect(await db.tenantCommandReceipt.count({where:{organizationId:primary.organizationId,actorAccountId:primary.accountId,command:'EmployeeCreated'}})).toBe(receipts);expect(await db.tenantOutbox.count({where:{organizationId:primary.organizationId,type:'PersonRegistered.v1'}})).toBe(events);
 });
});

describe('PER-02 PostgreSQL cross-owner staff lifecycle',()=>{
 it('composes an authorized Staff Profile through scoped People, Academics and Access reads',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('STF03-PROFILE','Profile','Teacher'));
  const initial=await people.staffProfile(identity,primary.organizationId,primary.schoolId,employee.employeeId);expect(initial).toMatchObject({employee:{employeeId:employee.employeeId,staffNumber:'STF03-PROFILE'},person:{displayName:'Profile Teacher'},academics:{status:'AVAILABLE',value:{teacherId:null,eligibility:'NOT_ENABLED'}},access:{status:'AVAILABLE',value:{state:'NO_ACCOUNT'}}});expect(initial.history).toContainEqual(expect.objectContaining({kind:'EMPLOYMENT_STARTED'}));
  await people.enableTeacher(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,key:randomUUID()});const target=await activeStaffFixture(db,primary,['TEACHER']);await db.userAccount.update({where:{id:target.accountId},data:{emailVerifiedAt:new Date()}});await people.bindAccount(identity,primary.organizationId,primary.schoolId,employee.employeeId,{accountId:target.accountId,verificationReference:'synthetic-profile-check',reason:'Synthetic Staff Profile fixture',key:randomUUID()});
  const composed=await people.staffProfile(identity,primary.organizationId,primary.schoolId,employee.employeeId);expect(composed.academics).toMatchObject({status:'AVAILABLE',value:{teacherId:expect.any(String),eligibility:'ENABLED'}});expect(composed.access).toMatchObject({status:'AVAILABLE',value:{state:'ACTIVE',membershipId:target.membershipId,roles:['TEACHER']}});
  await expect(people.staffProfile(identity,foreign.organizationId,foreign.schoolId,employee.employeeId)).rejects.toMatchObject({code:'FORBIDDEN'});
  await db.userAccount.update({where:{id:primary.accountId},data:{tokenVersion:2}});await expect(people.staffProfile(identity,primary.organizationId,primary.schoolId,employee.employeeId)).rejects.toMatchObject({code:'UNAUTHENTICATED'});await db.userAccount.update({where:{id:primary.accountId},data:{tokenVersion:1}});
 });
 it('enables a scoped teacher, binds only a verified same-branch teacher account, and ends employment atomically',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-STAFF','Teacher','Synthetic'));
  const enabled=await people.enableTeacher(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,key:randomUUID()});expect(enabled).toMatchObject({teachingEligibility:'ENABLED',teacherId:expect.any(String)});expect(await db.teacher.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,employeeId:employee.employeeId,active:true}})).toBe(1);
  const target=await activeStaffFixture(db,primary,['TEACHER']);await db.userAccount.update({where:{id:target.accountId},data:{emailVerifiedAt:new Date()}});
  const bound=await people.bindAccount(identity,primary.organizationId,primary.schoolId,employee.employeeId,{accountId:target.accountId,verificationReference:'synthetic-check-42',reason:'Identity verified out of band',key:randomUUID()});expect(bound.portalAccess).toBe('ACTIVE');expect(await db.accountPersonBinding.count({where:{organizationId:primary.organizationId,accountId:target.accountId,personId:employee.person.id}})).toBe(1);expect(await db.authSecurityEvent.count({where:{accountId:target.accountId,kind:'PERSON_BINDING_VERIFIED',policySnapshot:{path:['verificationReference'],equals:'synthetic-check-42'}}})).toBe(1);expect(await people.currentAccountDisplayName({accountId:target.accountId,tokenVersion:1},primary.organizationId,primary.schoolId)).toBe('Teacher Synthetic');
  const next=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-OTHER'));await expect(people.bindAccount(identity,primary.organizationId,primary.schoolId,next.employeeId,{accountId:target.accountId,verificationReference:'synthetic-check-43',reason:'Second binding attempt',key:randomUUID()})).rejects.toMatchObject({code:'CONFLICT'});
  const ended=await people.endEmployment(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,effectiveDate:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),reason:'Employment ended today',key:randomUUID()});expect(ended.employment.status).toBe('ENDED');expect(ended.teachingEligibility).toBe('DISABLED');expect(ended.employment.to).not.toBeNull();expect(await db.teacher.findFirstOrThrow({where:{employeeId:employee.employeeId}})).toMatchObject({active:false,version:2});
 });
 it('rolls back Teacher eligibility when an owner facade fails',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-ROLLBACK'));
  const failing=createPeopleUseCases(new PrismaPeopleRepository(db,tx=>new PrismaInstitutionEvidence(tx),()=>new Date(),'people-test-cursor-secret-32-bytes-minimum',undefined,{async enable(){throw new Error('synthetic academics failure');},async disable(){return null;}},capabilityReleaseManifest(['academic_core']),new PrismaVerifiedDatabaseContext()));
  const receipts=await db.commandReceipt.count({where:{organizationId:primary.organizationId,command:'TeacherEligibilityEnabled'}});await expect(failing.enableTeacher(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,key:randomUUID()})).rejects.toMatchObject({code:'UNAVAILABLE'});expect(await db.teacher.count({where:{employeeId:employee.employeeId}})).toBe(0);expect(await db.commandReceipt.count({where:{organizationId:primary.organizationId,command:'TeacherEligibilityEnabled'}})).toBe(receipts);
 });
 it('rolls back actual Academics and Access writes when an enlisted owner fails after writing',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-OWNER-ROLLBACK'));
  const actualTeachers=new PrismaTeacherProfile(),actualBindings=new PrismaVerifiedPersonBinding(),receipts=await db.commandReceipt.count({where:{organizationId:primary.organizationId,command:{in:['TeacherEligibilityEnabled','PersonAccountBound']}}}),audit=await db.auditEntry.count({where:{organizationId:primary.organizationId,resourceId:employee.employeeId}}),revision=(await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}})).configurationVersion;
  const failing=createPeopleUseCases(new PrismaPeopleRepository(db,tx=>new PrismaInstitutionEvidence(tx),()=>new Date(),'people-test-cursor-secret-32-bytes-minimum',{async bind(tx,value){await actualBindings.bind(tx,value);throw new Error('failure after Access write');}},{async enable(tx,value){await actualTeachers.enable(tx,value);throw new Error('failure after Academics write');},async disable(tx,value){return actualTeachers.disable(tx,value);}},capabilityReleaseManifest(['academic_core']),new PrismaVerifiedDatabaseContext()));
  await expect(failing.enableTeacher(identity,primary.organizationId,primary.schoolId,employee.employeeId,{expectedVersion:employee.version,key:randomUUID()})).rejects.toMatchObject({code:'UNAVAILABLE'});
  expect(await db.teacher.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,employeeId:employee.employeeId}})).toBe(0);
  expect(await db.outboxEvent.count({where:{organizationId:primary.organizationId,module:'academics',aggregateId:employee.employeeId}})).toBe(0);
  const target=await activeStaffFixture(db,primary,['TEACHER']);await db.userAccount.update({where:{id:target.accountId},data:{emailVerifiedAt:new Date()}});
  await expect(failing.bindAccount(identity,primary.organizationId,primary.schoolId,employee.employeeId,{accountId:target.accountId,verificationReference:'synthetic-rollback-check',reason:'Synthetic identity check',key:randomUUID()})).rejects.toMatchObject({code:'UNAVAILABLE'});
  expect(await db.accountPersonBinding.count({where:{organizationId:primary.organizationId,accountId:target.accountId}})).toBe(0);
  expect(await db.authSecurityEvent.count({where:{accountId:target.accountId,kind:'PERSON_BINDING_VERIFIED'}})).toBe(0);
  expect(await db.commandReceipt.count({where:{organizationId:primary.organizationId,command:{in:['TeacherEligibilityEnabled','PersonAccountBound']}}})).toBe(receipts);
  expect(await db.auditEntry.count({where:{organizationId:primary.organizationId,resourceId:employee.employeeId}})).toBe(audit);
  expect((await db.school.findUniqueOrThrow({where:{id:primary.schoolId},select:{configurationVersion:true}})).configurationVersion).toBe(revision);
 });
 it('serializes two verified accounts racing to bind the same school account to different people',async()=>{
  const one=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-BIND-RACE-1')),
   two=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-BIND-RACE-2')),
   target=await activeStaffFixture(db,primary,['TEACHER']);await db.userAccount.update({where:{id:target.accountId},data:{emailVerifiedAt:new Date()}});
  const results=await Promise.allSettled([
   people.bindAccount(identity,primary.organizationId,primary.schoolId,one.employeeId,{accountId:target.accountId,verificationReference:'synthetic-race-one',reason:'Synthetic check one',key:randomUUID()}),
   people.bindAccount(identity,primary.organizationId,primary.schoolId,two.employeeId,{accountId:target.accountId,verificationReference:'synthetic-race-two',reason:'Synthetic check two',key:randomUUID()}),
  ]);
  expect(results.filter(result=>result.status==='fulfilled')).toHaveLength(1);expect(results.filter(result=>result.status==='rejected')).toHaveLength(1);
  const rejected=results.find(result=>result.status==='rejected');expect(rejected?.status==='rejected'&&['CONFLICT','STALE_VERSION'].includes(rejected.reason.code)).toBe(true);
  expect(await db.accountPersonBinding.count({where:{organizationId:primary.organizationId,accountId:target.accountId}})).toBe(1);
 });
 it('rejects unverified accounts and verified teachers without active membership in the target branch',async()=>{
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-BIND-GUARD')),
   unverified=await activeStaffFixture(db,primary,['TEACHER']),foreignTeacher=await activeStaffFixture(db,foreign,['TEACHER']);
  await db.userAccount.update({where:{id:foreignTeacher.accountId},data:{emailVerifiedAt:new Date()}});
  const attempt=(accountId:string,reference:string)=>people.bindAccount(identity,primary.organizationId,primary.schoolId,employee.employeeId,{accountId,verificationReference:reference,reason:'Synthetic identity check',key:randomUUID()});
  await expect(attempt(unverified.accountId,'synthetic-unverified')).rejects.toMatchObject({code:'CONFLICT'});
  await expect(attempt(foreignTeacher.accountId,'synthetic-foreign-branch')).rejects.toMatchObject({code:'CONFLICT'});
  expect(await db.accountPersonBinding.count({where:{organizationId:primary.organizationId,personId:employee.person.id}})).toBe(0);
 });
 it('denies a teacher account from reading or managing staff profiles without class.manage/user.manage',async()=>{
  const teacher=await activeStaffFixture(db,primary,['TEACHER']);
  await expect(people.workspace(teacher.identity,primary.organizationId,primary.schoolId)).rejects.toMatchObject({code:'FORBIDDEN'});
  const employee=await people.createEmployee(identity,primary.organizationId,primary.schoolId,input('PER02-PERMISSION'));
  await expect(people.bindAccount(teacher.identity,primary.organizationId,primary.schoolId,employee.employeeId,{accountId:teacher.accountId,verificationReference:'self-check',reason:'Synthetic permission denial',key:randomUUID()})).rejects.toMatchObject({code:'FORBIDDEN'});
 });
});
