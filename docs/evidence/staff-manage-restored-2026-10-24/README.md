# Staff Manage experience restoration — 24 October 2026

The directory Manage dialog was compared directly with the frozen reference in `docs/execution/STAFF_REVIEW/references/approved-20261022/`. The regression was confirmed: the application had replaced the approved contextual chooser with grouped Profile and management links and routed portal access through Staff Profile.

The current candidate restores the approved composition and behavior:

- the chooser contains **Edit personal details**, **Edit employment details**, and the state-specific portal action only;
- Personal, Employment, and Staff access drawers open directly over `/admin/teachers` and retain the directory URL;
- the chooser uses the frozen 380px desktop width, 48px action rows, stacked name/employee code, pencil icons for both corrections, and the shield icon for portal access;
- the existing production drawers and owner commands are reused, including authorization, expected versions, exact-key recovery, and failed-refresh handling;
- the separate Access tab and Access administration action remain absent as previously approved.

## Visual evidence

Reference: `docs/evidence/staff-approved-handoff-2026-10-22/reference-manage-desktop.png` and `reference-manage-mobile.png`.

Current application:

- `chromium-chooser.png`, `chromium-personal.png`, `chromium-employment.png`, `chromium-access.png`
- `mobile-chooser.png`, `mobile-personal.png`, `mobile-employment.png`, `mobile-access.png`

The screenshots were inspected directly. The chooser hierarchy, dimensions, spacing, labels, icons, close control, and direct drawer transitions match the frozen reference. Fictional fixture names and access state differ by design.

## Verification

- Focused ESLint: passed.
- `pnpm exec tsc --noEmit`: passed.
- Focused Playwright, Chromium and Mobile, one worker: 2/2 passed.
- Existing same-name/safe-failure journey plus restored Manage journey, Chromium, one worker: 2/2 passed.
- Production build with `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; build ID `JnMmF8avYmew8atCEdLu`.

The first browser attempt used an incorrect wrapper separator and began an unfiltered suite; it was stopped after two unrelated tests. The recorded passing commands omit that separator. A prior 2 GiB build attempt reached the known heap limit; the established 4 GiB setting passed.

Human visual acceptance, native accessibility, TEN-03, and production readiness remain PENDING.
