import {expect,test} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {createAccessServices} from '../../backend/composition/access';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {schoolInput} from '../fixtures/access-management';

const databaseUrl=process.env.TEST_DATABASE_URL??'';
if(new URL(databaseUrl).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Administrator experience E2E database required');
const modules=['academic_core','student_core'] as const;
const access=createAccessServices({databaseUrl});
const tenancy=createTenancyServices({databaseUrl,releasedModules:modules});
const operator={operatorId:randomUUID(),verified:true as const};
const fixture=schoolInput();
let school:Awaited<ReturnType<typeof access.provisionSchool>>;

test.beforeAll(async()=>{
 school=await access.provisionSchool(fixture,operator);
 const identity={accountId:school.accountId,tokenVersion:1};
 await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:school.organizationId,accountId:school.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Administrator experience browser authority'},operator);
 for(const moduleId of modules)await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:school.organizationId,actorAccountId:school.accountId,moduleId,state:'ACTIVE',startsAt:'2026-01-01T00:00:00.000Z',endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Administrator experience browser entitlement'});
 const preview=await tenancy.preview(identity,school.organizationId,school.schoolId,[...modules]);
 await tenancy.confirm(identity,school.organizationId,school.schoolId,{enabled:[...modules],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:'Activate Administrator experience browser modules'});
});
test.afterAll(async()=>{await tenancy.disconnect();await access.disconnect();});

async function signIn(page:import('@playwright/test').Page){
 await page.goto('/sign-in');
 await page.getByLabel('Email address').fill(fixture.adminEmail);
 await page.getByLabel(/^Password/).fill(fixture.password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.waitForURL(url=>['/admin','/choose-workspace'].includes(new URL(url).pathname),{timeout:20_000});
 if(new URL(page.url()).pathname==='/choose-workspace'){
  const branch=page.getByRole('combobox',{name:'Branch'});
  await Promise.race([page.waitForURL(/\/admin$/,{timeout:20_000}),branch.waitFor({state:'visible',timeout:20_000})]);
  if(new URL(page.url()).pathname==='/choose-workspace'){
   await branch.selectOption(`${school.schoolId}:administration`);
   await page.getByRole('button',{name:/Continue/}).click();
   await page.getByRole('button',{name:/Confirm/}).click();
  }
 }
 await expect(page).toHaveURL(/\/admin$/,{timeout:20_000});
}

test('Administrator task navigation preserves groups, current route and mobile focus',async({page},testInfo)=>{
 await signIn(page);
 const nav=page.getByRole('navigation',{name:'School administration'});
 const mobile=testInfo.project.name==='mobile';
 if(mobile){
  await page.getByRole('button',{name:'Open navigation'}).click();
  await expect(nav.getByRole('link',{name:'Today',exact:true})).toBeFocused();
 }
 await expect(nav.getByRole('link',{name:'Today',exact:true})).toHaveAttribute('aria-current','page');
 for(const label of ['Daily work','Teaching & communication','School operations','School settings'])await expect(nav.getByRole('heading',{name:label,exact:true})).toBeVisible();
 await expect(nav.getByRole('button',{name:/Daily work|Teaching & communication|School operations|School settings/})).toHaveCount(0);
 for(const unavailable of ['Attendance','Timetable','Assessments','Admissions'])await expect(nav.getByRole('link',{name:unavailable,exact:true})).toHaveCount(0);
 await nav.getByRole('link',{name:'Students',exact:true}).click();
 await expect(page).toHaveURL(/\/admin\/students/);
 if(mobile) await page.getByRole('button',{name:'Open navigation'}).click();
 await expect(nav.getByRole('link',{name:'Students',exact:true})).toHaveAttribute('aria-current','page');
 await expect(nav.getByRole('link',{name:'School settings',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);

 if(mobile){
  const scroll=page.locator('.portal-nav-scroll');const before=await scroll.evaluate(node=>({clientHeight:node.clientHeight,scrollHeight:node.scrollHeight}));expect(before.scrollHeight).toBeGreaterThan(before.clientHeight);await scroll.evaluate(node=>{node.scrollTop=node.scrollHeight;});await expect(nav.getByRole('link',{name:'Branding & appearance',exact:true})).toBeVisible();const overlap=await page.evaluate(()=>{const link=[...document.querySelectorAll<HTMLAnchorElement>('.portal-nav-scroll a')].find(node=>node.textContent?.includes('Branding & appearance'))!,footer=document.querySelector<HTMLElement>('.portal-sidebar-footer')!;return link.getBoundingClientRect().bottom>footer.getBoundingClientRect().top;});expect(overlap).toBe(false);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Open navigation'})).toBeFocused();
 }
});

test('connected Administrator reference is interactive and write free',async({page})=>{
 let writes=0;
 page.on('request',request=>{if(!['GET','HEAD','OPTIONS'].includes(request.method()))writes+=1;});
 await page.goto('/design-system/admin-reference?view=students');
 await expect(page.getByRole('heading',{name:'Students',exact:true})).toBeVisible();
 await page.getByRole('searchbox',{name:'Search students'}).fill('Asha');
 await page.getByRole('searchbox',{name:'Search students'}).press('Enter');
 await expect(page.getByText('Asha Raman',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Manage',exact:true}).first().click();
 await expect(page.getByRole('heading',{name:'Asha Raman',exact:true})).toBeVisible();
 await page.getByLabel('Reference screen').selectOption('registration');
 await expect(page.getByRole('heading',{name:'Register a student manually'})).toBeVisible();
 expect(writes).toBe(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
