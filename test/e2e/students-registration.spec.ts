import {test,expect,type Page} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {createAccessServices} from '../../backend/composition/access';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {createStudentsServices} from '../../backend/composition/students';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {activeStaffFixture,schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated STU-01 E2E PostgreSQL database required');
const access=createAccessServices({databaseUrl:url}),tenancy=createTenancyServices({databaseUrl:url,releasedModules:['student_core']}),students=createStudentsServices({databaseUrl:url,releasedModules:['student_core'],cursorSecret:'students-e2e-cursor-secret-32-bytes-minimum'}),db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),operator={operatorId:randomUUID(),verified:true as const},input=schoolInput();
let school:Awaited<ReturnType<typeof access.provisionSchool>>,foreignStudentId:string,selectablePersonId:string,teacherEmail:string,teacherPassword:string;

test.beforeAll(async()=>{
  school=await access.provisionSchool(input,operator);
  selectablePersonId=(await db.person.create({data:{id:randomUUID(),organizationId:school.organizationId,firstName:'Morgan',lastName:'Helper',contactEmail:null,version:1,createdAt:new Date()}})).id;
  const identity={accountId:school.accountId,tokenVersion:1};
  await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:school.organizationId,accountId:school.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic STU-01 browser authority'},operator);
  await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:school.organizationId,actorAccountId:school.accountId,moduleId:'student_core',state:'ACTIVE',startsAt:new Date('2026-01-01T00:00:00Z').toISOString(),endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Synthetic STU-01 browser entitlement'});
  const preview=await tenancy.preview(identity,school.organizationId,school.schoolId,['student_core']);
  expect(preview.blockers).toEqual([]);
  await tenancy.confirm(identity,school.organizationId,school.schoolId,{enabled:['student_core'],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:'Activate synthetic STU-01 browser branch'});
  const teacher=await activeStaffFixture(db,school,['TEACHER']);teacherEmail=teacher.email;teacherPassword=teacher.password;await db.userAccount.update({where:{id:teacher.accountId},data:{emailVerifiedAt:new Date()}});
  const foreign=await access.provisionSchool(schoolInput(),operator);
  await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:foreign.organizationId,accountId:foreign.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic foreign student authority'},operator);
  await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:foreign.organizationId,actorAccountId:foreign.accountId,moduleId:'student_core',state:'ACTIVE',startsAt:new Date('2026-01-01T00:00:00Z').toISOString(),endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Synthetic foreign student entitlement'});
  const foreignPreview=await tenancy.preview({accountId:foreign.accountId,tokenVersion:1},foreign.organizationId,foreign.schoolId,['student_core']);
  await tenancy.confirm({accountId:foreign.accountId,tokenVersion:1},foreign.organizationId,foreign.schoolId,{enabled:['student_core'],expectedVersions:foreignPreview.expectedVersions,previewHash:foreignPreview.previewHash,expectedInstitutionRevision:foreignPreview.institutionRevision,expectedBranchRevision:foreignPreview.branchRevision,key:randomUUID(),reason:'Activate synthetic foreign student branch'});
  const foreignStudent=await students.create({accountId:foreign.accountId,tokenVersion:1},foreign.organizationId,foreign.schoolId,{firstName:'Synthetic',lastName:'Foreign',admissionNumber:'FOREIGN-1',admittedOn:'2026-04-01',existingPersonId:null,key:randomUUID()});
  foreignStudentId=foreignStudent.studentId;
});

test('denies the generic student directory and detail endpoints to a teacher',async({page})=>{
  await page.goto('/sign-in');await page.getByRole('textbox',{name:'Email address',exact:true}).fill(teacherEmail);await page.getByLabel(/^Password/).fill(teacherPassword);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).not.toHaveURL(/\/sign-in$/,{timeout:15000});
  const list=await page.request.get('/api/v1/students'),detail=await page.request.get(`/api/v1/students/${foreignStudentId}`);expect(list.status()).toBe(403);expect(detail.status()).toBe(403);
});
test.afterAll(async()=>{await db.$disconnect();await students.disconnect();await tenancy.disconnect();await access.disconnect();});

async function signIn(page:Page){await page.goto('/sign-in');await page.getByRole('textbox',{name:'Email address',exact:true}).fill(input.adminEmail);await page.getByLabel(/^Password/).fill(input.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/admin$/,{timeout:15000});}

