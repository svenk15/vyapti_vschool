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

test("gallery supports all approved themes and negative states at the required viewport", async ({ page }) => {
  const viewport = test.info().project.name === "mobile"
    ? { width: 390, height: 844 }
    : { width: 1440, height: 1000 };
  await page.setViewportSize(viewport);
  await page.goto("/design-system");
  await expect(page.locator("html")).toHaveAttribute("data-vs-theme", "forest");
  expect(await page.locator("body").evaluate(node => getComputedStyle(node).fontFamily)).toContain("Inter");
  for (const palette of ["forest", "amethyst", "porcelain", "linen"]) {
    await page.getByLabel("Preview theme").selectOption(palette);
    await expect(page.locator(".brand-surface").first()).toHaveAttribute("data-vs-theme",palette);
    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      tableScroll: Array.from(document.querySelectorAll<HTMLElement>(".table-scroll")).map(node => ({
        left: Math.round(node.getBoundingClientRect().left),
        right: Math.round(node.getBoundingClientRect().right),
        width: Math.round(node.getBoundingClientRect().width),
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        overflowX: getComputedStyle(node).overflowX,
      })),
      overflowing: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter(node => !node.closest(".table-scroll"))
      .map(node => ({
        element: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}${node.className && typeof node.className === "string" ? `.${node.className.trim().replace(/\s+/g, ".")}` : ""}`,
        right: Math.round(node.getBoundingClientRect().right),
        width: Math.round(node.getBoundingClientRect().width),
      }))
      .filter(item => item.right > window.innerWidth + 1)
      .sort((left, right) => right.right - left.right)
      .slice(0, 8),
    }));
    expect(layout.documentWidth, JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewport);
    await expect(page.getByRole("button", { name: "Saving example" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Saving example" })).toHaveAttribute("aria-busy", "true");
    await expect(page.getByRole("button", { name: "Unavailable", exact: true })).toBeDisabled();
    await expect(page.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Email address")).toHaveAccessibleDescription(/Enter an email address/);
    await page.screenshot({ path: `docs/evidence/ux-revamp-02-2026-10-18/gallery-${palette}-${test.info().project.name}.png`, fullPage: true });
  }
  await page.getByRole("tab", { name: "Empty", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Error", exact: true })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Something needs attention" })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "Empty", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Error", exact: true })).toBeFocused();
  await page.getByRole("searchbox", { name: "Search sample records" }).fill("no-such-example");
  await expect(page.getByRole("table", { name: "Sample roster" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search sample records" }).press("Enter");
  await expect(page.getByRole("heading", { name: "No matching records" })).toBeVisible();
  await page.getByRole("button", { name: "Clear search sample records" }).click();
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

test("controlled list recipes apply or discard drafts and retain unknown request identity", async ({ page }) => {
  await page.goto("/design-system");
  const attribute = page.getByRole("combobox", { name: "Search by" });
  await attribute.focus();
  await attribute.selectOption("section");
  await expect(attribute).toBeFocused();
  await expect(page.getByRole("searchbox", { name: "Search sample records" })).not.toBeFocused();
  const filterTrigger = page.getByRole("button", { name: "Filters", exact: true });
  await filterTrigger.click();
  const filterDialog = page.getByRole("dialog", { name: "Filters" });
  await expect(filterDialog).toBeVisible();
  await page.getByRole("checkbox", { name: "Absent", exact: true }).check();
  await expect(filterDialog.locator("details")).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(filterTrigger).toBeFocused();
  await expect(page.getByRole("row")).toHaveCount(7);

  await filterTrigger.click();
  await expect(page.getByRole("checkbox", { name: "Absent", exact: true })).not.toBeChecked();
  await page.getByRole("checkbox", { name: "Present", exact: true }).check();
  await page.getByRole("checkbox", { name: "Absent", exact: true }).check();
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.getByRole("button", { name: "Filters (2)" })).toBeFocused();
  await expect(page.getByRole("row")).toHaveCount(5);

  const sortTrigger = page.getByRole("button", { name: /Sort · Student A–Z/ });
  await sortTrigger.click();
  const sortDialog = page.getByRole("dialog", { name: "Sort" });
  await expect(sortDialog.locator("details")).toHaveCount(2);
  await expect(sortDialog.locator("details").nth(0)).toHaveAttribute("open", "");
  await expect(sortDialog.locator("details").nth(1)).toHaveAttribute("open", "");
  await page.getByRole("radio", { name: "Class", exact: true }).check();
  await page.getByRole("radio", { name: "Descending", exact: true }).check();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(sortTrigger).toBeFocused();
  await expect(sortTrigger).toContainText("Student A–Z");
  await sortTrigger.click();
  await page.getByRole("radio", { name: "Class", exact: true }).check();
  await page.getByRole("radio", { name: "Descending", exact: true }).check();
  await page.getByRole("button", { name: "Apply sort" }).click();
  await expect(page.getByRole("button", { name: /Sort · Class Z–A/ })).toBeFocused();

  await expect(page.getByText("example-request-6f0f4d8a", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry same request" }).click();
  await expect(page.getByRole("status").filter({ hasText: "same fictional request key" })).toBeVisible();
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
