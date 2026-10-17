import {expect,test,type Page} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAccessServices} from '../../backend/composition/access';
import {createFinanceServices} from '../../backend/composition/finance';
import {activeStaffFixture,schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Finance E2E PostgreSQL DB required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url,max:3}),log:[]});
const access=createAccessServices({databaseUrl:url});
const finance=createFinanceServices({databaseUrl:url,releasedModules:['fees']});
const operator={operatorId:randomUUID(),verified:true as const};
const evidence='docs/evidence/principal-lea-43-finance-2026-10-19';
type Actor={accountId:string;email:string;password:string;identity:{accountId:string;tokenVersion:number}};
let school:Awaited<ReturnType<typeof access.provisionSchool>>;
let requester:Actor;
let reviewer:Actor;

test.setTimeout(300000);
test.beforeAll(async()=>{
 mkdirSync(evidence,{recursive:true});
 school=await access.provisionSchool(schoolInput(),operator);
 requester=await activeStaffFixture(db,school,['SCHOOL_ADMIN']);
 reviewer=await activeStaffFixture(db,school,['PRINCIPAL']);
 const now=new Date(),startsAt=new Date(now);startsAt.setUTCFullYear(startsAt.getUTCFullYear()-1);
 await db.$transaction(async tx=>{
  await tx.organizationEntitlement.create({data:{id:randomUUID(),organizationId:school.organizationId,moduleId:'fees',state:'ACTIVE',startsAt,limits:{},manifestVersion:1,version:1}});
  await tx.branchActivation.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,moduleId:'fees',state:'ACTIVE',version:1,enabledAt:now}});
  for(const [fixture,first,last] of [[requester,'Anita','Administrator'],[reviewer,'Priya','Principal']] as const){
   const person=await tx.person.create({data:{id:randomUUID(),organizationId:school.organizationId,firstName:first,lastName:last,version:1,createdAt:now}});
   await tx.accountPersonBinding.create({data:{id:randomUUID(),organizationId:school.organizationId,accountId:fixture.accountId,personId:person.id,verifiedAt:now,verifiedBy:school.accountId}});
  }
 });
 await finance.grant(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:requester.accountId,capability:'SUMMARY_READ'});
 await finance.grant(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:requester.accountId,capability:'EXCEPTION_REQUEST'});
 await finance.grant(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:reviewer.accountId,capability:'SUMMARY_READ'});
 await finance.grant(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:reviewer.accountId,capability:'EXCEPTION_REVIEW',currency:'INR',approvalLimitMinor:'50000'});
 const occurredAt='2026-10-17T08:00:00.000Z';
 const charge=await finance.postSyntheticEntry(operator,{organizationId:school.organizationId,schoolId:school.schoolId,kind:'CHARGE',currency:'INR',amountMinor:'120000',sourceRef:`e2e-charge-${school.schoolId}`,occurredAt});
 const payment=await finance.postSyntheticEntry(operator,{organizationId:school.organizationId,schoolId:school.schoolId,kind:'PAYMENT',currency:'INR',amountMinor:'90000',sourceRef:`e2e-payment-${school.schoolId}`,providerEventId:`e2e-provider-${school.schoolId}`,occurredAt});
 await finance.allocateSynthetic(operator,{organizationId:school.organizationId,schoolId:school.schoolId,paymentEntryId:payment.entryId,chargeEntryId:charge.entryId,amountMinor:'90000'});
 await finance.reconcileSynthetic(operator,{organizationId:school.organizationId,schoolId:school.schoolId,currency:'INR',cutoffAt:'2026-10-17T12:00:00.000Z'});
});
test.afterAll(async()=>{await finance.disconnect();await access.disconnect();await db.$disconnect();});

