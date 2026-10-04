import { test,expect,type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { createAccessServices } from "../../backend/composition/access";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { schoolInput,activeStaffFixture } from "../fixtures/access-management";
const url=process.env.TEST_DATABASE_URL??"";
if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test database required");
test.setTimeout(60000);
const service=createAccessServices({databaseUrl:url}),db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const input=schoolInput();let scope:Awaited<ReturnType<typeof service.provisionSchool>>,teacher:Awaited<ReturnType<typeof activeStaffFixture>>;
test.beforeAll(async()=>{scope=await service.provisionSchool(input,{operatorId:randomUUID(),verified:true});await db.organization.update({where:{id:scope.organizationId},data:{trustMode:"OPERATOR_CLI",configurationVersion:{increment:1}}});teacher=await activeStaffFixture(db,scope);});
test.afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function login(page:Page,email=input.adminEmail,password=input.password){await page.goto('/sign-in');await page.getByRole('textbox',{name:'Email',exact:true}).fill(email);await page.getByLabel(/^Password/).fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).click();}
test('settings persist, invalid timezone fails, campuses conflict and uncertain saves replay safely',async({page})=>{
 await login(page);await expect(page).toHaveURL(/\/admin$/,{timeout:15000});await page.goto('/admin/school');
 await page.getByRole('textbox',{name:/^Timezone/}).fill('Invalid/Zone');await page.getByRole('button',{name:'Save school settings'}).click();await expect(page.getByText('Unable to complete the change',{exact:true})).toBeVisible();
 const name='Updated synthetic school '+randomUUID().slice(0,8);await page.getByRole('textbox',{name:/^Timezone/}).fill('Asia/Kolkata');await page.getByRole('textbox',{name:/^School name/}).fill(name);
 let lost=false;const keys:string[]=[];await page.route('**/api/v1/school?*',async route=>{if(route.request().method()!=='PATCH')return route.continue();keys.push(route.request().headers()['idempotency-key']);if(!lost){lost=true;await route.fetch();await route.abort('failed');}else await route.continue();});
 await page.getByRole('button',{name:'Save school settings'}).click();await expect(page.getByRole('button',{name:'Retry same request'})).toBeVisible();await page.getByRole('button',{name:'Retry same request'}).click();await expect(page.getByText('Changes saved.',{exact:true})).toBeVisible();expect(keys).toHaveLength(2);expect(keys[0]).toBe(keys[1]);await page.reload();await expect(page.getByRole('textbox',{name:/^School name/})).toHaveValue(name);
 await page.getByRole('textbox',{name:/^Campus code/}).fill('NORTH');await page.getByRole('textbox',{name:/^Campus name/}).fill('Synthetic North');await page.getByRole('button',{name:'Add campus',exact:true}).click();await expect(page.getByRole('cell',{name:'Synthetic North',exact:true})).toBeVisible();await page.getByRole('button',{name:'Add campus',exact:true}).click();await expect(page.getByText('Unable to complete the change',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`artifacts/iam-02-settings-${test.info().project.name}.png`,fullPage:true});
});
test('pending staff persists, last admin is protected, active teacher suspension is immediate and reinstatement restores access',async({page,browser})=>{
 await login(page);await expect(page).toHaveURL(/\/admin$/,{timeout:15000});await page.goto('/admin/users');const email=`pending-${randomUUID()}@vschool.example`;await page.getByRole('textbox',{name:/^Staff email/}).fill(email);await page.getByRole('button',{name:'Create pending staff access',exact:true}).click();const pending=page.getByRole('row').filter({hasText:email});await expect(pending.getByRole('cell',{name:'PENDING',exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('row').filter({hasText:email})).toBeVisible();
 await page.getByRole('button',{name:`Manage ${input.adminEmail}`,exact:true}).click();await page.getByRole('combobox',{name:/^Action/}).selectOption('REVOKE');await page.getByRole('textbox',{name:/^Reason/}).fill('Synthetic last administrator check');await page.getByRole('button',{name:'Apply staff change'}).click();await expect(page.getByText('Unable to complete the change',{exact:true})).toBeVisible();await page.keyboard.press('Escape');
 const context=await browser.newContext({baseURL:'http://127.0.0.1:3401'}),staffPage=await context.newPage();await login(staffPage,teacher.email,teacher.password);await expect(staffPage).toHaveURL(/\/account$/,{timeout:15000});expect((await staffPage.request.get('/api/v1/me')).status()).toBe(200);
 for(const [action,status] of [['SUSPEND',404],['REINSTATE',200]] as const){await page.getByRole('button',{name:`Manage ${teacher.email}`,exact:true}).click();await page.getByRole('combobox',{name:/^Action/}).selectOption(action);await page.getByRole('textbox',{name:/^Reason/}).fill('Synthetic lifecycle check');await page.getByRole('button',{name:'Apply staff change'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);expect((await staffPage.request.get('/api/v1/me')).status()).toBe(status);}
 const denied=await staffPage.request.post('/api/v1/campuses',{headers:{origin:'http://127.0.0.1:3401','idempotency-key':randomUUID()},data:{payload:{code:'DENIED',name:'Denied'}}});expect(denied.status()).toBe(404);
 const forged=await page.request.post('/api/v1/campuses',{headers:{origin:'https://foreign.example','idempotency-key':randomUUID()},data:{payload:{code:'DENIED',name:'Denied'}}});expect(forged.status()).toBe(403);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`artifacts/iam-02-staff-${test.info().project.name}.png`,fullPage:true});await context.close();
});
