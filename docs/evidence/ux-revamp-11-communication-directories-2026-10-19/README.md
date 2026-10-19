# UX-11 Communication directory evidence

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Source under test: the focused commit containing this record, based on `6975b93`.
- Final standard build ID: `KfEHZ2Q-IEshnfRIY_7Dk`.
- Demo: `http://127.0.0.1:3400`.
- Development/test schemas: unchanged; the focused browser harness reported all 118 forward migrations applied to `vyapti_vschool_test`.
- Exact Administrator reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/communication`.
- Parent reference: `VSchool_Parent_Guardian_Review.html#/flow/PAR-14`; it specifies the detail/acknowledgement journey, not a production directory.
- Student reference: `VSchool_Student_Review.html#/flow/STW-27`; it specifies the detail/read journey, not a production directory.

## What changed

- Administrator Communication now has the approved view hierarchy, one primary Create notice action, a compact summary sourced only from current publication/proposal rows, and semantic publication/proposal tables.
- Title/revision, audience/recipient count, status/read count and acknowledgement remain distinct cells. Mobile rows preserve every value and put the guarded action after the record facts.
- Parent and Student Messages now use one bounded directory surface with compact rows, explicit status badges and the existing recipient-owned action.
- Existing author/reviewer/publisher separation, frozen audience, exact purpose checks, read/acknowledgement evidence, withdrawal behavior and routes are unchanged.

The approved reference shows a scheduled count and search/filter/sort controls. The current owner query exposes neither scheduled notices nor validated server query fields. They remain explicit owner-capability gaps; this slice does not fabricate a count or sort one loaded page in the browser. Parent and Student list pages are shared-recipe design extensions pending human review.

## Direct inspection

| State | Before | Final/reference |
|---|---|---|
| Administrator desktop | `before-admin-desktop.png` | `after-admin-desktop.png`; `reference-admin-desktop.png` |
| Administrator intermediate/mobile | `before-admin-mobile.png` | `after-admin-1024.png`, `after-admin-768.png`, `after-admin-mobile.png` |
| Parent desktop/mobile | `before-parent-desktop.png`, `before-parent-mobile.png` | `after-parent-desktop.png`, `after-parent-mobile.png`; PAR-14 pattern in `reference-parent-desktop.png` |
| Student desktop/mobile | `before-student-desktop.png`, `before-student-mobile.png` | `after-student-desktop.png`, `after-student-mobile.png`; STW-27 pattern in `reference-student-desktop.png` |

`before-metrics.json` and `after-metrics.json` record route, CSS viewport, DPR, computed font, root overflow and composition counts. Final application states use CSS viewports 1440×1000, 1024×900, 768×900 and 390×844, DPR 1, computed Inter and zero root overflow. Direct image inspection found and corrected a filled Create-notice SVG, mobile actions appearing before their record title and a status badge wrapping at intermediate widths. The final captures show the corrected icon, full-width terminal mobile actions and one-line status pills.

## Verification

- `pnpm typecheck` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 VSCHOOL_E2E_BUILT=1 pnpm test:e2e communication-notices.spec.ts --project=chromium --workers=1` — 4/4 passed.
- `NODE_OPTIONS=--max-old-space-size=4096 VSCHOOL_E2E_BUILT=1 pnpm test:e2e communication-notices.spec.ts --project=mobile --workers=1` — 4/4 passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed after final visual corrections; build ID `KfEHZ2Q-IEshnfRIY_7Dk`.

The first focused E2E launch used the default 2 GiB heap and exhausted memory before assertions. A later command included a literal `--`; Playwright treated it as unfiltered, and the run was stopped after one unrelated test passed. Neither attempt is claimed as Communication evidence. The final filtered desktop/mobile commands above are the recorded results.

Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 restricted-role/RLS proof and production readiness remain pending.
