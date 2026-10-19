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
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 for(const theme of ['forest','amethyst','porcelain','linen']){await page.getByLabel('Preview theme').selectOption(theme);await expect(page.locator('.brand-surface').first()).toHaveAttribute('data-vs-theme',theme);}
 await page.getByLabel('Workspace candidate').selectOption('administrator');
 const selected=reference.getByRole('button',{name:/Monday, 19 October 2026, today/});await selected.focus();await expect(selected).toBeFocused();
 await reference.getByRole('button',{name:'Next week'}).click();await reference.getByRole('button',{name:'Previous week'}).click();
 await reference.screenshot({path:`docs/evidence/ux-revamp-17-landings-2026-10-19/candidate-${testInfo.project.name}.png`});
});

test('Administrator landing preserves authorized actions and explicit unavailable projections',async({page},testInfo)=>{
 await page.setViewportSize(testInfo.project.name==='mobile'?{width:390,height:844}:{width:1440,height:1000});await signIn(page);
 await expect(page.getByRole('heading',{name:'Your school day, at a glance'})).toBeVisible();
 await expect(page.locator('.landing-summary-item')).toHaveCount(3);
 await expect(page.getByRole('heading',{name:'School Calendar'})).toBeVisible();
 await expect(page.getByText('Calendar unavailable',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('main').screenshot({path:`docs/evidence/ux-revamp-17-landings-2026-10-19/admin-unavailable-${testInfo.project.name}.png`});
});
