import {expect,test,type Page} from '@playwright/test';
import {randomBytes,randomUUID} from 'node:crypto';
import {createAccessServices} from '../../backend/composition/access';

const databaseUrl=process.env.TEST_DATABASE_URL??'';
if(new URL(databaseUrl).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated test database required');
const access=createAccessServices({databaseUrl});
const admin={organizationName:`Landing ${randomUUID()}`,schoolName:'North Campus Example',schoolCode:'MAIN',timezone:'Asia/Kolkata',adminEmail:`landing-${randomUUID()}@vschool.example`,password:randomBytes(24).toString('base64url')};
test.beforeAll(async()=>{await access.provisionSchool(admin,{operatorId:randomUUID(),verified:true});});
test.afterAll(async()=>{await access.disconnect();});

async function signIn(page:Page){await page.goto('/sign-in');await page.getByRole('textbox',{name:'Email address',exact:true}).fill(admin.adminEmail);await page.getByLabel(/^Password/).fill(admin.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/admin$/);}

test('five landing candidates share responsive production components and four themes',async({page},testInfo)=>{
 await page.setViewportSize(testInfo.project.name==='mobile'?{width:390,height:844}:{width:1440,height:1000});
 await page.goto('/design-system#landing-references');
 const reference=page.locator('#landing-references');await reference.scrollIntoViewIfNeeded();
 for(const workspace of ['administrator','teacher','student','parent','principal']){
  await page.getByLabel('Workspace candidate').selectOption(workspace);
  await expect(reference.locator('.landing-summary')).toHaveCount(1);
  await expect(reference.getByRole('heading',{name:'School Calendar'})).toBeVisible();
  await expect(reference.getByRole('heading',{name:'Quick access'})).toBeVisible();
  if(workspace==='teacher'){
   const headings=await reference.locator('.landing-column').first().locator(':scope > .landing-panel > .landing-panel-header > h2').allTextContents();
   expect(headings).toEqual(['Up next','Registers to finish','Today’s classes','Teaching work']);
  }
  if(workspace==='principal'){
   await expect(reference.getByRole('heading',{name:'Decisions ready',exact:true})).toBeVisible();
   await expect(reference.getByRole('heading',{name:'Active follow-ups',exact:true})).toBeVisible();
   await expect(reference.getByRole('heading',{name:'School-wide signals',exact:true})).toBeVisible();
   await expect(reference.getByRole('heading',{name:'Today’s classes'})).toHaveCount(0);
  }
  if(workspace==='administrator')await expect(reference.getByRole('heading',{name:'Decisions ready'})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 for(const theme of ['forest','amethyst','porcelain','linen']){await page.getByLabel('Preview theme').selectOption(theme);await expect(page.locator('.brand-surface').first()).toHaveAttribute('data-vs-theme',theme);await reference.screenshot({path:`docs/evidence/ux-revamp-landing-completion-2026-10-19/themes/${theme}-${testInfo.project.name}.png`});}
 await page.getByLabel('Preview theme').selectOption('forest');
 await page.getByLabel('Workspace candidate').selectOption('administrator');
 const selected=reference.getByRole('button',{name:/Monday, 19 October 2026, today/});await selected.focus();await expect(selected).toBeFocused();
 await reference.screenshot({path:`docs/evidence/ux-revamp-landing-completion-2026-10-19/calendar/selected-${testInfo.project.name}.png`});
 await page.getByLabel('Calendar example').selectOption('empty');await expect(reference.getByText('No published events for this date',{exact:true})).toBeVisible();
 await reference.screenshot({path:`docs/evidence/ux-revamp-landing-completion-2026-10-19/calendar/empty-${testInfo.project.name}.png`});
 await page.getByLabel('Calendar example').selectOption('failed');await expect(reference.getByText('Calendar could not be loaded',{exact:true})).toBeVisible();await expect(reference.getByRole('link',{name:/Retry/})).toBeVisible();
 await reference.screenshot({path:`docs/evidence/ux-revamp-landing-completion-2026-10-19/calendar/error-${testInfo.project.name}.png`});
 await page.getByLabel('Calendar example').selectOption('selected');
 await expect(reference.getByRole('button',{name:'Previous week'})).toBeDisabled();
 await expect(reference.getByRole('button',{name:'Next week'})).toBeDisabled();
 await reference.screenshot({path:`docs/evidence/ux-revamp-landing-completion-2026-10-19/candidate-${testInfo.project.name}.png`});
 if(testInfo.project.name==='mobile')for(const workspace of ['student','parent']){await page.setViewportSize({width:360,height:844});await page.getByLabel('Workspace candidate').selectOption(workspace);const summary=reference.locator('.landing-summary');expect(await summary.evaluate(node=>node.getBoundingClientRect().height)).toBeLessThanOrEqual(300);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});

test('Administrator landing preserves authorized actions and explicit unavailable projections',async({page},testInfo)=>{
 await page.setViewportSize(testInfo.project.name==='mobile'?{width:390,height:844}:{width:1440,height:1000});await signIn(page);
 await expect(page.getByRole('heading',{name:'Your school day, at a glance'})).toBeVisible();
 await expect(page.locator('.landing-summary-item')).toHaveCount(3);
 await expect(page.getByRole('heading',{name:'School Calendar'})).toBeVisible();
 await expect(page.getByText('Calendar could not be loaded',{exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:/Retry/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('main').screenshot({path:`docs/evidence/ux-revamp-landing-completion-2026-10-19/admin-unavailable-${testInfo.project.name}.png`});
});

test('landing composition stacks without overflow at the intermediate breakpoint',async({page},testInfo)=>{
 test.skip(testInfo.project.name==='mobile','The mobile project already verifies the compact breakpoint.');
 await page.setViewportSize({width:900,height:1000});
 await page.goto('/design-system#landing-references');
 const reference=page.locator('#landing-references');await reference.scrollIntoViewIfNeeded();
 for(const workspace of ['administrator','teacher','student','parent','principal']){
  await page.getByLabel('Workspace candidate').selectOption(workspace);
  expect(await reference.locator('.landing-grid').evaluate(node=>getComputedStyle(node).gridTemplateColumns.split(' ').length)).toBe(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await reference.screenshot({path:'docs/evidence/ux-revamp-landing-completion-2026-10-19/candidate-intermediate.png'});
});
