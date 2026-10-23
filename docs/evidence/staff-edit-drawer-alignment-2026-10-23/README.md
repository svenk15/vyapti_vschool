# Staff edit-drawer alignment — 23 October 2026

Human visual acceptance remains **PENDING**.

## Scope and authority

- Application route: `/admin/teachers/{employeeId}`
- Frozen reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html#/profile/1`
- Baseline source: `dcca43bf0311519eae97b0c8e997c04e549aeece`
- Production build ID: `2mm4blVhnrEk9ll_MFHio`
- Demo: `http://127.0.0.1:3400`
- Viewports: 1440×1000 and 390×844 CSS pixels, DPR 1, browser zoom 100%

## Defect and correction

The Staff Profile section recipe used a descendant selector for its compact `Edit` action. Because the drawer dialog is mounted inside the section header before the browser promotes it to the top layer, that selector also reduced the drawer's Close, Save and X controls. The selector now targets only the direct section action. The shared drawer close control now uses the same 18px inline SVG X and 44px target as the approved drawer recipe.

Personal and Employment drawers now use the frozen reference's 470px desktop width, 94px desktop header, 44px close target, compact Inter typography, 40px desktop fields, 44px mobile fields/actions, 6px radii, thin semantic borders, body spacing and content-driven footer placement. The Employment reason remains visibly required.

Personal-detail persistence remains an explicit product-contract limitation: fields are read-only and the drawer offers Close instead of a fake Save. Employment category correction retains the implemented People owner command, authorization, optimistic version and exact-key recovery.

## Direct comparison

| State | Reference | Before | Current |
|---|---|---|---|
| Personal, desktop | [reference](reference-personal-desktop.png) | [before](before-personal-desktop.png) | [current](current-personal-desktop.png) |
| Personal, mobile | [reference](reference-personal-mobile.png) | [before](before-personal-mobile.png) | [current](current-personal-mobile.png) |
| Employment, desktop | Same frozen drawer recipe | [before](before-employment-desktop.png) | [current](current-employment-desktop.png) |
| Employment, mobile | Same frozen drawer recipe | [before](before-employment-mobile.png) | [current](current-employment-mobile.png) |

Measured current styles are recorded in `after-*.json`. At desktop the drawer is 470px wide; header 94px; close target 44×44px; fields 40px high with 13px type and 6px radius; actions 36px high with 13px/550 type. At mobile fields and actions are 44px high and the drawer produces no horizontal overflow.

## Verification

- `node /private/tmp/verify-staff-edit-drawers.mjs` — passed desktop and mobile interaction checks. It verified Escape closure and focus restoration, required Employment reason, disabled/enabled Save states, reference dimensions and no root overflow. [Machine-readable result](focused-verification.json).
- `pnpm exec eslint components/ui/interactive.tsx components/staff-personal-edit.tsx components/staff-employment-edit.tsx` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, build ID `2mm4blVhnrEk9ll_MFHio`.
- `git diff --check` — passed.
- Local health check returned `ready: true` for the demo on port 3400.

No backend command, authorization, schema, migration, permission or fixture changed. Native accessibility, TEN-03, production readiness and human visual acceptance remain pending.
