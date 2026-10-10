# EX-12 attendance report and export evidence

Implementation source: `a3664df`.

- `pnpm check` passed on the implementation source: lint, generated route types, TypeScript, documentation, 51-table database design, boundaries, portable-backend compilation and 113/113 unit tests.
- The focused real-PostgreSQL Attendance/Reporting suite passed 9/9 with all 31 test migrations current. It covers the repeatable-read snapshot, denominator semantics, scoped filters, authorization, safe export metadata, formula-safe CSV, permission recheck, rollback and query-plan evidence.
- Final desktop/mobile Playwright passed 2/2 and built the production application. It verifies the populated report, explicit `asOf`, filters, status/count semantics, keyboard focus, scoped CSV download, retained filters after export denial, invalid-range recovery, teacher export denial and no document overflow.
- [Desktop report](attendance-report-chromium.png) and [mobile report](attendance-report-mobile.png) were visually inspected. The first passing capture exposed a clipped desktop filter action; the final capture shows the corrected three-column composition. The mobile table intentionally scrolls horizontally so numeric and action columns remain semantic table columns.
- The first and two later browser attempts stopped before tests when Prisma's schema engine intermittently failed to initialize the guarded test database. Two intermediate test runs then exposed locator/focus-test assumptions. These runs are failures, not passing evidence; the final unchanged harness run is the 2/2 result above.

The report continues to use the Reporting owner's server totals, scoped joins and authorized export rather than calculating from displayed rows. The portable Reporting factory now receives its released-module configuration from the Next hosting layer and no longer reads ambient environment state.

No table, migration, report DTO, authorization rule, transaction, export limit or seed changed. Human visual review remains PENDING. Trend comparison/follow-up, TEN-03 enforcement, native VoiceOver/NVDA and native 200% zoom remain outside this checkpoint.
