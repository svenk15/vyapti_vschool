# LEA-08 Principal coverage controls evidence

Status: engineering verified; direct visual comparison complete with documented composition deviation; human review pending.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, scenario **First release · Attendance oversight**, together with `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/COMPONENTS.md`. The application route is `/leadership/attendance?date=YYYY-MM-DD`.

The page now filters the complete authorized awaiting-register result by exact class, `SCHEDULED|OPEN` state and unambiguous dated responsible Teacher. It sorts server-side by due time or class, ascending or descending, with stable ID tie-breakers. The opaque cursor binds every filter and sort field. URL state supports Back/Forward; inspecting source and returning preserves the normalized query. No pupil identity search, roster, mark, explanation, correction, export or mutation authority was added.

## Verification

- Focused ESLint and `tsc --noEmit`: passed.
- Real PostgreSQL `test/functional/attendance-sessions.test.ts`: 12/12 passed against `vyapti_vschool_test`; 64 migrations applied and none pending. It covers exact filter results, scoped option values, both orders, bounded continuation, cursor/query mismatch rejection, existing role/scope/revocation/module denial and sensitive-field exclusion.
- Production E2E build: passed.
- Focused Playwright with one worker, sequentially: Chromium 2/2; mobile 2/2. It covers drawer Cancel/Escape and focus return, Apply, URL Back/Forward, filtered rows, sort state, query-preserving detail return, live refresh and the genuine no-due state.
- `pnpm check`: passed lint, generated route types and TypeScript, documentation, 96 database contracts, backend boundaries/portable compilation and 164/164 unit tests.
- The first final PostgreSQL file rerun reported `STALE_VERSION` only in the unchanged ATT-02 enrollment/open concurrency fixture after the LEA-08 test had passed. One justified rerun passed all 12; no transaction or assertion was weakened.

## Visual inspection

The approved screen is a fictional workflow-review dialog; the application is the production Principal shell with real scoped data. They share the three-metric hierarchy, due/received/awaiting meaning, explicit non-absence message and evidence progression. Shared drawer rules provide expanded filter/sort attributes, draft Apply/Cancel behavior and compact triggers. Direct inspection found a global mobile dialog rule reversing the drawer footer; the shared drawers now keep Cancel then Apply at both viewports.

- Desktop: [reference](reference-coverage-chromium.png), [populated](application-populated-chromium.png), [filter drawer](application-filter-drawer-chromium.png), [filtered](application-filtered-chromium.png), [sort drawer](application-sort-drawer-chromium.png), [sorted](application-sorted-chromium.png), [no due](application-no-due-chromium.png).
- Mobile: [reference](reference-coverage-mobile.png), [populated](application-populated-mobile.png), [filter drawer](application-filter-drawer-mobile.png), [filtered](application-filtered-mobile.png), [sort drawer](application-sort-drawer-mobile.png), [sorted](application-sorted-mobile.png), [no due](application-no-due-mobile.png).

The intentional reference/application composition difference, exact font portability, native VoiceOver/NVDA, TEN-03 and production controls remain pending. No schema or migration was added by this slice. Credentials stay only in ignored mode-0600 `artifacts/leadership-01/private-demo.json`.
