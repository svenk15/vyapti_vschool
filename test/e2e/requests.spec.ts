import {test,expect,type Page} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createRequestsServices} from '../../backend/composition/requests';
import {activeStaffFixture,schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Requests browser database required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const access=createAccessServices({databaseUrl:url});
const requests=createRequestsServices({databaseUrl:url,releasedModules:['staff_core','family','student_core'],mode:'synthetic'});
const operator={operatorId:randomUUID(),verified:true as const};
const input={...schoolInput(),organizationName:`Requests ${randomUUID().slice(0,6)}`,schoolName:'Riverside School'};
const evidence='docs/evidence/principal-f09-requests-2026-10-18';
let scope:Awaited<ReturnType<typeof access.provisionSchool>>;
let staff:Awaited<ReturnType<typeof activeStaffFixture>>;
let steward:Awaited<ReturnType<typeof activeStaffFixture>>;
let studentId:string;

test.describe.configure({mode:'serial'});
test.setTimeout(300000);

test.beforeAll(async()=>{
 mkdirSync(evidence,{recursive:true});
 scope=await access.provisionSchool(input,operator);
 await access.institutionOperation({kind:'SetBranchMembership',organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:scope.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN','PRINCIPAL'],expectedVersion:1,key:randomUUID(),reason:'Synthetic Requests Principal authority'},operator);
 staff=await activeStaffFixture(db,scope,['TEACHER']);
 steward=await activeStaffFixture(db,scope,['PRINCIPAL']);
 for(const moduleId of ['staff_core','family','student_core']){
  await db.organizationEntitlement.create({data:{id:randomUUID(),organizationId:scope.organizationId,moduleId,state:'ACTIVE',startsAt:new Date('2026-01-01'),endsAt:null,limits:{},manifestVersion:1,version:1}});
  await db.branchActivation.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,moduleId,state:'ACTIVE',version:1,enabledAt:new Date()}});
 }
 await requests.configure(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,reviewerAccountId:scope.accountId,stewardAccountId:steward.accountId});
 const person=await db.person.create({data:{id:randomUUID(),organizationId:scope.organizationId,firstName:'Mira',lastName:'Example',version:1,createdAt:new Date()}});
 const student=await db.student.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,personId:person.id,admissionNumber:`REQ-${randomUUID().slice(0,8)}`,admittedOn:new Date('2026-04-01'),status:'ACTIVE',version:1,createdAt:new Date()}});
 studentId=student.id;
 const guardianPerson=await db.person.create({data:{id:randomUUID(),organizationId:scope.organizationId,firstName:'Kavya',lastName:'Example',version:1,createdAt:new Date()}});
 const guardianAccess=await db.guardianChildAccess.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,studentId,displayName:'Kavya Example',normalizedEmail:staff.email,accountId:staff.accountId,personId:guardianPerson.id,authorizedByAccountId:scope.accountId,authorizedAt:new Date(),accessFrom:new Date('2026-01-01'),acceptedAt:new Date(),version:1,createdAt:new Date()}});
 await db.guardianPurposeGrant.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,accessId:guardianAccess.id,studentId,purpose:'child.summary.read',grantedAt:new Date()}});
});

test.afterAll(async()=>{await requests.disconnect();await access.disconnect();await db.$disconnect();});

