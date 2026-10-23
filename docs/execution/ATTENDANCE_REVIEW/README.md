# Administrator Attendance review

This is a read-only product, UX and implementation review of the Administrator Attendance experience. It records the application as observed; it does not approve or implement the proposed simplifications.

## Candidate provenance

- Branch: `work/stu-01-after-per02-wip`
- Application source: `fd75dc52c38c694bd40e7c2724151b54103aa27a`
- Served build ID: `cnQyWg2vSFtsSsCosagkd`
- Demo: `http://127.0.0.1:3400`
- Capture time: 23 October 2026, 12:53 IST (`2026-10-23T07:23:43.314Z`)
- Synthetic school date used for Attendance captures: `2026-10-22`
- Viewports: 1440×1000 and 390×844 CSS pixels, device scale factor 1, browser zoom 100%.
- Capture tool: repository Playwright/Chromium. The in-app Browser could not start because its installed client and service versions differ; this did not prevent source inspection or repository Playwright capture.

The build predates the HEAD commit by about two minutes. The HEAD commit changes Staff Profile presentation only; the inspected Attendance application files are unchanged between the build and HEAD. The current captures therefore represent the packaged Attendance source. The working tree also contains unrelated pre-existing evidence changes; they are not part of this review.

## Authority and scope

Product and UX sources:

- [UX Constitution](../../ux/UX_CONSTITUTION.md)
- [Control sizing contract](../../ux/CONTROL_SIZING_CONTRACT.md)
- [Attendance owner design](../../modules/attendance/DESIGN.md), [tasks](../../modules/attendance/TASKS.md), and [current state](../../modules/attendance/CURRENT_STATE.md)
- Approved Administrator workflows SA-25 through SA-30 in `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/`
- Approved workflow explorer: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`

The approved HTML is a workflow explorer. Its field order, labels and interaction contract are authoritative where specified; it is not by itself a complete production page composition. Current owner records, permissions and state transitions remain authoritative.

## Review contents

- [Workflow audit](WORKFLOW_AUDIT.md)
- [Current and proposed navigation](NAVIGATION_MAP.md)
- [Friction log](FRICTION_LOG.md)
- [Current and proposed screen map](SCREEN_MAP.md)
- [Current-source screenshot observations](screenshots/observations.json)

## Main conclusion

The implemented foundation is substantial: scoped session monitoring, manual scheduling, read-only roster inspection, guarded cancellation, immutable submitted-register correction, Parent explanation review, routed correction requests and a bounded session-completeness report/export are present. The largest product-navigation issue is fragmentation. Four local Attendance destinations plus contextual session actions and separate Coordination/Timetable surfaces expose owner structure rather than the Administrator's daily task flow.

The proposed release hierarchy uses one task-focused Attendance landing page with four views: **Today**, **Registers**, **Requests**, and **Reports**. Scheduling, correction, cancellation, explanation review and conflict resolution remain contextual actions. This proposal does not merge owner commands or permissions.

## Must-have release scope

1. Today coverage by branch-local date: due, submitted, awaiting, future and cancelled remain distinct.
2. Register directory and detail: date/class filtering, status clarity, frozen roster/current marks, safe return to prior context.
3. Manual scheduling and supported cancellation through Attendance guards.
4. Submitted-register correction with mandatory reason, optimistic versioning, immutable history and exact-key unknown recovery.
5. Assigned Parent explanation and correction-request queues, visibly separate from mark correction.
6. Session-completeness reporting, authorized drill-down and reauthorized injection-safe export.
7. Contextual links to timetable conflicts and Coordination follow-ups only when the current account has their independent grants.

Student attendance and class-summary report views remain missing from SA-30. Protected-text real-data retention, native accessibility, TEN-03, human acceptance and production readiness remain pending.

## Screenshot coverage

Current-source desktop and mobile captures cover the populated register directory, scheduling entry, submitted correction entry, scheduled detail/cancellation entry, populated explanation queue/detail, empty correction-request queue, report entry/results, Administrator Today and open mobile navigation. No current fixture exposed a cancelled session, a populated correction-request review, an unknown mutation, stale recovery or timetable reconciliation conflict. Those states are documented from contracts and cited historical evidence, not represented as current captures.

