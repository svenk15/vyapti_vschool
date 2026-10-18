# M04 — timetable to Attendance and oversight

Status: engineering verified for the must-have journey on 18 October 2026; human review pending.

## Supported journey

The current release keeps timetable publication immutable and Attendance as the sole owner of sessions, rosters, marks, corrections and history:

1. An authorized Administrator saves, previews and publishes the scoped timetable, then reconciles its stable occurrences through the Attendance application port.
2. Conflict-free occurrences create trusted source-linked sessions. A manual collision remains explicitly blocked for Administrator resolution and an unrelated successful occurrence is not recreated on retry.
3. The dated assigned Teacher opens the frozen roster, submits the exact complete register and recovers an unknown response with the original key.
4. Student and Parent views show only authorized factual submitted marks; an open/unsubmitted register is labelled awaiting submission and is never inferred as absence.
5. An authorized Administrator applies a versioned reasoned correction through Attendance, while Principal coverage reports received, due and awaiting registers without exposing pupil marks.

## Current-source verification

- Application source: `d6c9120`; programme checkpoint `7134780`; live build ID `jCObsKqoFwjNr2pibKzUn`.
- `pnpm test:functional test/functional/attendance-sessions.test.ts test/functional/timetable-reconciliation.test.ts` — **18/18 passed** against real `vyapti_vschool_test` PostgreSQL with 117 migrations applied and none pending.
- Covered behavior includes trusted occurrence identity, concurrent manual scheduling, mixed partial outcomes, cancellation/retry, exact replay conflict, frozen submitted sessions, roster freeze, complete submission, current assignment/permission checks, source-fresh Principal coverage, correction snapshot consistency, cancellation concurrency, branch isolation and revoked authority.
- The connected development fixture exposed seven Teacher sessions for 18 October 2026: one submitted and six outstanding. Principal coverage reconciled to seven non-cancelled, five due, one received, four awaiting and two not yet due. Parent and Student views showed submitted marks and explicitly labelled one open register as awaiting submission.
- The initial smoke attempt used `networkidle` and timed out on the timetable page; no product error was observed. The corrected harness waited for the rendered heading and completed all 12 role/viewport states.

## Current visual evidence

- [Timetable desktop](timetable-desktop.png) · [mobile](timetable-mobile.png)
- [Administrator Attendance desktop](admin-attendance-desktop.png) · [mobile](admin-attendance-mobile.png)
- [Teacher day desktop](teacher-today-desktop.png) · [mobile](teacher-today-mobile.png)
- [Principal coverage desktop](leadership-attendance-desktop.png) · [mobile](leadership-attendance-mobile.png)
- [Parent Attendance desktop](parent-attendance-desktop.png) · [mobile](parent-attendance-mobile.png)
- [Student Attendance desktop](student-attendance-desktop.png) · [mobile](student-attendance-mobile.png)

These current captures were inspected for hierarchy, action/state distinction, responsive card/table conversion, wrapping and overflow. Existing direct stage comparisons and mutation evidence remain in [TT-05](../admin-tt-05-2026-10-12/README.md), [Administrator Attendance](../admin-attendance-journey-2026-10-11/README.md), [EX-10](../ex-10/README.md), [EX-11](../ex-11/README.md) and [Principal Attendance](../principal-coordination-lea-09-11-15-2026-10-16/README.md).

## Remaining gates

Human review, font portability, native accessibility/actual browser zoom and TEN-03 remain pending. Protected narrative storage and all real-data/provider policies retain their existing gates. No production readiness is claimed.
