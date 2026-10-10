# EX-13 connected demo fixture evidence

Implementation source: `7c9c4cb`.

- `pnpm demo:seed` completed twice against the guarded local `vyapti_vschool` database. Both runs reused existing credentials and records and selected the same non-future walkthrough date with three assigned sessions. No database was reset and no existing command payload was changed.
- The seed verifies the selected session IDs through both the administrator school-day query and the assigned teacher's day query. At least one submitted session is also read through the teacher detail projection with its real pinned roster and attendance records.
- `node scripts/verify-demo-browser.mjs` passed against the production server at `http://127.0.0.1:3400` with the Phase 1 release manifest. It verified administrator dashboard, staff, Students, classes, scheduling and report routes; the report and teacher day contained the same three session IDs; teacher session detail returned 200. Safe results are in [browser-verification.json](browser-verification.json).
- [Administrator report](connected-admin-report.png) and [teacher day](connected-teacher-day.png) were inspected for data coherence, hierarchy, spacing, action placement and overflow.
- `pnpm check` passed all repository gates and 113/113 unit tests after the initial seed changes. After the final cross-role verifier was added, `pnpm lint`, `pnpm typecheck` and `pnpm build` passed.

The first sandboxed seed attempt could not connect to local PostgreSQL and is not a product pass or failure. A later seed run correctly rejected a changed replay payload while the new-calendar teaching exception was being developed; the implementation now preserves existing calendar command payloads and applies that exception only on first creation. The first browser run returned `RELEASE_UNAVAILABLE` for Students because the manually started server had an empty release manifest. Restarting it with `academic_core,attendance,staff_core,student_core` retained all authorization and entitlement checks and produced the passing evidence above.

No table, migration, owner authorization rule, transaction, lock or business DTO changed. Credentials remain only in ignored `artifacts/people-02/private-demo.json`; the selected date and session identifiers remain in ignored `artifacts/attendance-01/private-demo.json`. Human review remains PENDING. TEN-03, native VoiceOver/NVDA and production-provider/load evidence remain open release gates.
