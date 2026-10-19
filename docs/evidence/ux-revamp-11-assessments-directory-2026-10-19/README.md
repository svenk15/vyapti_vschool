# UX-11 Assessments directory evidence

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Base source: `07af153`.
- Corrected source: the focused commit containing this record.
- Standard build ID: `JZi2cbc7qsZGc_ob70Zo8`.
- Application route: `/admin/assessments`.
- Preserved workflow route: `/admin/assessments?workflow=planning`.
- Exact reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/assessments`.
- Fixture: the existing fictional People demo branch and its separately designated Assessment planner. No grant or owner data was broadened for screenshots.

## Direct comparison

The previous route opened immediately into the scale, cycle and cohort form. The corrected route uses the approved module-landing hierarchy: an Assessments heading, real branch cycle work, one supported workflow entry and an access-boundary explanation. The sidebar and top bar now use the concise `Assessments` label. The verified planning form remains reachable through the explicit workflow action, and all owner commands, failure recovery, versions and receipts are unchanged.

The approved reference also shows an approval/publication workflow. That destination is intentionally absent from the Administrator landing because the implemented publication operation belongs to separately designated Principal authority. The page does not infer moderation or publication authority from school coordination. Prototype phase language, fictional counts and reviewer tools are likewise omitted.

Desktop and mobile screenshots were directly inspected. The final application has Inter loaded, zero root overflow, compact 72px-or-taller work rows, a responsive one-column mobile composition and a full-width mobile workflow action.

## Files

- `reference-desktop.png`, `reference-mobile.png`: approved explorer reference at 1440×1000 and 390×844.
- `application-before-desktop.png`, `application-before-mobile.png`: direct-to-form composition before correction.
- `application-after-desktop.png`, `application-after-mobile.png`: final module landing served from the standard build.
- `before-desktop.json`, `before-mobile.json`, `after-desktop.json`, `after-mobile.json`: viewport, DPR, computed font, overflow and heading observations.

## Verification

- `pnpm typecheck` — passed.
- `pnpm exec eslint app/admin/assessments/page.tsx test/e2e/principal-assessments.spec.ts` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/principal-assessments.spec.ts --project=chromium --project=mobile --workers=1 --grep 'administrator saves, recovers and freezes'` — 2/2 passed against `vyapti_vschool_test`; 118 migrations applied, none pending. The journey enters through the landing, preserves exact-key recovery after a lost response, reloads the persisted draft, freezes the cohort and verifies mobile navigation focus.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; standard build `JZi2cbc7qsZGc_ob70Zo8`.

One earlier command included a literal `--` before the file filter, which caused Playwright to begin the broad suite. It was stopped after two cases. The corrected wrapper syntax above ran only the two intended cases. A separate initial build attempt failed at the known 2 GiB heap ceiling; the documented 4 GiB configuration passed.

Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production release remain pending.
