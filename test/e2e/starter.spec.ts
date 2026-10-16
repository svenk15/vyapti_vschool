import { test,expect } from "@playwright/test";
test("landing shows real readiness and honest preview scope",async({page,request})=>{
 const health=await request.get("/api/health");expect(health.status()).toBe(200);expect((await health.json()).ready).toBe(true);
 await page.goto("/");await expect(page.getByRole("heading",{name:"Database connected"})).toBeVisible();await expect(page.getByText("Illustrative design · no live school data")).toBeVisible();await expect(page.getByRole("heading",{name:/Every school’s/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:`artifacts/landing-${test.info().project.name}.png`,fullPage:true});
});
test("health responses reveal no connection credentials",async({request})=>{const r=await request.get("/api/health");expect(await r.text()).not.toMatch(/postgresql:|password|DATABASE_URL/);expect(r.headers()["cache-control"]).toBe("no-store");});
test("school sign-in branding is scoped and preview never authenticates",async({page})=>{
 await page.goto("/sign-in/greenwood-north");await expect(page.getByText("Greenwood Schools",{exact:true})).toBeVisible();await expect(page.getByRole("heading",{name:"Welcome back."})).toBeVisible();
 await page.getByLabel("Email address").fill("test@school.example");await page.getByLabel(/^Password/).fill("sample-only-123");await page.getByRole("button",{name:"Show password"}).click();await expect(page.getByLabel(/^Password/)).toHaveAttribute("type","text");
 let requests=0;page.on("request",r=>{if(r.method()==="POST")requests++;});await page.getByRole("button",{name:/Continue to your school/}).click();await expect(page.getByText(/No credentials were sent or stored/)).toBeVisible();expect(requests).toBe(0);await expect(page.getByLabel(/^Password/)).toHaveValue("");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:`artifacts/login-${test.info().project.name}.png`,fullPage:true});
 await page.goto("/sign-in/aster-central");await expect(page.getByText("Aster Learning Trust",{exact:true})).toBeVisible();await expect(page.getByText("Greenwood Schools",{exact:true})).toHaveCount(0);
 const response=await page.goto("/sign-in/not-a-school");expect(response?.status()).toBe(404);
});
test("configuration keeps branch selections separate and supports fees-only",async({page})=>{
 await page.goto("/configure");await expect(page.getByRole("switch",{name:"Attendance",exact:true})).toBeChecked();await expect(page.getByRole("switch",{name:"Fees & payments",exact:true})).not.toBeChecked();
 await page.getByLabel("Branch",{exact:true}).selectOption("greenwood-south");await expect(page.getByRole("switch",{name:"Fees & payments",exact:true})).toBeChecked();
 await page.getByLabel("Institution",{exact:true}).selectOption("Aster Learning Trust");await expect(page.getByRole("switch",{name:"Attendance",exact:true})).not.toBeChecked();await expect(page.getByRole("switch",{name:"Fees & payments",exact:true})).toBeChecked();await expect(page.locator(".foundation-note")).toContainText("Student records");await expect(page.locator(".foundation-note")).not.toContainText("Academic structure");
 await page.getByLabel("Brand palette").selectOption("clay");await page.getByLabel("Welcome message").fill("A welcome of our own.");await expect(page.locator(".brand-preview")).toContainText("A welcome of our own.");await page.getByRole("button",{name:"Review configuration"}).click();await expect(page.getByText(/Nothing was persisted/)).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:`artifacts/configuration-${test.info().project.name}.png`,fullPage:true});
});
test("table applies controlled search and sort to accessible sample records",async({page})=>{
 await page.goto("/design-system");const table=page.getByRole("table",{name:"Sample roster"}),search=page.getByRole("searchbox",{name:"Search sample records"});await expect(table.getByRole("row")).toHaveCount(7);await expect(table).toContainText("Noor Example");
 await search.fill("Ravi");await search.press("Enter");await expect(table.getByRole("row")).toHaveCount(2);await search.fill("zz-no-match");await search.press("Enter");await expect(page.getByRole("heading",{name:"No matching records"})).toBeVisible();
 await page.getByRole("button",{name:"Clear search sample records"}).click();await page.getByRole("button",{name:/Sort · Student A–Z/}).click();await page.getByRole("radio",{name:"Class",exact:true}).check();await page.getByRole("radio",{name:"Descending",exact:true}).check();await page.getByRole("button",{name:"Apply sort"}).click();await expect(page.getByRole("button",{name:/Sort · Class Z–A/})).toBeVisible();
 await page.locator("#data").screenshot({path:`artifacts/table-${test.info().project.name}.png`});
});
test("dialog tabs notifications and palettes support keyboard interaction",async({page})=>{
 await page.goto("/design-system");await page.getByRole("button",{name:"Open confirmation"}).click();await expect(page.getByRole("dialog",{name:"Review this change"})).toBeVisible();await page.keyboard.press("Escape");await expect(page.getByRole("dialog",{name:"Review this change"})).not.toBeVisible();await expect(page.getByRole("button",{name:"Open confirmation"})).toBeFocused();
 await page.getByRole("button",{name:"View details ↗",exact:true}).click();await expect(page.getByRole("dialog",{name:"Record details"})).toBeVisible();await page.getByRole("button",{name:"Close Record details"}).click();
 await page.getByRole("tab",{name:"Empty",exact:true}).focus();await page.keyboard.press("ArrowRight");await expect(page.getByRole("tab",{name:"Loading",exact:true})).toBeFocused();await expect(page.getByRole("status",{name:"Loading sample roster"})).toBeVisible();
 await page.getByRole("button",{name:"Primary action",exact:true}).click();await expect(page.getByText("Your preview action is complete. No data was saved.")).toBeVisible();await page.getByRole("button",{name:"Dismiss notification"}).click();
 await page.getByLabel("Preview palette").selectOption("indigo");await expect(page.locator(".brand-surface").first()).toHaveAttribute("style",/464985/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:`artifacts/gallery-${test.info().project.name}.png`,fullPage:true});
});
