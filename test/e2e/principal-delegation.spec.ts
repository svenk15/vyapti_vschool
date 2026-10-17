import {expect,test,type Page} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAccessServices} from '../../backend/composition/access';
import {activeStaffFixture,schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated delegation E2E PostgreSQL DB required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const access=createAccessServices({databaseUrl:url});
const operator={operatorId:randomUUID(),verified:true as const};
const input={...schoolInput(),organizationName:`Delegation Trust ${randomUUID().slice(0,6)}`,schoolName:'Riverbank School'};
const evidence='docs/evidence/principal-f02-delegation-2026-10-17';
let scope:Awaited<ReturnType<typeof access.provisionSchool>>;
let staff:Awaited<ReturnType<typeof activeStaffFixture>>;
let delegation:Awaited<ReturnType<typeof access.issueDelegation>>;

test.setTimeout(90000);
test.beforeAll(async()=>{
  mkdirSync(evidence,{recursive:true});
  scope=await access.provisionSchool(input,operator);
  staff=await activeStaffFixture(db,scope,['TEACHER']);
  const now=new Date(),past=new Date(now.getTime()-365*24*60*60*1000),future=new Date(now.getTime()+5*24*60*60*1000),personId=randomUUID(),employeeId=randomUUID();
  await db.$transaction(async tx=>{
    await tx.person.create({data:{id:personId,organizationId:scope.organizationId,firstName:'Nila',lastName:'Acting',version:1,createdAt:now}});
    await tx.employee.create({data:{id:employeeId,organizationId:scope.organizationId,schoolId:scope.schoolId,personId,staffNumber:`ACT-${randomUUID().slice(0,8)}`,category:'TEACHING',employedFrom:past,status:'ACTIVE',version:1}});
    await tx.accountPersonBinding.create({data:{id:randomUUID(),organizationId:scope.organizationId,accountId:staff.accountId,personId,verifiedAt:now,verifiedBy:scope.accountId}});
    for(const moduleId of ['academic_core','communication','family','student_core'] as const){
      await tx.organizationEntitlement.create({data:{id:randomUUID(),organizationId:scope.organizationId,moduleId,state:'ACTIVE',startsAt:past,endsAt:null,limits:{},manifestVersion:1,version:1}});
      await tx.branchActivation.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,moduleId,state:'ACTIVE',version:1,enabledAt:now}});
    }
  });
  delegation=await access.issueDelegation(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,employeeId,actions:['leadership.read','communication.read_leadership'],startsAt:new Date(now.getTime()-60_000).toISOString(),endsAt:future.toISOString(),reason:'Synthetic acting Principal cover',key:randomUUID()});
});
test.afterAll(async()=>{await access.disconnect();await db.$disconnect();});

async function signIn(page:Page){
  await page.goto('/sign-in');
  await page.getByLabel('Email address').fill(staff.email);
  await page.getByLabel(/^Password/).fill(staff.password);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await expect(page).toHaveURL(/\/choose-workspace$/);
  const branch=page.getByLabel('Branch');
  await expect(branch.locator(`option[value="${scope.schoolId}:leadership"]`)).toContainText('Acting leadership');
  await expect(branch.locator(`option[value="${scope.schoolId}:teaching"]`)).toContainText('Teaching');
  await branch.selectOption(`${scope.schoolId}:leadership`);
  await page.getByRole('button',{name:/Continue/}).click();
  await page.getByRole('button',{name:/Confirm/}).click();
  await expect(page).toHaveURL(/\/leadership$/);
}

test('acting leader sees exact temporary authority and loses it immediately on revoke',async({page},testInfo)=>{
  if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
  await signIn(page);
  if(testInfo.project.name==='mobile'){
    await page.getByRole('button',{name:'Open navigation'}).click();
    await expect(page.getByText('Acting Principal',{exact:true}).first()).toBeVisible();
    await page.getByRole('link',{name:'My acting access'}).click();
  }else{
    await expect(page.getByText('Acting Principal',{exact:true}).first()).toBeVisible();
    await page.getByRole('link',{name:'My acting access'}).click();
  }
  await expect(page.getByRole('heading',{name:'My acting access'})).toBeVisible();
  await expect(page.getByText('Communication oversight')).toBeVisible();
  await expect(page.getByText('Attendance oversight')).toHaveCount(0);
  await expect(page.getByText('Synthetic acting Principal cover')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`${evidence}/application-${testInfo.project.name}.png`,fullPage:true});
  await page.goto('/leadership/communication');
  await expect(page.getByRole('heading',{name:'Notice coverage',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'No notice coverage yet'})).toBeVisible();
  if(testInfo.project.name==='chromium'){
    await access.revokeDelegation(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,delegationId:delegation.delegationId,expectedVersion:1,reason:'Synthetic acting cover ended',key:randomUUID()});
    await page.reload();
    await expect(page).toHaveURL(/\/teacher\/today$/);
    await page.goto('/leadership');
    await expect(page).toHaveURL(/\/teacher\/today$/);
  }
});

test('captures the approved temporary-delegation reference without modifying it',async({page},testInfo)=>{
  const reference=pathToFileURL(resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html')).href;
  await page.goto(reference);
  await page.evaluate(()=>{(window as unknown as {WorkflowReview:{read:(id:string)=>void}}).WorkflowReview.read('LEA-03');});
  if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
  await expect(page.getByRole('heading',{name:'Work under a temporary leadership delegation'})).toBeVisible();
  await page.screenshot({path:`${evidence}/reference-${testInfo.project.name}.png`,fullPage:true});
});
