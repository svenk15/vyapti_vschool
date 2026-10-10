import {test,expect,type Page} from "@playwright/test";
import {randomBytes,randomUUID} from "node:crypto";
import {readdir,readFile} from "node:fs/promises";
import {join} from "node:path";
import {createAccessServices} from "../../backend/composition/access";
import {PrismaClient} from "../../generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";
import {schoolInput} from "../fixtures/access-management";
const url=process.env.TEST_DATABASE_URL??"";if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test database required");
test.setTimeout(60000);
const service=createAccessServices({databaseUrl:url}),db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),input=schoolInput(),mailDirectory=join(process.cwd(),"artifacts/mail-sink");let scope:Awaited<ReturnType<typeof service.provisionSchool>>,currentPassword=input.password;
test.beforeAll(async()=>{scope=await service.provisionSchool(input,{operatorId:randomUUID(),verified:true});await db.userAccount.update({where:{id:scope.accountId},data:{emailVerifiedAt:new Date()}});});
test.afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function login(page:Page,email=input.adminEmail,password=input.password){await page.goto("/sign-in");await page.getByRole("textbox",{name:"Email address",exact:true}).fill(email);await page.getByLabel(/^Password/).fill(password);await page.getByRole("button",{name:"Sign in",exact:true}).click();}
async function mailFor(recipient:string,before:Set<string>){let found:{id:string;recipient:string;link:string;expiresAt:string}|undefined;await expect.poll(async()=>{try{for(const file of await readdir(mailDirectory)){if(before.has(file))continue;const message=JSON.parse(await readFile(join(mailDirectory,file),"utf8"));if(message.recipient===recipient){found=message;return true;}}}catch{}return false;},{timeout:10000}).toBe(true);return found!;}
async function files(){try{return new Set(await readdir(mailDirectory));}catch{return new Set<string>();}}

test("public reset stays generic, uses a fragment mail link, revokes the old session and lets the user sign in again",async({page,browser})=>{
 await login(page,input.adminEmail,input.password);await expect(page).toHaveURL(/\/admin$/,{timeout:15000});const old=await browser.newContext({baseURL:"http://127.0.0.1:3401"});await old.addCookies(await page.context().cookies());
 const before=await files();await page.goto("/forgot-password");await page.getByRole("textbox",{name:"Email address",exact:true}).fill(input.adminEmail);await page.getByRole("button",{name:"Send reset instructions"}).click();await expect(page.getByRole("status").filter({hasText:"If this account can use email recovery"})).toBeVisible();
 const mail=await mailFor(input.adminEmail,before),link=new URL(mail.link);expect(link.pathname).toBe("/reset-password");expect(link.search).toBe("");expect(link.hash.length).toBeGreaterThan(20);
 const response=await page.goto(mail.link);expect(response?.headers()["referrer-policy"]).toBe("no-referrer");expect(response?.headers()["cache-control"]).toMatch(/no-store|no-cache/);await expect(page.getByLabel(/^New password/)).toBeVisible();await expect(page).not.toHaveURL(/#/);
 const replacement=randomBytes(24).toString("base64url");currentPassword=replacement;await page.getByLabel(/^New password/).fill(replacement);await page.getByLabel(/^Confirm new password/).fill(replacement);await page.getByRole("button",{name:"Change password"}).click();await expect(page.getByText("Password changed",{exact:true})).toBeVisible();expect((await old.request.get("/api/v1/me")).status()).toBe(401);
 const fresh=await browser.newPage();await login(fresh,input.adminEmail,replacement);await expect(fresh).toHaveURL(/\/admin$/,{timeout:15000});expect((await fresh.request.get("/api/v1/me")).status()).toBe(200);await old.close();await fresh.close();
});

test("school administrator invite uses the mail sink and acceptance activates only the scoped account membership",async({page,browser})=>{
 await login(page,input.adminEmail,currentPassword);await expect(page).toHaveURL(/\/admin$/,{timeout:15000});await page.goto("/admin/users");await expect(page.getByRole("heading",{name:"Invite staff by email"})).toBeVisible();
 const email=`browser-invite-${randomUUID()}@vschool.example`,before=await files();await page.getByRole("textbox",{name:/^Staff email/}).fill(email);await page.getByRole("button",{name:"Send invitation"}).click();await expect(page.getByText("Invitation sent. The recipient can accept it using the email link.")).toBeVisible();
 const mail=await mailFor(email,before),link=new URL(mail.link);expect(link.pathname).toBe("/invite");expect(link.search).toBe("");expect(link.hash.length).toBeGreaterThan(20);
 const invited=await browser.newPage();const response=await invited.goto(mail.link);expect(response?.headers()["referrer-policy"]).toBe("no-referrer");expect(response?.headers()["cache-control"]).toMatch(/no-store|no-cache/);await expect(invited.getByLabel(/^Initial password/)).toBeVisible({timeout:15000});await expect(invited).not.toHaveURL(/#/);
 const password=randomBytes(24).toString("base64url");await invited.getByLabel(/^Initial password/).fill(password);await invited.getByLabel(/^Confirm initial password/).fill(password);await invited.getByRole("button",{name:"Accept invitation"}).click();await expect(invited.getByText("Invitation accepted",{exact:true})).toBeVisible();await login(invited,email,password);await expect(invited).toHaveURL(/\/account$/,{timeout:15000});expect((await invited.request.get("/api/v1/me")).status()).toBe(200);
 await page.reload();const staff=page.getByRole("row").filter({hasText:email});await expect(staff.getByRole("cell",{name:"ACTIVE",exact:true})).toBeVisible();await expect(staff.getByRole("cell",{name:"TEACHER",exact:true})).toBeVisible();await invited.close();
});

test("unknown recovery stays generic and an invalid invitation clears secrets before focusing recovery guidance",async({page})=>{
 await page.goto('/forgot-password');const unknown=`unknown-${randomUUID()}@vschool.example`;await page.getByRole('textbox',{name:'Email address',exact:true}).fill(unknown);await page.getByRole('button',{name:'Send reset instructions'}).click();const generic=page.getByRole('status').filter({hasText:'If this account can use email recovery'});await expect(generic).toBeVisible();await expect(generic.locator('..')).toBeFocused();await expect(page.getByRole('textbox',{name:'Email address',exact:true})).toHaveValue(unknown);
 const expired='x'.repeat(43),password=randomBytes(24).toString('base64url');await page.goto(`/invite#${expired}`);await page.getByLabel(/^Initial password/).fill(password);await page.getByLabel(/^Confirm initial password/).fill(password);await page.getByRole('button',{name:'Accept invitation'}).click();const denied=page.getByRole('alert').filter({hasText:'invalid, expired, revoked, or no longer authorized'});await expect(denied).toBeVisible();await expect(denied.locator('..')).toBeFocused();await expect(page).not.toHaveURL(/#/);await expect(page.getByLabel(/^Initial password/)).toHaveCount(0);
});