test('registers and searches a student, shows un-enrolled detail, rejects duplicate without orphan Person, and hides foreign profile',async({page})=>{
  await signIn(page);await page.goto('/admin/students');
  await page.getByRole('button',{name:'Register student',exact:true}).click();await page.screenshot({path:`docs/evidence/ex-08/student-registration-${test.info().project.name}.png`,fullPage:true});await page.getByLabel('First name').fill('Taylor');await page.getByLabel('Last name').fill('Example');await page.getByLabel('Admission number').fill('0007');await page.getByLabel('Branch admission date').fill('2026-04-01');await page.getByRole('dialog').getByRole('button',{name:'Register student',exact:true}).click();
  await expect(page).toHaveURL(/\/admin\/students\/[0-9a-f-]+$/i);await expect(page.getByText('Not enrolled',{exact:true})).toBeVisible();await page.reload();await expect(page.getByText('Not enrolled',{exact:true})).toBeVisible();
  await page.goto('/admin/students');await page.setViewportSize(test.info().project.name==='mobile'?{width:390,height:844}:{width:1440,height:1000});await page.screenshot({path:`docs/evidence/ex-08/students-directory-${test.info().project.name}.png`,fullPage:true});await page.getByRole('searchbox',{name:'Search students'}).fill('0007');await page.getByRole('searchbox',{name:'Search students'}).press('Enter');await expect(page).toHaveURL(/search=0007/);await expect(page.getByRole('row',{name:/0007 Taylor Example ACTIVE Not enrolled/})).toBeVisible();await page.goBack();await expect(page).toHaveURL(/\/admin\/students$/);await expect(page.getByRole('searchbox',{name:'Search students'})).toHaveValue('');await page.goForward();await expect(page).toHaveURL(/search=0007/);await expect(page.getByRole('searchbox',{name:'Search students'})).toHaveValue('0007');
  const before=await db.person.count({where:{organizationId:school.organizationId,firstName:'Taylor',lastName:'Example'}});
  await page.getByRole('button',{name:'Register student',exact:true}).click();await page.getByLabel('First name').fill('Another');await page.getByLabel('Last name').fill('Student');await page.getByLabel('Admission number').fill('0007');await page.getByLabel('Branch admission date').fill('2026-04-01');await page.getByRole('dialog').getByRole('button',{name:'Register student',exact:true}).click();await expect(page.getByRole('alert',{name:'Student feedback'})).toContainText('already registered in this branch');
  expect(await db.person.count({where:{organizationId:school.organizationId,firstName:'Another',lastName:'Student'}})).toBe(0);expect(before).toBe(1);
  await page.getByLabel('First name').fill('Morgan');await page.getByLabel('Last name').fill('Helper');await page.getByLabel('Admission number').fill('0008');await page.getByText('Reuse an existing Person (optional)').click();await page.getByLabel('Exact Person ID').fill(selectablePersonId);await page.getByRole('button',{name:'Resolve exact identity'}).click();await page.getByRole('radio',{name:/Morgan Helper/}).check();await page.getByRole('dialog').getByRole('button',{name:'Register student',exact:true}).click();await expect(page).toHaveURL(/\/admin\/students\/[0-9a-f-]+$/i);expect(await db.student.count({where:{organizationId:school.organizationId,schoolId:school.schoolId,personId:selectablePersonId}})).toBe(1);
  await page.goto('/admin/students');await page.getByRole('button',{name:'Register student',exact:true}).click();await page.getByText('Reuse an existing Person (optional)').click();await page.getByLabel('Identity reference').selectOption('ADMISSION_NUMBER');await page.getByLabel('Exact admission number').fill('0008');await page.getByRole('button',{name:'Resolve exact identity'}).click();await expect(page.getByRole('status',{name:'Student feedback'})).toContainText('already registered in this branch');await expect(page.getByRole('button',{name:'Open existing student'})).toBeVisible();
  const foreign=await page.request.get(`/api/v1/students/${foreignStudentId}`);expect(foreign.status()).toBe(404);await page.goto(`/admin/students/${foreignStudentId}`);await expect(page).toHaveURL(/not-found|admin\/students/i);await expect(page.getByText('FOREIGN-1')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('corrects an exclusive student name and compares a stale browser attempt with the current Person',async({page})=>{
  const identity={accountId:school.accountId,tokenVersion:1},created=await students.create(identity,school.organizationId,school.schoolId,{firstName:'Asha',lastName:'Exampel',admissionNumber:`NAME-${randomUUID().slice(0,8)}`,admittedOn:'2026-04-01',existingPersonId:null,key:randomUUID()});
  await signIn(page);await page.goto(`/admin/students/${created.studentId}`);await expect(page.getByRole('heading',{name:'Correct student name'})).toBeVisible();
  await expect(page.getByText('Verified',{exact:true})).toBeVisible();await page.getByLabel(/^Admission date/).fill('2025-06-12');await page.getByLabel('Verification or correction reason').fill('Verified against the signed branch admission register');await page.getByRole('button',{name:'Save corrected date'}).click();await expect(page.getByRole('status').filter({hasText:'Admission date saved'})).toBeVisible();await expect(page.getByLabel(/^Admission date/)).toHaveValue('2025-06-12');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/evidence/sa-comp-12/admission-date-${test.info().project.name}.png`,fullPage:true});
  await page.getByLabel('Last name').fill('Example');await page.getByLabel('Reason for correction').fill('Correct surname spelling');await page.getByRole('button',{name:'Save name correction'}).click();await expect(page.getByRole('status').filter({hasText:'Correction saved'})).toBeVisible();await expect(page.getByRole('table',{name:'Recent name correction history'})).toContainText('Asha Exampel → Asha Example');
  await page.screenshot({path:`docs/evidence/sa-comp-04/name-correction-${test.info().project.name}.png`,fullPage:true});
  const current=await db.person.findUniqueOrThrow({where:{id:created.personId},select:{version:true}});await db.person.update({where:{id:created.personId},data:{firstName:'Asha',lastName:'Current',version:current.version+1}});
  await page.getByLabel('Last name').fill('Attempted');await page.getByLabel('Reason for correction').fill('Verify stale comparison');await page.getByRole('button',{name:'Save name correction'}).click();await expect(page.getByRole('status').filter({hasText:'Person changed since this page loaded'})).toContainText('Attempted: Asha Attempted. Current: Asha Current');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
