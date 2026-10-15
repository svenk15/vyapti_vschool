# Principal leadership tasks

## LDR-01 — explicit Principal branch workspace

Dependencies: current Access/Tenancy/session/context foundations and shared portal shell.

Acceptance criteria:

1. A verified operator can add an exact branch `PRINCIPAL` grant with existing version, replay, audit, and transaction rules.
2. School administrators, teachers, parents, and students do not acquire Principal authority; school staff management cannot create or alter a Principal grant.
3. Sign-in and workspace choice expose only live server-returned role/branch combinations.
4. `/leadership` independently reauthorizes the Principal grant and denies forged, foreign, suspended, and revoked scope.
5. The shell shows institution, branch, Principal role, mobile navigation, account controls, and honest unavailable owner states without fabricated metrics.
6. Development and test databases retain all earlier migrations and accept the forward role-constraint migration.
7. Unit, real PostgreSQL, desktop/mobile Playwright, build, boundary, and database-design gates pass for the verified source.

Human visual/product acceptance is recorded separately.

## Next slices

- LDR-02: bounded due-register coverage projection for LEA-05/06/08.
- LDR-03: exact session evidence and freshness.
- LDR-04–06: accountable follow-up lifecycle after Coordination owner design.
- LDR-07: scoped history/export only with a separately established export grant.

## LDR-02 — Attendance due-register coverage

Dependencies: verified LDR-01, current Attendance sessions/dated assignments, and released/licensed/activated Attendance with its existing dependencies.

Acceptance criteria:

1. `attendance.read_leadership` is granted only by the explicit Principal role and is narrower than administrator school-wide Attendance read.
2. A current branch/date query returns one `REPEATABLE READ` snapshot with server as-of, timezone, `register-coverage.v1`, and `SESSION_END_NO_GRACE` disclosed.
3. Counts satisfy `received + awaiting = due`; cancelled and not-due sessions remain separate, early submission remains not due, and no missing register becomes pupil absence.
4. The exact awaiting list contains bounded pages with class, subject, scheduled time, due time, current dated expected teacher and status only. Class/status/Teacher filters apply to the full scoped result before pagination; due/class sort uses a stable ID tie-breaker and a query-bound cursor.
5. Foreign branch/institution, revoked Principal, future date, disabled/unlicensed/unreleased module and other roles fail without counts or sensitive detail.
6. Home and Attendance oversight show populated, no-due, unavailable and mobile states through the shared Principal shell; there are no dead LDR-03 actions.
7. Focused unit, real PostgreSQL, desktop/mobile Playwright, plan, build and required repository gates pass. URL-backed filters/sort preserve Back/Forward state and shared drawers preserve draft/Cancel/Apply/focus behavior; direct reference comparison and human review remain separately recorded.

## LDR-03 — Exact Attendance session evidence and freshness

Dependencies: verified LDR-02 and the current Attendance session owner.

Acceptance criteria:

1. A Principal can open one exact awaiting row and see current scheduled context, expected teacher, lifecycle state/version, last trustworthy source update when available, and server observation time only.
2. Every open/reload reauthorizes and re-reads current Attendance state; a newly submitted row displays received/no longer awaiting without exposing roster, marks, explanations, correction history or actors.
3. Foreign scope, revoked Principal, disabled/unlicensed/unreleased Attendance and other roles fail without source detail.
4. Attendance lifecycle writes maintain source freshness in their existing transaction; the forward migration preserves history, backfills only trustworthy evidence and leaves unknown legacy schedule freshness null.
5. The detail preserves a date-qualified return path, mobile composition and keyboard focus, and is directly compared with the approved “Inspect the evidence” state.
6. Focused real PostgreSQL, desktop/mobile Playwright, schema/design checks, build and required repository gates pass. LEA-08 filters/sort, human review, font portability, native accessibility and TEN-03 remain separate.
