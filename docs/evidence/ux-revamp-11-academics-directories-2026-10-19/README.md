# UX-11 Academics directory evidence

Date: 19 October 2026 (Asia/Kolkata)

- Base commit: `63e5648`.
- Executable source: the focused commit containing this record.
- Production build ID: `vB1WtwfViRfHypKYWA3ye`.
- Demo: `http://127.0.0.1:3400/admin/academics`.
- Database: `vyapti_vschool_test`, all 118 migrations applied; no migration or schema changed in this slice.

## Reference and scope

The exact directory reference is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/academics`. SA-09, SA-10 and SA-11 are separate approved staged-workflow references. This slice corrects the Academics landing composition while preserving the existing guarded setup and offering operations.

The landing now presents the approved hierarchy: concise heading and primary Academic year action, real academic-year/class/subject summaries, management shortcuts and a responsive semantic class directory. The directory uses the owner data that actually exists. Its **Placements** value is the documented current-or-future placement dependency count; it is not relabelled as a current-enrolment total. Readiness means the section is active, its year is open and at least one active offering exists.

The approved prototype includes class search, Filters and Sort. The current Academics list contract exposes a bounded workspace snapshot without server search, filter, sort or cursor inputs. Those controls remain an explicit owner-query gap; no loaded-page filtering or sorting was added. The existing `/admin/classes` composition retains its verified operations and is recorded for the staged-form recipe rather than being claimed as an exact SA-11 match.

## Captures

- Exact reference: `reference-academics-desktop.png`.
- Before: `before-academics-desktop.png`, `before-academics-mobile.png`, `before-classes-desktop.png`, `before-classes-mobile.png`.
- Corrected: `after-academics-desktop.png`, `after-academics-mobile.png`, `after-classes-desktop.png`, `after-classes-mobile.png`.
- Related staged references: `reference-sa09-desktop.png`, `reference-sa10-desktop.png`, `reference-sa11-desktop.png`.
- Measurements: `before-metrics.json`, `after-metrics.json`.

The corrected application and exact reference were inspected directly at 1440×1000. The application was also inspected at 390×844. Inter computed in both application viewports, root overflow was zero, the desktop table becomes labelled cards on mobile and existing controls remain reachable.

## Verification

- `pnpm typecheck` — passed.
- `pnpm exec eslint components/academics-workspace.tsx --no-warn-ignored` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build ID `vB1WtwfViRfHypKYWA3ye`.
- `NODE_OPTIONS=--max-old-space-size=4096 VSCHOOL_E2E_BUILT=1 pnpm test:e2e academics-setup.spec.ts academics-offerings.spec.ts --project=chromium --workers=1` — 3/3 passed.
- Same focused command with `--project=mobile` — 3/3 passed.

Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 and production release remain pending.
