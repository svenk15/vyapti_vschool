# Session attendance and accountable corrections — current state

Last updated: 2026-10-05. No imported task completion or active execution timer. IAM-03 human acceptance is recorded separately in Access CURRENT_STATE for the exact reviewed source.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| ATT-01 | IN_PROGRESS | PENDING | Implementation and local verification below; final checkpoint commit/demo pending |
| ATT-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| ATT-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| ATT-04 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

**Design readiness (4 October 2026):** ATT-01 LLD/task align ownership, scoped session constraints/indexes, guarded schedule/calendar serialization, teacher-time clash rejection, current authorization, retry/failure behavior and Path A metadata. The dated snapshot then was ACA-03 IN_PROGRESS/NOT_REQUESTED; STU-02 NOT_STARTED. Current task table is authoritative. **Dependency snapshot (5 October 2026):** ACA-03 VERIFIED/PENDING; STU-02 VERIFIED/PENDING. Their implementation dependencies are satisfied; these tasks do not require human PASSED as an ATT-01 gate.

ATT-01 now schedules a school-local occurrence against an active offering, published teaching calendar and one date-effective eligible teacher; tenant/branch entitlement, activation and current resource permission are rechecked server-side. The assigned teacher can read the current day and session detail; another teacher receives an empty list and cannot open the foreign session. Calendar publication, year close and teacher-assignment end use Attendance-owned impact queries enlisted in their existing owner transactions. Student transfer impact is deferred to STU-03 because no current Student task changes an existing placement. Failure states include validation, scope/configuration conflict, duplicate/replay, overlap, missing calendar and unavailable service. The aggregate currently persists only SCHEDULED sessions; roster, submission, correction and cancellation tables/workflows remain planned.

Migration `20261005002000_attendance_sessions` is applied to the guarded development database and the dedicated functional test database. It adds `vs_attendance_session` with scoped Offering, CalendarRevision and School references, occurrence uniqueness, time/status/version checks and the school-day index. Both databases retain migration history; no reset or applied migration edit occurred. Path A classifies this as BRANCH-scoped with owner, policy intent and TEN-03 closure gate registered. Runtime RLS/restricted roles are not enabled; application authorization remains active on every protected read/write.

Seed fixture: `pnpm demo:seed` ran twice against the guarded local development DB. It retained existing records, enabled only synthetic attendance entitlement/branch state through Tenancy use cases, reused or linked the existing fictional staff records, provisioned the second fictional teacher through DevelopmentMailSink, and created one deterministic-key session for the current teaching date. The second run reused existing records and session. No real email was sent. Private fixtures are ignored: admin `artifacts/iam-01/private-demo.json`, assigned teacher `artifacts/people-02/private-demo.json`, second/unassigned teacher and attendance command keys `artifacts/attendance-01/private-demo.json` (0600); invitation tokens remain only under ignored `artifacts/mail-sink/`.

Pilot query evidence, 5 October 2026: read-only `EXPLAIN (ANALYZE, BUFFERS)` ran against the single synthetic offering/assignment and one current-day session. Active-offering/date assignment returned 1 row, 6 shared buffer hits and 1.952 ms execution; plan used `vs_academics_course_offering_section_subject_key` and `vs_academics_teacher_assignment_teacher_date_idx`. Teacher/date session join returned 1 row, 4 shared buffer hits and 0.406 ms; the tiny data set led PostgreSQL to choose `vs_attendance_session_occurrence_key` and `vs_academics_teacher_assignment_offering_date_idx`, not the day/teacher indexes. This is plan evidence only, not a meaningful latency benchmark or proof of the Bible pilot load target; populated pilot-scale benchmark remains outstanding. TEN-03's larger RLS profile is a separate gate.

## Next action

Finish ATT-01 checkpoint verification, commit, and run the production-mode local demo. Keep human review PENDING. Then select the next task by `pnpm next-task`; do not infer acceptance from automated evidence.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

## Evidence history

### ATT-01 implementation checkpoint — 5 October 2026

Intended demo: an administrator schedules today's Mathematics occurrence, its assigned synthetic teacher sees it, and a second teacher sees no session. Source commit and production snapshot are pending final verification. Focused implementation is in Attendance domain/application/infrastructure/composition, shared contracts and thin Next adapters/screens; it enlists Academics/People-owned facts through existing ports and transaction boundaries. A compatibility correction records `AttendanceSession.calendarRevision` in Prisma to match the existing scoped FK in the applied migration. Admin loading renders explicit unavailable state on authorization/service errors rather than disguising them as an empty offering list.

Focused verification already passed: `pnpm test:functional test/functional/attendance-sessions.test.ts` against real PostgreSQL `vyapti_vschool_test` (2 tests, including serialization/race, replay, scope, permission recheck and rollback); `pnpm test:e2e test/e2e/attendance-sessions.spec.ts` (2/2 desktop/mobile journeys); `pnpm demo:seed` twice (repeat-safe). `pnpm check:backend`, `pnpm check:boundaries`, and `pnpm check:db-design` passed before the Prisma relation/doc reconciliation. Final checkpoint runs of `pnpm check`, focused functional/E2E and `pnpm build` are still required and must be recorded after execution.

Human review: PENDING. Once final checks pass, record the focused source commit, build ID, live URL and the manual steps in this file. No credentials or pupil PII belong in this document.
