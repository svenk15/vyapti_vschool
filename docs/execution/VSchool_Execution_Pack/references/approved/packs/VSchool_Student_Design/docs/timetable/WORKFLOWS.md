# Workflows and screen contracts

## Roles and capabilities
| Persona | Scope | Allowed actions | Not implied |
|---|---|---|---|
| School timetable manager | Granted institution, branch and academic year | Draft, validate, publish, dated changes, request review | Cross-branch or HR-private access |
| Academic coordinator | Same explicit manager grant when delegated | Same authorized commands within delegation dates | Authority from job title alone |
| Teacher | Current teaching assignments and dated cover | Read own schedule; request change; acknowledge/decline own cover; authorized Attendance handoff | Publishing or roster access from a notification |
| Student | Verified account-person link and active class enrollment | Read class published schedule and safe dated changes | Other class rosters or staff reasons |
| Parent/guardian | Active verified relationship, child enrollment and `timetable.read` purpose | Read that child’s published timetable and safe changes | Attendance or notice access implies timetable access |
| Principal | Explicit branch timetable oversight | Read coverage exceptions and source evidence | Edit, attendance marking, HR-private reasons, cross-branch details |
| Operator | Institution configuration capability | Commercial license, branch availability metadata | Student, class, teacher, timetable or attendance records |

Permission names below are proposals to reconcile with the live capability registry: `timetable.read.self`, `timetable.read.child`, `timetable.manage`, `timetable.publish`, `timetable.change.manage`, `timetable.request.create`, `timetable.cover.respond`, `timetable.oversight`, `tenancy.module.license.configure`, `tenancy.branch_module.configure`. Parent relationship purpose is separate from the account capability.

## Administrator
**TT-W01 — Set up school day.** Timetables → Edit timetable → School day. Choose effective date; choose teaching days; edit period/break times. Reject invalid or overlapping intervals. Disabling a day requires removing its draft slots. School time zone is read-only; use the existing branch time zone. The browser demonstrates a fixed five-period template; the production task includes adding/removing period rows with stable IDs and the same validation.

**TT-W02 — Build and save.** Choose a class; open an occupied cell to edit or an empty cell to add a lesson. Pick subject, eligible teacher and room. Validate across all classes, not only the displayed one. Save lesson changes only the draft. Save draft and leave becomes available when the draft has changes. Resume restores the saved revision; discarded unsaved work never changes published data.

**TT-W03 — Publish revision.** Review effective date, changed/removed slots, affected future occurrences and protected attendance. Recheck permissions, expected version, calendar, teacher eligibility, room/teacher/class conflicts and existing dated exceptions. Publication creates one immutable version and a command receipt. Current school views immediately read the applicable published version. Generation/delivery has separate progress; never say email delivered based on publication.

**TT-W04 — Cover.** Daily changes → New daily change → exact lesson → Assign substitute. Show eligible available teachers and explicit unavailable candidates. Review effective lesson, teacher, reason and safe notification. Confirm once. Cover affects only that dated occurrence; the original weekly slot is unchanged. The school assignment grants its limited authority; acknowledgement merely records the teacher’s response. A decline creates Needs cover and removes that cover assignment’s authority.

**TT-W05 — Move or cancel.** Select exact lesson. A move changes time/room on the same local day; validate clashes and breaks. A cancellation retains the lesson and evidence, with no attendance entry expected. Both reject opened/submitted sessions. Neither marks pupils absent. Cross-day rescheduling is a later explicit operation, not hidden cancellation-plus-creation.

**TT-W06 — Restore.** Restore published lesson removes the current dated override, retains change history, rechecks future time, teacher/class/room conflicts and attendance locks, then queues a corrected notice. Opened/submitted historical records remain protected.

**TT-W07 — Review teacher request.** Open a pending operational request. Arrange a dated change through TT-W04/05; resolve only after the owner command succeeds. Alternatively return with a note. A request never changes the schedule on its own. Duplicate active requests for the same teacher/occurrence are prevented.

## Teacher
**TT-W08 — Plan my day.** My timetable shows only published lessons assigned to the teacher, plus relevant replacement/cancellation information. Existing My teaching day links here. An original teacher can see that a lesson was reassigned but cannot open its current attendance roster.

**TT-W09 — Respond to cover.** Open own active cover assignment. Acknowledge or report Unable to cover before attendance opens. Reauthorize current assignment on response. A superseded cover invitation cannot be acknowledged. Show the coordinator’s resolution when reassigned. No shared credentials or permanent class membership.

**TT-W10 — Take attendance.** Open exact lesson → owner Attendance route. Before start show when entry opens. At execution check current teacher/cover eligibility, current attendance-module availability and exact session. Pin assignment/plan when attendance opens. All roster outcomes are required; submitted receipt is read-only here.

**TT-W11 — Request change.** From own lesson, add a minimal operational handover and submit. Receipt says Pending coordinator review. Teacher can see their request state/returned note. No medical explanation, private leave document or shared-login instruction.

## Student and family
**TT-W12 — Read schedule.** Student opens My timetable. Guardian selects a permitted child, then Child’s timetable. Show class, branch, academic year, school time zone, publication revision and date range. Drafts, other classes, raw staff reasons and roster data are excluded from the response. Missing timetable differs from cancelled lesson and permission denied. Permission revocation clears cached child details.

**TT-W13 — Understand a change.** Dated changes show subject, date, updated time/room or substitute and safe message. Cancellation says the school’s supervision arrangements still apply. Communication notifications are supplementary; the schedule remains the source of truth. No automatic guardian acknowledgement is inferred from viewing.

## Leadership and platform
**TT-W14 — Review exceptions.** Principal sees uncovered lessons, awaiting cover acknowledgement and pending requests with source cutoff and coordinator ownership. A pending acknowledgement is not an uncovered class. Open source lesson evidence within current oversight scope. Delegated approval/editing requires a distinct grant, outside the default read view.

**TT-W15 — Configure module.** Operator opens a named institution’s Modules tab. Review Timetable license and selected branch activation, release/setup prerequisites and impact. License removal disables all branches while retaining records. License restoration does not reactivate branches. Timetable and Attendance entitlements remain independent. Each configuration mutation needs an expected version, reason, audit event and approved commercial reference for licensing.

## Layout and interaction rules
- Keep existing shell, icons, role footer and separate sign-out. Product navigation names are meaningful; no technical module codes in product headings.
- Desktop: class/week controls above one aligned weekly table. Mobile: selectable weekday strip and vertical lesson cards; no compressed desktop grid.
- Daily-change search defaults to Subject, with Reference alternative; Enter applies. Search, Filters and Sort fill one toolbar with compact gaps. No explicit Search button.
- Filters: side drawer, fluid collapsible sections, multiselect stays open, no default selected filter, Apply and Cancel. Sort: side drawer, expanded Sort by and Order by radio sections.
- Dialogs: labelled, keyboard-contained, Escape closes, focus returns. Confirmation explains scope and outcome. Dirty editing prompts before leaving. Browser-native unload protection is supplemental.
- All screens need loading, empty, failure, denied, expired session, stale version and unknown-result variants. Reduced motion and token-driven themes apply. Do not claim accessibility conformance from browser tests alone.

## Publication states
Draft → Validated preview → Published effective revision. Delivery, generation and confirmation are independent. Unknown response → Check command receipt → Saved / Rejected / Still processing. Never create a second publication while the first result is uncertain.

## Cover states
Assigned / awaiting acknowledgement → Acknowledged; or Unable to cover → Needs cover → Reassigned. Superseded, restored and cancelled history remains. No response status manufactures a teacher eligibility grant.
