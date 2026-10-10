# EX-12 design delta — attendance report and export

Date: 10 October 2026

- **Target:** `/admin/reports/attendance`, backed only by `reportingGateway.overview` and `reportingGateway.exportAttendance`.
- **Owners and DTOs:** Reporting owns the read projection and export evidence. The page consumes `AttendanceReportInput` / `AttendanceReport`; it does not aggregate DOM rows or write Attendance data.
- **Persistence:** overview reads scoped Attendance, Academics and Students projections in one `REPEATABLE READ` snapshot. Export reads the same authorized scope and records only `vs_reporting_export_run` metadata plus Platform audit in its existing guarded transaction. No schema or migration changes.
- **Authorization:** every overview and export call rechecks live account, organization, branch membership, release, entitlement, activation and the specific `attendance.read_school` or `attendance.export` capability. Browser filter IDs remain candidates and are resolved in the current scope.
- **Semantics:** `toDate` remains exclusive; ranges are at most 31 days. Expected, submitted, pending, future and cancelled sessions remain distinct. Missing records never become absences. The rate denominator excludes excused and pending records. `asOf` remains visible.
- **Interaction:** filters submit a server query and omit the old cursor. Pagination carries only validated filters and the opaque server cursor. CSV is fetched from the authorized endpoint, downloaded only after success, and reports an inline failure while retaining chosen filters.
- **Failure states:** invalid range, foreign filters, forbidden access and temporary failure retain the safe report shell and explain recovery. Empty and zero-denominator states remain explicit.
- **Verification:** Reporting CSV unit checks; focused real-PostgreSQL report/export tests; desktop/mobile Playwright for populated report, filters, invalid range, scoped CSV, teacher denial, keyboard order and overflow. Human visual review remains pending.

Resolved decisions: the current owner contracts already provide the required operations and data semantics; no backend operation or table is missing. Portable Reporting composition will receive the release manifest explicitly because EX-12 touches that factory.
