# UX-11 Imports directory evidence

Date: 19 October 2026 (Asia/Kolkata)

- Base commit: `5b740ab`.
- Executable source: the focused commit containing this record.
- Production build ID: `OS-vqeRyk5VWWsKzuHjmj`.
- Demo: `http://127.0.0.1:3400/admin/imports`.
- Database: `vyapti_vschool_test`, all 118 migrations applied; no schema or migration changed.

## Reference and implementation

The exact reference is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/imports`. Before this slice the sidebar destination opened directly into SA-23's preview wizard. The default route now renders the approved directory hierarchy from the existing server-authorized signed-cursor query. **Import roster** opens that unchanged four-stage flow at `/admin/imports?new=1`; Manage opens the existing guarded reconciliation workflow.

Rows expose only the fields in the owner list DTO: immutable import reference, created time, row count and durable state. The approved prototype's Academic year, search, Filters and Sort are omitted because the list contract does not expose year metadata or server query/order inputs. No loaded-page search/sort or guessed year was added.

## Evidence

- Exact reference: `reference-desktop.png`.
- Before: `before-desktop.png`, `before-mobile.png`.
- Corrected: `after-desktop.png`, `after-mobile.png`.
- Measurements: `before-metrics.json`, `after-metrics.json`.

The corrected reference/application desktop captures were inspected directly at 1440×1000; the application was also inspected at 390×844. Inter computed in both application viewports, root overflow was zero and the table became labelled mobile cards.

## Verification

- `pnpm typecheck` — passed.
- Focused ESLint for the changed page, reconciliation link and journey — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build ID `OS-vqeRyk5VWWsKzuHjmj`.
- `NODE_OPTIONS=--max-old-space-size=4096 VSCHOOL_E2E_BUILT=1 pnpm test:e2e import-preview.spec.ts --project=chromium --workers=1` — 4/4 passed.
- Same focused command with `--project=mobile` — 4/4 passed.

These browser journeys exercise preview non-writes, guarded reconciliation, lost-response recovery, exact retry behavior, bounded processing, cancellation and the safe report. Human visual acceptance, native accessibility, actual-browser 200% zoom, TEN-03 and production release remain pending.
