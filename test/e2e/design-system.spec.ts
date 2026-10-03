import { test, expect } from "@playwright/test";

test("file selection rejects unsupported and oversized files and recovers without uploading", async ({ page }) => {
  await page.goto("/design-system");
  const file = page.getByLabel("Select an example roster");
  const selection = page.getByRole("status").filter({ hasText: "selected locally" });
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.method()); });
  await file.setInputFiles({ name: "example.CSV", mimeType: "text/csv", buffer: Buffer.from("synthetic") });
  await expect(selection).toContainText("example.CSV selected locally");
  await file.setInputFiles({ name: "example.txt", mimeType: "text/plain", buffer: Buffer.from("synthetic") });
  await expect(file).toHaveAttribute("aria-invalid", "true");
  await expect(file).toHaveAccessibleDescription("Choose a CSV file (.csv).");
  await expect(page.getByRole("alert").filter({ hasText: "Choose a CSV file" })).toBeVisible();
  await expect(selection).toHaveCount(0);
  expect(await file.evaluate(node => (node as HTMLInputElement).files?.length)).toBe(0);
  await file.setInputFiles({ name: "large.csv", mimeType: "text/csv", buffer: Buffer.alloc(2 * 1024 * 1024 + 1, "x") });
  await expect(file).toHaveAccessibleDescription("Choose a file no larger than 2 MiB.");
  expect(await file.evaluate(node => (node as HTMLInputElement).files?.length)).toBe(0);
  await file.setInputFiles({ name: "boundary.csv", mimeType: "text/csv", buffer: Buffer.alloc(2 * 1024 * 1024, "x") });
  await expect(selection).toContainText("boundary.csv selected locally");
  await expect(file).not.toHaveAttribute("aria-invalid", "true");
  await expect(file).toHaveAccessibleDescription(/CSV only/);
  await file.setInputFiles([]);
  await expect(selection).toHaveCount(0);
  expect(writes).toEqual([]);
});

test("modal and drawer contain keyboard focus and return it to the trigger", async ({ page }) => {
  await page.goto("/design-system");
  for (const [triggerName, title] of [["Open confirmation", "Review this change"], ["View details ↗", "Record details"]]) {
    const trigger = page.getByRole("button", { name: triggerName, exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: title });
    await expect(dialog).toBeVisible();
    for (const key of ["Tab", "Tab", "Tab", "Shift+Tab", "Shift+Tab", "Shift+Tab"]) {
      await page.keyboard.press(key);
      expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("gallery supports all palettes and negative states at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/design-system");
  for (const palette of ["forest", "indigo", "clay"]) {
    await page.getByLabel("Preview palette").selectOption(palette);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("button", { name: "Saving example" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Saving example" })).toHaveAttribute("aria-busy", "true");
    await expect(page.getByRole("button", { name: "Unavailable", exact: true })).toBeDisabled();
    await expect(page.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Email address")).toHaveAccessibleDescription(/Enter an email address/);
    await page.screenshot({ path: `artifacts/ds-01-${palette}-${test.info().project.name}.png`, fullPage: true });
  }
  await page.getByRole("tab", { name: "Empty", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Error", exact: true })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Something needs attention" })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "Empty", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Error", exact: true })).toBeFocused();
  await page.getByLabel("Search sample records").fill("no-such-example");
  await expect(page.getByRole("heading", { name: "No matching records" })).toBeVisible();
  await page.getByLabel("Search sample records").fill("");
  await expect(page.getByRole("table", { name: "Sample roster" })).toBeVisible();
  const guidance = page.locator(".tooltip-wrap");
  await guidance.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  expect(await page.locator(".spinner").evaluate(node => getComputedStyle(node).animationName)).toBe("none");
  await page.getByRole("button", { name: "Open confirmation" }).focus();
  expect(await page.getByRole("button", { name: "Open confirmation" }).evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Review this change" })).toBeVisible();
  await page.keyboard.press("Escape");
});

test("form examples and disclosure respond to keyboard without losing entered text", async ({ page }) => {
  await page.goto("/design-system");
  await page.getByLabel("Full name").fill("Synthetic Example");
  await page.getByLabel("Reason for correction").fill("Synthetic correction explanation.");
  const checkbox = page.getByRole("checkbox", { name: "I have reviewed the changes" });
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  const toggle = page.getByRole("switch", { name: "Receive non-sensitive updates" });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).not.toBeChecked();
  await page.getByRole("radio", { name: "Compact", exact: true }).check();
  await expect(page.locator("#data")).toHaveClass(/density-compact/);
  await page.getByRole("radio", { name: "Comfortable", exact: true }).check();
  await expect(page.locator("#data")).toHaveClass(/density-comfortable/);
  await page.getByLabel("From", { exact: true }).fill("2026-10-15");
  await expect(page.getByLabel("Through", { exact: true })).toHaveAttribute("min", "2026-10-15");
  await page.getByLabel("Through", { exact: true }).fill("2026-10-14");
  expect(await page.getByLabel("Through", { exact: true }).evaluate(node => (node as HTMLInputElement).validity.rangeUnderflow)).toBe(true);
  await page.getByLabel("Through", { exact: true }).fill("2026-10-31");
  const disclosure = page.getByText("What happens to an invalid row?", { exact: true });
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Never silently skip data/)).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Never silently skip data/)).not.toBeVisible();
  await expect(page.getByLabel("Full name")).toHaveValue("Synthetic Example");
  await expect(page.getByLabel("Reason for correction")).toHaveValue("Synthetic correction explanation.");
});
