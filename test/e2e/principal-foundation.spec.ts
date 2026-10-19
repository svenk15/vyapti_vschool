import {test,expect,type Page} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createAccessServices} from '../../backend/composition/access';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated test database required');
const access=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const};
const input={...schoolInput(),organizationName:`Northstar Schools ${randomUUID().slice(0,6)}`,schoolName:'Riverside Campus'};
let scope:Awaited<ReturnType<typeof access.provisionSchool>>,secondSchoolId:string,secondVersion=1;
const evidence='docs/evidence/principal-ldr-01-2026-10-16';

test.setTimeout(90000);
test.beforeAll(async()=>{
 scope=await access.provisionSchool(input,operator);const identity={accountId:scope.accountId,tokenVersion:1};
 await access.institutionOperation({kind:'SetBranchMembership',organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:scope.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN','PRINCIPAL'],expectedVersion:1,key:randomUUID(),reason:'Synthetic Principal browser authority'},operator);
 const institution=await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:scope.organizationId,accountId:scope.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic branch setup authority'},operator);
 const branch=await access.createBranch(identity,scope.organizationId,{code:'EAST',name:'East Campus',timezone:'Asia/Kolkata',expectedRevision:institution.revision,key:randomUUID(),reason:'Synthetic Principal second branch'});secondSchoolId=branch.resourceId;
 await access.institutionOperation({kind:'SetBranchMembership',organizationId:scope.organizationId,schoolId:secondSchoolId,accountId:scope.accountId,status:'ACTIVE',roles:['PRINCIPAL'],expectedVersion:0,key:randomUUID(),reason:'Synthetic second-branch Principal authority'},operator);
});
test.afterAll(async()=>{await access.disconnect();});

async function signIn(page:Page){await page.goto('/sign-in');await page.getByLabel('Email address').fill(input.adminEmail);await page.getByLabel(/^Password/).fill(input.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/choose-workspace$/);const branch=page.getByLabel('Branch');await expect(branch.locator(`option[value="${scope.schoolId}:leadership"]`)).toContainText('Principal leadership');await expect(branch.locator(`option[value="${scope.schoolId}:administration"]`)).toContainText('School administration');await branch.selectOption(`${scope.schoolId}:leadership`);await page.getByRole('button',{name:/Continue/}).click();await expect(page.getByRole('heading',{name:'Review and confirm'})).toBeFocused();await page.getByRole('button',{name:/Confirm/}).click();await expect(page).toHaveURL(/\/leadership$/);}

test('enters, switches and immediately loses the explicit Principal workspace',async({page},testInfo)=>{
 if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
 await signIn(page);await expect(page.getByRole('heading',{name:'My school today'})).toBeVisible();await expect(page.getByText('Riverside Campus',{exact:false}).first()).toBeVisible();await expect(page.getByRole('heading',{name:'Leadership overview unavailable'})).toBeVisible();if(testInfo.project.name==='chromium')await expect(page.getByRole('link',{name:/My account/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`${evidence}/application-home-${testInfo.project.name}.png`,fullPage:true});
 if(testInfo.project.name==='mobile'){const toggle=page.getByRole('button',{name:'Open navigation'});await toggle.click();await expect(page.getByRole('dialog',{name:'Principal menu'})).toBeVisible();await expect(page.getByRole('link',{name:/My account/})).toBeVisible();await page.keyboard.press('Escape');await expect(toggle).toBeFocused();}
 await page.getByLabel('Switch institution and branch').selectOption(secondSchoolId);await expect(page).toHaveURL(new RegExp(`/leadership/context\\?destination=${secondSchoolId}`));await page.getByRole('button',{name:/Continue/}).click();await page.getByLabel('I have reviewed any unsaved work.').check();await page.getByRole('button',{name:/Continue/}).click();await expect(page.getByRole('heading',{name:'Confirm',exact:true})).toBeFocused();await page.getByRole('button',{name:/Confirm/}).click();await expect(page).toHaveURL(/\/leadership$/);await expect(page.getByText('East Campus',{exact:false}).first()).toBeVisible();
 await access.institutionOperation({kind:'SetBranchMembership',organizationId:scope.organizationId,schoolId:secondSchoolId,accountId:scope.accountId,status:'REVOKED',roles:['PRINCIPAL'],expectedVersion:secondVersion,key:randomUUID(),reason:'Synthetic Principal revocation check'},operator);secondVersion++;
 await page.reload();await expect(page).toHaveURL(/\/choose-workspace$/);await expect(page.getByLabel('Branch').locator(`option[value="${secondSchoolId}"]`)).toHaveCount(0);await page.goto('/leadership');await expect(page).toHaveURL(/\/choose-workspace$/);
});

test('captures the approved Principal reference state without modifying it',async({page},testInfo)=>{
 const reference=pathToFileURL(resolve('docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html')).href;
 await page.goto(reference);if(testInfo.project.name==='chromium')await page.setViewportSize({width:1440,height:1000});
 const backToActivities=page.getByRole('button',{name:'Back to activities'});if(await backToActivities.isVisible())await backToActivities.click();
 await expect(page.getByRole('heading',{name:'What would you like to do?'})).toBeVisible();await page.screenshot({path:`${evidence}/reference-home-${testInfo.project.name}.png`,fullPage:true});
});
