# EX-09 design delta

Date: 2026-10-10

- **Reference and route:** approved School Administrator roster-import composition at `/admin/imports`.
- **Use cases:** upload and preview a bounded CSV, review exact row decisions, explicitly skip invalid rows, confirm once, process a bounded batch, restore or resume durable progress, cancel remaining rows, and download the safe error report.
- **Existing seams:** `importsGateway` and the portable Imports facade retain `authorize`, `options`, `preview`, `rows`, `confirm`, `process`, `status`, `cancel`, and `errorsCsv`. Processing continues through the enlisted Students owner port inside the Imports row transaction.
- **Reads and writes:** no schema change. Imports owns ImportJob/ImportRow/SourceStudentMap; People and Students remain owner-controlled through enlisted commands. Preview writes no Person, Student, Enrollment, or Placement. Confirm pins approved rows; processing commits each row and its evidence atomically.
- **Authorization and recovery:** every route retains current account, membership, institution/branch, `student.manage`, release, entitlement and activation checks. A stored opaque job ID may request restoration, but the server reauthorizes its scope. The 2 MiB CSV, 8 KiB metadata, and 16 KiB multipart-framing budgets remain distinct. Same-job durable status drives resume; no new job or display-only success is created after an unknown response.
- **Presentation change:** apply the shared page stack, stepper, section header, settings form, summary and directory-table recipes. Separate file/context selection, row review/confirmation, and bounded processing/recovery into three visible stages with exact counts and clear unavailable/empty/error states.
- **Focused verification:** existing Imports unit parsing checks; real PostgreSQL preview/confirm/process/replay/cancel/retention/cross-scope cases; desktop/mobile Playwright mixed-validity and bounded-cancellation journeys; screenshot and overflow inspection.
- **Migration and seed impact:** none expected. Existing ignored fictional CSV fixtures already cover mixed validity and multi-batch cancellation; rerun `pnpm demo:seed` to prove preservation.

No unresolved product or security decision blocks this presentation-alignment slice. Distributed production rate limiting, TEN-03 and real-data retention/provider policy remain release gates.
