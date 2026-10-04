import {test,expect,type Page} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {createAccessServices} from '../../backend/composition/access';
import {schoolInput} from '../fixtures/access-management';
const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated People E2E PostgreSQL DB required');
const access=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const},input=schoolInput();let school:Awaited<ReturnType<typeof access.provisionSchool>>;
test.beforeAll(async()=>{school=await access.provisionSchool(input,operator);});test.afterAll(async()=>{await access.disconnect();});
async function signIn(page:Page){await page.goto('/sign-in');await page.getByRole('textbox',{name:'Email',exact:true}).fill(input.adminEmail);await page.getByLabel(/^Password/).fill(input.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/admin$/,{timeout:15000});}
test('administrator creates separate same-name employee profiles, sees unlinked portal status after refresh, and gets safe failures',async({page})=>{
 await signIn(page);await page.goto('/admin/teachers');await expect(page.getByRole('heading',{name:'Staff profiles',exact:true})).toBeVisible();
 for(const staffNumber of ['STAFF-A','STAFF-B']){await page.getByLabel('First name').fill('Alex');await page.getByLabel('Last name').fill('Morgan');await page.getByLabel('Staff number').fill(staffNumber);await page.getByLabel('Employment start date').fill('2026-04-01');await page.getByRole('button',{name:'Create staff profile'}).click();await expect(page.getByRole('status',{name:'Staff profile feedback'})).toContainText('No login account was linked');}
 await expect(page.getByRole('row',{name:/STAFF-A Alex Morgan/})).toContainText('Not linked to account');await expect(page.getByRole('row',{name:/STAFF-B Alex Morgan/})).toContainText('Not linked to account');
 await page.reload();await expect(page.getByRole('row',{name:/STAFF-A Alex Morgan/})).toBeVisible();await expect(page.getByRole('row',{name:/STAFF-B Alex Morgan/})).toBeVisible();
 await page.getByLabel('First name').fill('Other');await page.getByLabel('Last name').fill('Person');await page.getByLabel('Staff number').fill('STAFF-A');await page.getByRole('button',{name:'Create staff profile'}).click();await expect(page.getByRole('alert',{name:'Staff profile feedback'}).filter({hasText:'already in use'})).toBeVisible();
 await page.getByLabel('First name').fill('Grace');await page.getByLabel('Last name').fill('Hopper');await page.getByLabel('Contact email (optional)').fill('invalid-email');await page.getByLabel('Staff number').fill('STAFF-C');await page.getByRole('button',{name:'Create staff profile'}).click();await expect(page.getByRole('alert',{name:'Staff profile feedback'}).filter({hasText:'Check the name'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const response=await page.request.get('/api/v1/employees');expect(response.status()).toBe(200);void school;
});
