import { test,expect,type Page } from "@playwright/test";
import { randomBytes,randomUUID } from "node:crypto";
import { createAccessServices } from "../../backend/composition/access";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const url=process.env.TEST_DATABASE_URL??"";
if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test database required");
const service=createAccessServices({databaseUrl:url});
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url,connectionTimeoutMillis:5000}),log:[]});
function fixture(){const suffix=randomUUID();return {organizationName:`Synthetic browser ${suffix}`,schoolName:`Browser school ${suffix.slice(0,8)}`,schoolCode:"MAIN",timezone:"Asia/Kolkata",adminEmail:`browser-${suffix}@vschool.example`,password:randomBytes(24).toString("base64url")};}
const input=fixture(),foreign=fixture(),disabled=fixture(),locked=fixture();
let ids:Awaited<ReturnType<typeof service.provisionSchool>>,foreignIds:typeof ids,disabledIds:typeof ids;
test.beforeAll(async()=>{const operator={operatorId:randomUUID(),verified:true as const};ids=await service.provisionSchool(input,operator);foreignIds=await service.provisionSchool(foreign,operator);disabledIds=await service.provisionSchool(disabled,operator);await db.userAccount.update({where:{id:disabledIds.accountId},data:{status:"DISABLED",version:{increment:1}}});await service.provisionSchool(locked,operator);for(let i=0;i<5;i++)await service.authenticate(locked.adminEmail,randomBytes(24).toString("hex"));});
test.afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function login(page:Page,email=input.adminEmail,password=input.password){await page.goto("/sign-in");await page.getByRole("textbox",{name:"Email address",exact:true}).fill(email);await page.getByLabel(/^Password/).fill(password);await page.getByRole("button",{name:"Sign in",exact:true}).click();}
test("logged-out home and setup redirect; API returns private 401",async({page})=>{
 for(const path of ["/admin","/admin/setup"]){await page.goto(path);await expect(page).toHaveURL(/\/sign-in$/);await expect(page.getByRole("heading",{name:"A thoughtful space for your school.",level:1})).toBeVisible();}
 await page.setViewportSize(test.info().project.name==="mobile"?{width:390,height:844}:{width:1440,height:1000});await page.screenshot({path:`docs/evidence/ex-04/generic-sign-in-${test.info().project.name}.png`,fullPage:true});
 const response=await page.request.get("/api/v1/school");expect(response.status()).toBe(401);expect(response.headers()["cache-control"]).toContain("no-store");
});
test("administrator signs in, sees current scope and setup, rejects foreign school, signs out",async({page})=>{
 const errors:string[]=[];page.on("pageerror",error=>errors.push(error.name));await login(page);await expect(page).toHaveURL(/\/admin$/);
 await expect(page.getByRole("heading",{name:"Your school day, at a glance",exact:true})).toBeVisible();await expect(page.getByText(input.schoolName,{exact:false}).first()).toBeVisible();await expect(page.locator(".dashboard-summary-strip")).toHaveCount(1);await expect(page.locator(".dashboard-summary-item")).toHaveCount(3);
 const session=await(await page.request.get("/api/auth/session")).json();expect(session.identity).toEqual({accountId:ids.accountId,tokenVersion:1});expect(session.user).toBeUndefined();
 const cookies=await page.context().cookies();const cookie=cookies.find(c=>c.name.endsWith("session-token"));expect(cookie?.httpOnly).toBe(true);expect(cookie?.sameSite).toBe("Lax");
 const own=await page.request.get(`/api/v1/school?schoolId=${ids.schoolId}`);expect(own.status()).toBe(200);expect((await own.json()).scope.schoolId).toBe(ids.schoolId);
 const denied=await page.request.get(`/api/v1/school?schoolId=${foreignIds.schoolId}`);expect(denied.status()).toBe(404);expect(await denied.json()).toEqual({error:"NOT_FOUND"});
 const schoolNavigation=page.getByRole("navigation",{name:"School administration"});if(test.info().project.name==="mobile")await page.getByRole("button",{name:"Open navigation"}).click();const schoolSetup=schoolNavigation.getByRole("link",{name:"School setup",exact:true});if(!await schoolSetup.isVisible())await schoolNavigation.getByRole("button",{name:"School management",exact:true}).click();await schoolSetup.click();await expect(page.getByRole("heading",{name:"School setup",exact:true})).toBeVisible();if(test.info().project.name==="mobile")await page.getByRole("button",{name:"Open navigation"}).click();await schoolNavigation.getByRole("link",{name:"Today",exact:true}).click();await expect(page.getByRole("heading",{name:"Your school day, at a glance",exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`artifacts/iam-admin-${test.info().project.name}.png`,fullPage:true});const originalViewport=page.viewportSize()!;await page.setViewportSize({width:1024,height:900});await expect(schoolNavigation).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.setViewportSize({width:768,height:900});await expect(schoolNavigation).toBeHidden();const intermediateMenu=page.getByRole("button",{name:"Open navigation"});await intermediateMenu.click();await expect(page.locator("#portal-navigation")).toHaveAttribute("role","dialog");await page.keyboard.press("Escape");await expect(intermediateMenu).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.setViewportSize(originalViewport);
 if(test.info().project.name==="mobile")await page.getByRole("button",{name:"Open navigation"}).click();
 await page.getByRole("link",{name:"Sign out",exact:true}).click();await expect(page).toHaveURL(/\/admin\/context\?destination=sign-out$/);
 await page.getByRole("button",{name:/^Continue/}).click();await page.getByRole("checkbox",{name:"I have reviewed any unsaved work."}).check();await page.getByRole("button",{name:/^Continue/}).click();await page.getByRole("button",{name:/^Confirm/}).click();
 await expect(page).toHaveURL(/\/sign-in$/);await page.goto("/admin");await expect(page).toHaveURL(/\/sign-in$/);expect(errors).toEqual([]);
});
test("wrong, unknown, locked and disabled credentials share feedback and clear password",async({page})=>{
 const wrong=randomBytes(24).toString("hex"),messages:string[]=[];
 for(const [email,password] of [[input.adminEmail,wrong],[fixture().adminEmail,wrong],[disabled.adminEmail,disabled.password],[locked.adminEmail,locked.password]]){
  await login(page,email,password);const feedback=page.getByRole("alert").filter({hasText:"Unable to sign in"});await expect(feedback).toBeVisible();await expect(feedback).toBeFocused();messages.push(await feedback.innerText());await expect(page.getByLabel(/^Password/)).toHaveValue("");await expect(page).toHaveURL(/\/sign-in/);
 }expect(new Set(messages).size).toBe(1);
});
test("same-origin and provider CSRF checks reject forged auth posts",async({page})=>{
 const hostile=await page.request.post("/api/auth/callback/credentials",{headers:{origin:"https://foreign.example"},form:{email:input.adminEmail,password:randomBytes(24).toString("hex")}});expect(hostile.status()).toBe(403);
 const noCsrf=await page.request.post("/api/auth/callback/credentials",{headers:{origin:"http://127.0.0.1:3401"},form:{email:input.adminEmail,password:input.password,csrfToken:"invalid"},maxRedirects:0});expect(noCsrf.status()).toBe(302);expect(noCsrf.headers().location).toContain("csrf=true");
 const large=await page.request.post("/api/auth/callback/credentials",{headers:{origin:"http://127.0.0.1:3401"},data:"a".repeat(9000)});expect(large.status()).toBe(413);
 expect((await page.request.get("/api/v1/school")).status()).toBe(401);
});
test("existing session loses access immediately after tokenVersion revocation",async({page})=>{
 const revoked=fixture(),result=await service.provisionSchool(revoked,{operatorId:randomUUID(),verified:true});await login(page,revoked.adminEmail,revoked.password);await expect(page).toHaveURL(/\/admin$/);
 await db.userAccount.update({where:{id:result.accountId},data:{tokenVersion:{increment:1},version:{increment:1}}});expect((await page.request.get("/api/v1/school")).status()).toBe(401);await page.reload();await expect(page).toHaveURL(/\/sign-in$/);
});
test("current membership suspension rejects an existing session without exposing school data",async({page})=>{
 const member=fixture(),result=await service.provisionSchool(member,{operatorId:randomUUID(),verified:true});await login(page,member.adminEmail,member.password);await expect(page).toHaveURL(/\/admin$/);
 await db.schoolMembership.update({where:{id:result.membershipId},data:{status:"SUSPENDED",version:{increment:1}}});const response=await page.request.get("/api/v1/school");expect(response.status()).toBe(404);expect(await response.json()).toEqual({error:"NOT_FOUND"});
 const pageResponse=await page.reload();expect(pageResponse?.status()).toBe(404);await expect(page.getByRole("heading",{name:member.schoolName,exact:true})).toHaveCount(0);
});
