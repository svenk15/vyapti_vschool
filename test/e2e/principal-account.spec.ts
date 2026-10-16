import {expect,test,type Page} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createAccessServices} from '../../backend/composition/access';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Principal account E2E PostgreSQL DB required');
const access=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const};
const input={...schoolInput(),organizationName:`Principal Account ${randomUUID().slice(0,6)}`,schoolName:'Riverbank School'};
const evidence='docs/evidence/principal-lea-46-account-2026-10-16';
let school:Awaited<ReturnType<typeof access.provisionSchool>>;

test.setTimeout(90000);
test.beforeAll(async()=>{
 school=await access.provisionSchool(input,operator);
 await access.institutionOperation({kind:'SetBranchMembership',organizationId:school.organizationId,schoolId:school.schoolId,accountId:school.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN','PRINCIPAL'],expectedVersion:1,key:randomUUID(),reason:'Synthetic Principal account authority'},operator);
 await access.startSession({accountId:school.accountId,tokenVersion:1},'MOBILE_WEB',new Date(Date.now()+8*60*60*1000));
});
test.afterAll(async()=>{await access.disconnect();});

async function signIn(page:Page){
 await page.goto('/sign-in');
 await page.getByLabel('Email address').fill(input.adminEmail);
 await page.getByLabel(/^Password/).fill(input.password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.getByLabel('Branch').selectOption(`${school.schoolId}:leadership`);
 await page.getByRole('button',{name:/Continue/}).click();
 await page.getByRole('button',{name:/Confirm/}).click();
 await expect(page).toHaveURL(/\/leadership$/);
}

test('Principal reviews and revokes only own sessions, then signs out the current browser',async({page},testInfo)=>{
 if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
 await signIn(page);
 await page.goto('/leadership/account');
 await expect(page.getByRole('heading',{name:'My account'})).toBeVisible();
 await expect(page.getByText('Mobile web browser',{exact:true})).toBeVisible();
 await expect(page.getByText('Desktop web browser',{exact:true})).toBeVisible();
 expect(await page.locator('body').innerText()).not.toMatch(/user-agent|ip address/i);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`${evidence}/application-sessions-${testInfo.project.name}.png`,fullPage:true});

 await page.getByText('Mobile web browser',{exact:true}).click();
 await page.getByRole('button',{name:/Continue/}).click();
 await expect(page.getByRole('heading',{name:'Revoke or sign out'})).toBeFocused();
 await expect(page.getByText('Another signed-in browser',{exact:true})).toBeVisible();
 await page.screenshot({path:`${evidence}/application-confirm-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Sign out selected session'}).click();
 await expect(page.getByRole('status').filter({hasText:'Session ended'})).toBeVisible();
 await page.reload();
 await expect(page.getByText('Mobile web browser',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Desktop web browser',{exact:true})).toBeVisible();

 await page.getByText('Desktop web browser',{exact:true}).click();
 await page.getByRole('button',{name:/Continue/}).click();
 await expect(page.getByText('Current signed-in browser',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Sign out selected session'}).click();
 await expect(page).toHaveURL(/\/sign-in/);
 await page.goto('/leadership/account');
 await expect(page).toHaveURL(/\/sign-in/);
});

test('captures the approved Principal account workflow without modifying it',async({page},testInfo)=>{
 const reference=pathToFileURL(resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html')).href;
 await page.goto(reference);
 await page.evaluate(()=>{(window as unknown as {WorkflowReview:{read:(id:string)=>void}}).WorkflowReview.read('LEA-46');});
 if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
 await expect(page.getByRole('heading',{name:'Manage sessions, preferences and school support'})).toBeVisible();
 await page.screenshot({path:`${evidence}/reference-${testInfo.project.name}.png`,fullPage:true});
});
