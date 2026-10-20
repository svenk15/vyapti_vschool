# UXR-00/01A/01/02 pilot evidence — 20 October 2026

## Provenance and scope

- Approved review source: `docs/execution/UX_CONSTITUTION_REVIEW/`, reviewed against `eacfd88548adb896762f190462ac0224e6d3f939`.
- Implementation checkpoint: the focused commit containing this record.
- Final production build ID: `px4_AGxnlxyewduJf49hp`.
- Baseline reconstruction build ID: `zyx_1poQMhUAnd2SPsI_h`, built from exact source `eacfd88548adb896762f190462ac0224e6d3f939` in an isolated temporary directory.
- Demo: `http://127.0.0.1:3400/sign-in`, using fictional data and the ignored credential file `artifacts/people-02/private-demo.json`.
- No schema, migration, seed, permission or backend owner contract changed.

## Implemented outcomes

- UXR-00: the canonical Constitution and control contract live under `docs/ux`; the dated review package remains provenance.
- UXR-01A: shared primitives expose standard, compact-row, consequential and icon-only buttons; semantic field widths; short/long textareas; 40px desktop and 44px narrow/coarse controls. Four themes retain the same geometry.
- UXR-01: the Administrator catalogue now renders direct links under static Daily work, Teaching & communication, School operations and School settings labels. All previous routes and server visibility checks remain. Combined Staff and Attendance local navigation preserve the destinations removed from sidebar duplication.
- UXR-02: `/admin/students/register` is one editable page with Student details and School record. Exact existing-record selection is conditional, authoritative identity is read-only, confirmation is identity-bound, and unknown outcomes retain the exact payload/key for recovery. Enrollment and access remain separate.

## Visual comparison

All application captures use the same fictional branch and CSS viewports. The before images come from the exact baseline reconstruction; the after images come from final build `px4_AGxnlxyewduJf49hp`.

| Surface | Before | After |
|---|---|---|
| Administrator navigation, 1440×1000 | [baseline](before-administrator-navigation-desktop.png) | [static direct groups](administrator-navigation-desktop.png) |
| Administrator navigation, 390×844 | [baseline drawer](before-administrator-navigation-mobile.png) | [static-group drawer](administrator-navigation-mobile.png) |
| Student registration, 1440×1000 | [four-stage baseline](before-student-registration-desktop.png) | [one-page new record](student-registration-new-desktop.png) |
| Student registration, 390×844 | [four-stage baseline](before-student-registration-mobile.png) | [one-page new record](student-registration-new-mobile.png) |
| Existing-record mode | — | [desktop](student-registration-existing-desktop.png), [mobile](student-registration-existing-mobile.png) |
| Intermediate widths | — | [900px](student-registration-compact.png), [360px](student-registration-narrow.png) |

Direct inspection found no root overflow at 1440, 900, 390 or 360 CSS pixels. The static Administrator drawer scrolls independently; focused browser evidence confirms the final `Branding & appearance` link remains above the fixed account footer. The form is capped at 760px on desktop and fills the available narrow width. The final action measures 44px on all four widths; standard inputs/selects measure 40px on desktop and 44px on narrow viewports. [Final metrics](metrics.json), [responsive metrics](responsive-metrics.json), and [baseline metrics](before-metrics.json) record CSS viewport, DPR and computed values.

The four theme gallery captures use the same production controls: [Forest](controls-forest-desktop.png), [Amethyst](controls-amethyst-desktop.png), [Porcelain](controls-porcelain-desktop.png), and [Linen](controls-linen-desktop.png). Inter is loaded locally in every inspected workspace. [Five-workspace measurements](workspace-control-metrics.json) cover Administrator registration, Teacher readiness, Principal account, Parent concern and Student session management with no root overflow; available page controls use the shared desktop baseline.

## Verification

- `pnpm exec vitest run test/unit/workspace-navigation.test.ts --reporter=verbose`: 3/3 passed.
- `pnpm lint`, `pnpm typecheck`, `pnpm check:boundaries`, `pnpm check:backend`: passed.
- Focused Playwright/PostgreSQL batch for the gallery, Administrator navigation and Student registration: Chromium 9/11 passed initially; two selector-only regressions were corrected and passed 2/2 on rerun. Mobile passed 11/11. No product assertion was weakened.
- Final focused registration rerun: 1/1 passed, including authoritative existing-Person use, confirmation invalidation, duplicate handling and scoped persistence.
- Lost-response registration recovery passed in the focused batch and created one Student for the retained admission/key.
- Final focused Administrator navigation reruns: Chromium 1/1 and mobile 1/1 passed. They cover static groups, direct navigation, active state, disabled-module link omission, mobile focus return, independent nav scrolling and footer non-overlap.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed on the final source; build `px4_AGxnlxyewduJf49hp`.
- `/api/health` on the restored final demo returned `ready:true`.
- `git diff --check`: passed on the intended checkpoint files.

`pnpm check:docs` was run after the final documentation update. In the live worktree it remains blocked by two unrelated pre-existing links to absent `docs/evidence/workspace-presentation-route-pass-2026-10-20/README.md` in `docs/execution/WORKSPACE_PRESENTATION_REVAMP/{CURRENT_STATE,PAGE_COVERAGE}.md`; those dirty files were preserved and were not staged. A second check against an isolated archive of this commit reports two older Reporting links to ignored local `artifacts/reporting-{01,02}-local/query-plan.json` files. The UXR documentation introduced no broken link, but the repository-wide documentation gate is not reported as passing.

## Pending evidence and gates

- Native browser 200% zoom was not available in the headless Playwright environment. No device-scale or page-scale emulation is labelled as browser zoom.
- Native VoiceOver and Windows/NVDA remain pending.
- Human functional and visual acceptance are PENDING.
- TEN-03, production readiness and all existing release gates remain unchanged.
