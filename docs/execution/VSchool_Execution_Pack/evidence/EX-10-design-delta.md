# EX-10 design delta

Date: 2026-10-10

- **Reference and routes:** approved administrator attendance list/detail compositions at `/admin/attendance/sessions` and `/admin/attendance/sessions/[id]`.
- **Use cases:** schedule one dated offering occurrence, inspect the current school day, review a session, cancel a scheduled/open session, correct a submitted register with a reason, inspect immutable revision history, and cancel a submitted session while retaining records.
- **Existing seams:** `attendanceGateway` keeps `authorizeAdmin`, `schoolDay`, `detail`, `history`, `cancel` and `correct`; `academicsGateway.offerings` supplies date-assigned offering options. API handlers and portable Attendance application/domain code are unchanged.
- **Reads and writes:** the list reads scoped sessions for the school-local date. Detail reads the scoped session and its frozen roster/records/history. Schedule writes AttendanceSession and evidence; correction appends an immutable revision while updating current records; cancellation appends its revision and retains roster/records. Existing account → Organization → School → session lock order, versions and command receipts remain authoritative.
- **Authorization:** every route and command retains current account/membership, release, entitlement, activation and resource permission checks. School administrators may inspect; correction requires `attendance.correct`; scheduling/cancellation follows the existing current-state capability policy. Teachers cannot gain correction or school-wide history through the new composition.
- **Presentation change:** use the shared page stack, page/section header, constrained settings form, session rows, record summary and explicit destructive-action panel. Distinguish SCHEDULED, OPEN, SUBMITTED and CANCELLED without interpreting a missing record as absence. Retain the same named actions used by current browser contracts.
- **Focused verification:** current Attendance domain/unit coverage; real PostgreSQL schedule/open/submit/correct/cancel, replay, concurrency and authorization suite; desktop/mobile Playwright administrator/teacher separation with screenshots and overflow inspection.
- **Migration and seed impact:** none expected. Existing connected attendance fixtures are reused and `pnpm demo:seed` must preserve them.

No unresolved owner contract blocks this presentation-alignment slice. Recurring timetable generation, TEN-03, native accessibility and production-scale/provider evidence remain separate gates.