async function signIn(page:Page,email:string,password:string,target:string){
 await page.goto('/sign-in');
 await page.getByLabel('Email address').fill(email);
 await page.getByLabel(/^Password/).fill(password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.waitForURL(value=>value.pathname==='/choose-workspace'||value.pathname.startsWith('/admin')||value.pathname.startsWith('/teacher')||value.pathname.startsWith('/leadership')||value.pathname.startsWith('/family'));
 await page.goto(target);
}

test('submits and reviews an operational request through the protected owner journey',async({browser},testInfo)=>{
 const staffContext=await browser.newContext(),staffPage=await staffContext.newPage();
 await signIn(staffPage,staff.email,staff.password,'/admin/requests/new');
 await expect(staffPage.getByRole('heading',{name:'New request'})).toBeVisible();
 await staffPage.getByLabel('Category').selectOption('CLASSROOM_RESOURCE');
 await staffPage.getByLabel('Title').fill('Shared science resource kit');
 await staffPage.getByLabel('Details').fill('The fictional teaching team needs one reusable science demonstration kit.');
 await staffPage.getByLabel('Desired outcome').fill('Record approval for operational planning.');
 await staffPage.getByRole('button',{name:'Continue'}).click();
 await expect(staffPage.getByRole('heading',{name:'Review and submit'})).toBeVisible();
 await staffPage.getByRole('button',{name:'Submit request'}).click();
 await expect(staffPage).toHaveURL(/\/admin\/requests\//);
 await expect(staffPage.getByText('submitted',{exact:true})).toBeVisible();
 await staffPage.screenshot({path:`${evidence}/application-staff-receipt-${testInfo.project.name}.png`,fullPage:true});
 const caseId=staffPage.url().split('/').at(-1)!;
 const principalContext=await browser.newContext(),principal=await principalContext.newPage();
 await signIn(principal,input.adminEmail,input.password,'/leadership/staff/requests');
 await expect(principal.getByRole('heading',{name:'Staff requests'})).toBeVisible();
 await expect(principal.getByText('Shared science resource kit')).toBeVisible();
 await principal.getByRole('link',{name:'Review'}).click();
 await expect(principal.getByRole('heading',{name:'Shared science resource kit'})).toBeVisible();
 await principal.getByLabel('Public outcome').fill('Approved for operational planning; no automatic downstream change.');
 await principal.getByRole('button',{name:'Confirm approve'}).focus();
 await expect(principal.getByRole('button',{name:'Confirm approve'})).toBeFocused();
 await principal.getByRole('button',{name:'Confirm approve'}).click();
 await expect(principal.getByText('approved',{exact:true})).toBeVisible();
 await principal.screenshot({path:`${evidence}/application-principal-approved-${testInfo.project.name}.png`,fullPage:true});
 await staffPage.reload();
 await expect(staffPage.getByText('approved',{exact:true})).toBeVisible();
 await expect(staffPage.getByText('Approved for operational planning; no automatic downstream change.')).toBeVisible();
 expect(await db.requestsDecision.count({where:{caseId}})).toBe(1);
 expect(await principal.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await staffPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await principalContext.close();
 await staffContext.close();
});

test('routes a protected family concern away from an implicated Principal',async({browser},testInfo)=>{
 const familyContext=await browser.newContext(),family=await familyContext.newPage();
 await signIn(family,staff.email,staff.password,`/family/concerns/new?child=${studentId}`);
 await expect(family.getByRole('heading',{name:'Raise a concern'})).toBeVisible();
 await family.getByLabel('Concern title').fill('Concern about the usual school response');
 await family.getByLabel('Concern details').fill('Protected fictional family concern for independent reviewer verification.');
 await family.getByLabel('Desired outcome').fill('Independent review and a permitted public outcome.');
 await family.getByRole('checkbox',{name:'This concern involves the usual Principal reviewer'}).check();
 await family.getByRole('button',{name:'Continue'}).click();
 await expect(family.getByRole('heading',{name:'Review protected concern'})).toBeVisible();
 await expect(family.getByText('Independent reviewer',{exact:true})).toBeVisible();
 await family.getByRole('button',{name:'Submit concern'}).click();
 await expect(family).toHaveURL(/\/family\/concerns\//);
 await expect(family.getByText('submitted',{exact:true})).toBeVisible();
 await family.screenshot({path:`${evidence}/application-family-receipt-${testInfo.project.name}.png`,fullPage:true});
 const ordinaryContext=await browser.newContext(),ordinary=await ordinaryContext.newPage();
 await signIn(ordinary,input.adminEmail,input.password,'/leadership/concerns');
 await expect(ordinary.getByText('Concern about the usual school response')).toHaveCount(0);
 const stewardContext=await browser.newContext(),stewardPage=await stewardContext.newPage();
 await signIn(stewardPage,steward.email,steward.password,'/leadership/concerns');
 await expect(stewardPage.getByText('Concern about the usual school response')).toBeVisible();
 await stewardPage.getByRole('link',{name:'Review'}).click();
 await stewardPage.getByLabel('Public outcome').fill('Independent review recorded; no automatic downstream change.');
 await stewardPage.getByRole('button',{name:'Confirm approve'}).click();
 await expect(stewardPage.getByText('approved',{exact:true})).toBeVisible();
 await stewardPage.screenshot({path:`${evidence}/application-independent-review-${testInfo.project.name}.png`,fullPage:true});
 await family.reload();
 await expect(family.getByText('Independent review recorded; no automatic downstream change.')).toBeVisible();
 expect(await family.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await stewardContext.close();await ordinaryContext.close();await familyContext.close();
});

test('captures the approved staff-request and protected-family-complaint workflow states',async({page},testInfo)=>{
 const reference=pathToFileURL(resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html')).href;
 for(const [id,title] of [['LEA-25','Decide an assigned staff request'],['LEA-35','Handle an escalated family concern or complaint']] as const){
  await page.goto(reference);
  await page.evaluate(value=>(window as unknown as {WorkflowReview:{read:(id:string)=>void}}).WorkflowReview.read(value),id);
  await expect(page.getByRole('dialog').getByRole('heading',{name:title})).toBeVisible();
  await page.screenshot({path:`${evidence}/reference-${id.toLowerCase()}-${testInfo.project.name}.png`,fullPage:true});
 }
});
