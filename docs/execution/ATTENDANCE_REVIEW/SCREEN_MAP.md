# Attendance screen map

## Current production screens

| Screen/state | Route | Primary component | Reference | Current evidence |
|---|---|---|---|---|
| Registers, populated/empty | `/admin/attendance/sessions?view=monitor&date=…&section=…` | `AttendanceAdminList` | SA-26 workflow fields; production directory is a reference extension | `registers-*.png` |
| Schedule entry/review/confirm | `/admin/attendance/sessions` | `AttendanceScheduler` | SA-25 | `schedule-session-*.png` (entry); later stages in historical lifecycle evidence |
| Scheduled/open detail and cancellation | `/admin/attendance/sessions/[id]` | `AttendanceCancel` | SA-28 | `scheduled-register-*.png`; cancelled/history state historical |
| Submitted correction and history | `/admin/attendance/sessions/[id]` | `AttendanceCorrections` | SA-27 | `submitted-register-*.png`; staged/recovery evidence historical |
| Explanation queue | `/admin/attendance/explanations` | `ServerTable` | SA-29 queue is a production extension | `explanations-queue-*.png` |
| Explanation review | `/admin/attendance/explanations/[id]` | `AttendanceExplanationReview` | SA-29 | `explanation-review-*.png` |
| Correction-request queue | `/admin/attendance/correction-requests` | `ServerTable` | Principal LEA-14 counterpart; reference-less Administrator queue extension | `corrections-queue-*.png` (empty) |
| Correction-request review | `/admin/attendance/correction-requests/[id]` | `AttendanceCorrectionReview` | LEA-14 counterpart; shared production pattern | historical `principal-lea-14-correction-request` evidence |
| Session completeness report | `/admin/reports/attendance` | `AttendanceReportExport` plus server table | SA-30 | `report-entry-*.png`, `report-results-*.png` |
| Today coverage | `/admin` | landing summary/attention/sessions | Administrator Today composition | `today-attendance-desktop.png` |
| Mobile navigation | any Administrator route | `PortalShell` / navigation groups | shared shell contract | `attendance-mobile-navigation-mobile.png` |
| Timetable conflict | `/admin/timetable` contextual reconciliation | `TimetableDraftEditor`/reconciliation UI | TT-05 extension | historical `admin-tt-05` evidence |
| Assigned missing-register follow-up | `/admin/coordination/[id]` when granted | `CoordinationView` | Principal/Coordination workflow, not SA-25–30 | historical Coordination evidence |

All `screenshots/*.png` in this review were captured from build `cnQyWg2vSFtsSsCosagkd`, except where this table explicitly cites a historical evidence directory.

## Current state coverage

| State | Current-source capture | Contract/evidence status |
|---|---|---|
| Populated | Yes: Registers, explanation queue/detail, report | Observed |
| Empty | Yes: correction-request queue | Observed |
| Loading | No | Shared/route behavior inspected; no captured slow state |
| Invalid filters | No | Server validation implemented; focused historical tests apply |
| Denied/revoked | No current screenshot | Server guards and focused negative evidence apply |
| Stale | No current screenshot | Correction/explanation/report contracts and historical evidence apply |
| Unknown write result | No current screenshot | Exact-key flows implemented and historically verified |
| Confirmed write, failed refresh | No current screenshot | Required shared recovery distinction; inspect per component before redesign |
| Cancelled session | No current fixture | Historical lifecycle evidence only |
| Timetable manual conflict | No current fixture | Historical TT-05 evidence only |

## Proposed production composition

One Attendance landing page:

1. **Heading and scope** — branch-local date, authorized branch context, primary “Schedule session” only when `class.manage` is currently available.
2. **Coverage strip** — submitted/expected, awaiting, future and cancelled; every count names its period and denominator.
3. **Needs attention** — missing registers, assigned explanations, routed correction requests, and linked timetable conflicts only when the corresponding owner projection and grant exist.
4. **Today’s registers** — compact session table/cards with `Open register` actions.
5. **Local views** — Today, Registers, Requests, Reports.

Detail composition remains state driven:

- Scheduled/Open: session facts, roster state, permitted cancellation.
- Submitted: immutable register, effective records, contextual correction, history.
- Cancelled: retained history/read-only facts.
- Explanation request: family evidence, disposition/clarification, no mark mutation.
- Correction request: exact source revision, assigned review, Attendance receipt.

This map intentionally avoids a new destination for each backend command and avoids durable drafts or new lifecycle rules.

