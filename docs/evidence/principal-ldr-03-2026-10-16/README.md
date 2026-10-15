# LDR-03 Principal exact Attendance source evidence

Date: 16 October 2026. Engineering verification is complete; human review is PENDING.

## Contract and implementation

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, scenario stage 2, “Inspect the evidence”. The application route is `/leadership/attendance/sessions/:id?date=YYYY-MM-DD` from the bounded coverage list.

Attendance reauthorizes one exact scoped session and returns class, subject, schedule, current dated expected Teacher, lifecycle state/version, server observation time and trustworthy owner update time. Reload re-reads the source, so a newly submitted register is shown as received/no longer awaiting. The projection contains no roster, pupil mark, explanation, correction history, actor, export or mutation control.

Forward migration `20261016130000_attendance_session_state_update` is applied to development and test. Both retain 64 migrations. It adds nullable `state_updated_at`, backfills lifecycle timestamps and trustworthy schedule-command evidence, and leaves unknown legacy schedules null. Schedule/open/submit/correct/cancel and Timetable reconciliation/cancellation set it in their existing transaction. No database was reset and no index was added.

## Verification

- Focused lint and `tsc --noEmit`: passed.
- `pnpm check:db-design`: 96 registered table contracts passed.
- `pnpm check`: passed lint, generated route/types, documentation, 96 database contracts, extraction boundaries, portable-backend compilation and 164/164 unit tests.
- Focused real PostgreSQL `test/functional/attendance-sessions.test.ts`: 12/12 passed. It covers fresh SCHEDULED→SUBMITTED evidence, exact counts, source-field exclusion, cross-scope/role/revocation/module denial and timestamp writes.
- Normal `pnpm build`: passed. Isolated `VSCHOOL_E2E=1 pnpm build`: passed.
- Principal Playwright, one worker and projects run sequentially: Chromium 2/2 and mobile 2/2 passed. It covers keyboard entry, route/date context, current-state reload, populated/no-due states and the approved stage.
- One first Chromium run used the older `.next-e2e` bundle after only the normal `.next` build and failed because the Action link was absent. The isolated build was then refreshed; no assertion or timeout was weakened. Both projects passed against the corrected current source.

An attempted focused functional command through the repository wrapper unexpectedly selected the full suite; it was stopped after three unrelated files. The verified direct focused Vitest command then passed 12/12. This interrupted run is not reported as passing evidence.

## Direct visual inspection

- Desktop: [approved stage](reference-evidence-chromium.png), [awaiting application](application-awaiting-chromium.png), [fresh received application](application-received-chromium.png), [coverage list](application-populated-chromium.png), [no-due state](application-no-due-chromium.png).
- Mobile: [approved stage](reference-evidence-mobile.png), [awaiting application](application-awaiting-mobile.png), [fresh received application](application-received-mobile.png), [coverage list](application-populated-mobile.png), [no-due state](application-no-due-mobile.png).

The approved HTML presents a fictional workflow-review dialog. The application uses the real Principal shell and a dedicated read-only page. Direct inspection confirmed the same evidence hierarchy, source fields, state feedback, action/return path, information boundary and responsive composition. Prototype review controls and fictional counts are absent. Exact font portability and native VoiceOver/NVDA remain pending.

## Remaining gap

LEA-08 is still PARTIAL: approved class/status/teacher filtering and stable due/class sorting are not implemented. Human acceptance, TEN-03 and production gates remain pending.