async function signIn(page:Page,actor:Actor,workspace:'admin'|'leadership'){
 await page.goto('/sign-in');
 await page.getByLabel('Email address').fill(actor.email);
 await page.getByLabel(/^Password/).fill(actor.password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 if(page.url().includes('/choose-workspace')){
  await page.getByLabel('Branch').selectOption(`${school.schoolId}:${workspace}`);
  await page.getByRole('button',{name:/Continue/}).click();
  await page.getByRole('button',{name:/Confirm/}).click();
 }
 await expect(page).toHaveURL(workspace==='admin'?/\/admin$/:/\/leadership$/);
}

test('requester recovers the original request and assigned Principal records bounded approval',async({browser},testInfo)=>{
 const viewport=testInfo.project.name==='chromium'?{width:1440,height:1000}:{width:390,height:844};
 const requesterContext=await browser.newContext({viewport}),requestPage=await requesterContext.newPage();
 await signIn(requestPage,requester,'admin');
 await requestPage.goto('/admin/finance/exceptions/new');
 await expect(requestPage.getByRole('heading',{name:'Describe the financial exception'})).toBeFocused();
 await requestPage.getByLabel(/Amount in INR minor units/).fill('25000');
 await requestPage.getByLabel('Operational reason').fill('Fictional duplicate charge evidence requires independent Finance review.');
 await requestPage.getByRole('button',{name:'Continue'}).click();
 await expect(requestPage.getByRole('heading',{name:'Choose the independent reviewer'})).toBeFocused();
 await requestPage.getByLabel('Assigned reviewer').selectOption(reviewer.accountId);
 await requestPage.getByRole('button',{name:'Continue'}).click();
 await expect(requestPage.getByRole('heading',{name:'Review owner consequence'})).toBeFocused();
 let lostRequest=true;
 await requestPage.route('**/api/v1/finance/exceptions',async route=>{if(!lostRequest)return route.continue();lostRequest=false;await route.fetch();await route.abort('failed');});
 await requestPage.getByRole('button',{name:'Confirm request'}).click();
 await expect(requestPage.getByText('Confirmation pending')).toBeVisible();
 await requestPage.unroute('**/api/v1/finance/exceptions');
 await requestPage.getByRole('button',{name:'Retry original request'}).click();
 await expect(requestPage.getByRole('heading',{name:'Financial exception assigned'})).toBeVisible();
 await expect(requestPage.getByText(/No charge changed and no payment or refund was initiated/)).toBeVisible();
 const href=await requestPage.getByRole('link',{name:'Open owner receipt'}).getAttribute('href');
 const exceptionId=href?.split('/').pop()??'';
 expect(exceptionId).toMatch(/^[0-9a-f-]{36}$/);
 await requestPage.screenshot({path:`${evidence}/requester-recovered-${testInfo.project.name}.png`,fullPage:true});
 expect(await requestPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await requesterContext.close();

 const reviewerContext=await browser.newContext({viewport}),reviewPage=await reviewerContext.newPage();
 await signIn(reviewPage,reviewer,'leadership');
 await reviewPage.goto('/leadership/finance/exceptions');
 await expect(reviewPage.getByRole('heading',{name:'Financial oversight'})).toBeVisible();
 await expect(reviewPage.locator('.metric-grid dd').first()).toHaveText('₹1,200.00');
 await reviewPage.getByRole('link',{name:'Review exception'}).click();
 await expect(reviewPage.getByRole('heading',{name:'Finance owner evidence'})).toBeFocused();
 await reviewPage.getByRole('button',{name:'Continue to decision'}).click();
 await expect(reviewPage.getByRole('heading',{name:'Confirm bounded decision'})).toBeFocused();
 let lostDecision=true;
 await reviewPage.route(`**/api/v1/finance/exceptions/${exceptionId}`,async route=>{if(!lostDecision)return route.continue();lostDecision=false;await route.fetch();await route.abort('failed');});
 await reviewPage.getByRole('button',{name:'Confirm approval'}).click();
 await expect(reviewPage.getByText('Outcome not confirmed')).toBeVisible();
 await reviewPage.unroute(`**/api/v1/finance/exceptions/${exceptionId}`);
 await reviewPage.getByRole('button',{name:'Check status'}).click();
 await expect(reviewPage.getByRole('heading',{name:'Approval recorded'})).toBeVisible();
 await expect(reviewPage.getByText('No money movement')).toBeVisible();
 await reviewPage.screenshot({path:`${evidence}/principal-approved-${testInfo.project.name}.png`,fullPage:true});
 expect(await reviewPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const persisted=await db.financeException.findUniqueOrThrow({where:{id:exceptionId},select:{state:true,version:true}});
 expect(persisted).toEqual({state:'APPROVED',version:2});
 expect(await db.financeExceptionEvent.count({where:{exceptionId}})).toBe(2);
 expect(await db.financeLedgerEntry.count({where:{organizationId:school.organizationId,schoolId:school.schoolId}})).toBe(2);
 await reviewerContext.close();
});

test('captures the approved LEA-43 explorer state without modifying it',async({page},testInfo)=>{
 await page.goto(pathToFileURL(resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html')).href);
 await page.evaluate(()=>{(window as unknown as {WorkflowReview:{read:(id:string)=>void}}).WorkflowReview.read('LEA-43');});
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Review financial exceptions under a separate grant'})).toBeVisible();
 await page.screenshot({path:`${evidence}/reference-lea-43-${testInfo.project.name}.png`,fullPage:true});
});
