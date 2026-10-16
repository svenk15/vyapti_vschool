import { test, expect } from "@playwright/test";

const profiles = [
  { slug: "greenwood-north", institution: "Greenwood Schools", branch: "North Campus", primary: "#245c49", support: "office@greenwood.example" },
  { slug: "greenwood-south", institution: "Greenwood Schools", branch: "South Campus", primary: "#854e3c", support: "office@greenwood.example" },
  { slug: "aster-central", institution: "Aster Learning Trust", branch: "Central School", primary: "#464985", support: "office@aster.example" },
];

test("all three brand previews resolve exact institution, branch, palette and help identity", async ({ page }) => {
  for (const profile of profiles) {
    await page.goto(`/sign-in/${profile.slug}`);
    await expect(page.locator(".school-identity")).toContainText(profile.institution);
    await expect(page.locator(".school-identity")).toContainText(profile.branch);
    await expect(page.locator(".login-surface")).toHaveAttribute("style", new RegExp(profile.primary));
    await expect(page.getByText(/Authentication is not connected/)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Need help?" }).click();
    const information = page.getByRole("region", { name: "Preview information" });
    await expect(information).toContainText(profile.support);
    await expect(information).toBeFocused();
    await page.getByRole("button", { name: "Need help?" }).click();
    await expect(information).toBeFocused();
    await page.screenshot({ path: `artifacts/brd-01-${profile.slug}-${test.info().project.name}.png`, fullPage: true });
  }
  for (const slug of ["not-a-school", "Greenwood-north", "constructor", "greenwood"]) {
    const response = await page.goto(`/sign-in/${slug}`);
    expect(response?.status()).toBe(404);
    await expect(page.locator(".school-identity")).toHaveCount(0);
  }
});

test("preview blocks invalid samples then clears both fields, hides password and focuses feedback without sending or storing them", async ({ page, context }) => {
  await page.goto("/sign-in/greenwood-south");
  const email = page.getByLabel("Email address");
  const password = page.getByLabel(/^Password/);
  const submit = page.getByRole("button", { name: /Continue to your school/ });
  const writes: string[] = [], urls: string[] = [];
  page.on("request", request => { urls.push(request.url()); if (request.method() !== "GET") writes.push(request.method()); });
  const storageBefore = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  const cookiesBefore = await context.cookies();
  await submit.click();
  expect(await email.evaluate(node => (node as HTMLInputElement).validity.valueMissing)).toBe(true);
  await expect(page.getByRole("region", { name: "Preview information" })).toHaveCount(0);
  await email.fill("invalid-example");
  await password.fill("sample-only-123");
  await submit.click();
  expect(await email.evaluate(node => (node as HTMLInputElement).validity.typeMismatch)).toBe(true);
  await expect(page.getByRole("region", { name: "Preview information" })).toHaveCount(0);
  await email.fill("synthetic@school.example");
  // Use actual keyboard input: browsers only enforce minlength on user-entered values.
  await password.fill("");
  await password.pressSequentially("short");
  await submit.click();
  expect(await password.evaluate(node => (node as HTMLInputElement).validity.tooShort)).toBe(true);
  await expect(page.getByRole("region", { name: "Preview information" })).toHaveCount(0);
  await password.fill("sample-only-123");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(page.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
  await submit.click();
  const information = page.getByRole("region", { name: "Preview information" });
  await expect(information).toContainText("No credentials were sent or stored");
  await expect(information).toBeFocused();
  await expect(email).toHaveValue("");
  await expect(password).toHaveValue("");
  await expect(password).toHaveAttribute("type", "password");
  await expect(page.getByRole("button", { name: "Show password" })).toHaveAttribute("aria-pressed", "false");
  // Repeated identical feedback must still move focus from the submit control.
  await email.fill("synthetic@school.example");
  await password.fill("sample-only-123");
  await submit.click();
  await expect(information).toBeFocused();
  expect(writes).toEqual([]);
  expect(urls.some(url => url.includes("synthetic%40") || url.includes("sample-only-123"))).toBe(false);
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual(storageBefore);
  expect(await context.cookies()).toEqual(cookiesBefore);
  await expect(page).toHaveURL(/\/sign-in\/greenwood-south$/);
});

test("branded sign-in controls fit 360px and remain keyboard operable with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const profile of profiles) {
    await page.goto(`/sign-in/${profile.slug}`);
    await expect(page.getByLabel("Email address")).toBeVisible();
    await page.getByLabel("Email address").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel(/^Password/)).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Show password" })).toBeFocused();
    await page.keyboard.press("Space");
    await expect(page.getByLabel(/^Password/)).toHaveAttribute("type", "text");
    await page.keyboard.press("Space");
    await expect(page.getByLabel(/^Password/)).toHaveAttribute("type", "password");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/brd-01-360-${profile.slug}-${test.info().project.name}.png`, fullPage: true });
  }
});

test("long public labels reflow without clipping at 360px and simulated 200 percent layout zoom", async ({ page }) => {
  for (const [width, zoom] of [[360, 1], [1280, 2]]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/sign-in/aster-central");
    await page.getByRole("button", { name: "Need help?" }).click();
    // Stress the production markup's layout with synthetic contract-length text.
    // CSS zoom exercises layout scaling; native browser zoom remains a manual gate.
    await page.evaluate(scale => {
      document.documentElement.style.zoom = String(scale);
      const labels: [string, string][] = [
        [".school-identity strong", "Institution".repeat(16).slice(0, 160)],
        [".school-identity p", "Branch".repeat(27).slice(0, 160)],
        [".login-form-inner > .eyebrow", "Branch".repeat(27).slice(0, 160)],
        [".login-story h1", "Welcome".repeat(26).slice(0, 180)],
        [".login-form-inner [role=status]", "a".repeat(239) + "@school.example"],
      ];
      for (const [selector, text] of labels) {
        const node = document.querySelector(selector);
        if (!node) throw new Error("Missing branding layout target");
        node.textContent = text;
      }
    }, zoom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const selector of [".login-story-heading", ".school-identity", ".login-form-inner"]) {
      const dimensions = await page.locator(selector).evaluate(node => ({ scroll: node.scrollWidth, client: node.clientWidth }));
      expect(dimensions.scroll, `${selector} at ${width}px / ${zoom}x`).toBeLessThanOrEqual(dimensions.client);
    }
    await page.screenshot({ path: `artifacts/brd-01-long-${width}-${zoom}-${test.info().project.name}.png`, fullPage: true });
  }
});
