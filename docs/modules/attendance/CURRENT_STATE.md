# Session attendance and accountable corrections — current state

Last updated: 2026-10-05. No imported task completion or active execution timer. IAM-03 human acceptance is recorded separately in Access CURRENT_STATE for the exact reviewed source.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| ATT-01 | VERIFIED | PENDING | Source `5a9e528a65a6e96b63b8546d9eda590567483ea5`; local PostgreSQL, Playwright, checks, build and live demo evidence below |
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

Keep ATT-01 human review PENDING and its local demo available. Then select the next task by `pnpm next-task`; do not infer acceptance from automated evidence.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

## Evidence history

### ATT-01 implementation checkpoint — 5 October 2026

Intended demo: an administrator schedules Mathematics, its assigned synthetic teacher sees the session, and a second teacher sees no session. Focused implementation is in Attendance domain/application/infrastructure/composition, shared contracts and thin Next adapters/screens; it enlists Academics/People-owned facts through existing ports and transaction boundaries. A compatibility correction records `AttendanceSession.calendarRevision` in Prisma to match the existing scoped FK in the applied migration. Admin loading renders explicit unavailable state on authorization/service errors rather than disguising them as an empty offering list.

Source commit: `5a9e528a65a6e96b63b8546d9eda590567483ea5`; production build ID `1VGlc35egghmvzpO97gMP`; local frozen demo http://127.0.0.1:3423. Health returned 200/`alive:true`, sign-in rendered, and unauthenticated teacher API returned 401. Read-only authenticated Chromium smoke verified one admin offering choice, assigned teacher session visibility, and an empty day for the second teacher. E2E additionally exercised scheduling, detail and unauthorized-teacher isolation.

Verification passed: `pnpm check` (lint, typecheck, docs, 51 table contracts, boundaries, backend compilation, 86/86 unit tests); `pnpm test:functional test/functional/attendance-sessions.test.ts` against real PostgreSQL `vyapti_vschool_test` (2 tests, including serialization/race, replay, scope, permission recheck and rollback); `pnpm test:e2e test/e2e/attendance-sessions.spec.ts` (2/2 desktop/mobile journeys); `pnpm build`; `pnpm db:setup` (development `vyapti_vschool`, 24 migrations applied, no pending); functional setup found all 24 migrations applied in `vyapti_vschool_test`; `pnpm demo:seed` twice (repeat-safe). Final docs/database-design checks and `git diff --check` passed after the transfer-impact contract reconciliation. A lint-only unused-import warning seen in the full check was removed and the changed files were linted cleanly. No production database, real email, reset, or migration rewrite was used.

Demo credentials are generated/ignored and never printed: admin and assigned teacher in `artifacts/people-02/private-demo.json`; second/unassigned teacher and attendance command keys in `artifacts/attendance-01/private-demo.json` (mode 0600); invite tokens are confined to ignored `artifacts/mail-sink/`. Seed data is fictional and uses DevelopmentMailSink only.

Manual review (PENDING):

1. Open http://127.0.0.1:3423/sign-in with the administrator credentials in `artifacts/people-02/private-demo.json`; open `/admin/attendance/sessions`. Expect the synthetic Mathematics offering and school-local date/time context.
2. Schedule a future published teaching date at a free time. Expect “Session scheduled” and SCHEDULED state; a same-teacher overlapping time or duplicate occurrence should be rejected without a second session.
3. Sign in as the assigned synthetic teacher from the same private file and open `/teacher/today`. Expect today's seeded Mathematics session; open its details and expect the offering, section, time and SCHEDULED state without roster/marking controls.
4. Sign in as the second teacher using `artifacts/attendance-01/private-demo.json` and open `/teacher/today`. Expect “No sessions on this date”; opening the assigned teacher's detail URL must not disclose the session.

Human review: PENDING. No credentials or pupil PII belong in this document.
