# Attendance friction log

The entries below separate observed behavior from proposed changes. No proposal is implemented by this review.

| Priority | Observed behavior | Impact | Proposed simplification | Contract impact |
|---|---|---|---|---|
| P0 | Session detail return actions do not preserve the selected date/class query. | Administrators lose place after inspecting a register. | Carry validated return context through detail and restore it on Back. | UI/routing only; server still derives scope. |
| P0 | The Registers navigation advertises `attendance.read_school`, while the combined sessions page first calls `authorizeAdmin`, which requires `class.manage`, even for monitor mode. | A read-only school Attendance user can see a destination that the page renders unavailable. | Split monitor authorization from scheduler authorization and show Schedule only with `class.manage`. | Engineering correction within existing capabilities; no product decision. |
| P1 | There is no task-focused Attendance landing; daily coverage, queues and reports are separate peer destinations. | Users translate owner structure into daily priorities. | Make Attendance open a Today view with truthful counts and authorized contextual actions. | Requires a read composition only; each action keeps its owner authorization. |
| P1 | Schedule session is a four-stage routine and is promoted on unrelated explanation pages. | Extra clicks and action competition. | Group ordinary inputs, keep one review/confirmation for the consequential write, and show the CTA only on Today/Registers. | UI composition; owner schedule contract unchanged. |
| P1 | Registers support date and class only, while the review scope expects search/filter/sort/pagination assessment. | Larger schools cannot efficiently find a session beyond a selected day/class. | First design a whole-authorized-result query with supported fields, stable ordering and cursors. Until then, do not show nonworking controls. | New read-query engineering contract; no new write rule. |
| P1 | “Review or correct” and “Review or cancel” combine navigation and mutation language. | The row action is vague and implies an immediate write. | Label the navigation “Open register”; present state-specific permitted actions on detail. | Copy/composition only. |
| P1 | Explanation and correction-request queues are separate tabs though both are review work. | Two small queues require destination switching. | Group them under Requests with type/status; retain distinct detail flows and grants. | Presentation composition only. |
| P1 | Report entry has Scope → Review export → Confirm even when the user only wants to view results. | Viewing is coupled to export confirmation. | Show the report immediately after valid scope; start the review step only when Export is selected. | UI composition; export authorization/recheck retained. |
| P2 | Report filters are repeated below the export step and can dominate long results. | Scanning cost and vertical length increase. | Use a compact persistent filter bar; summarize applied scope. | UI only. |
| P2 | Status badges expose uppercase owner enum values. | Lower readability and inconsistent school-office language. | Render human-readable labels while retaining exact enum semantics in code. | Presentation only. |
| P2 | Session counts are page/list lengths without an explicit scope label beside every count. | Users may read a selected-day count as a branch total. | Label “7 sessions on 22 Oct” and keep branch/date context adjacent. | Presentation only. |
| P2 | Scheduled detail says “Frozen roster 0” although a scheduled roster is not frozen yet. | A truthful zero can be misread as an empty frozen roster. | Say “Roster freezes when opened” for Scheduled; show the count only for Open/Submitted/Cancelled. | Presentation mapping only. |
| P2 | Queue pages rely on route-level server loading and have no dedicated loading composition. | Navigation can appear stalled on a slow owner read. | Add shared loading and unavailable states that preserve the destination and retry safely. | UI only. |

## Controls and density observations

- Current controls use the shared 40–45px recipes and are not individually oversized.
- The correction, explanation and schedule side notes repeat “What this changes / Something changed?” across flows. Retain the content that protects correctness, but collapse routine repetition after the user has entered from a contextual session.
- The mobile list correctly becomes labelled cards and has no root horizontal overflow. Full-page evidence is long because all seven day sessions render without pagination.
- Current report output is especially long on mobile. Pagination exists for the server result, but summary, workflow stepper, filters and rows are all stacked before the next-page action.

## Confirmed non-defects

- Missing registers are not counted as absences.
- Parent explanation acceptance does not change Attendance.
- Manual timetable conflicts are not silently adopted, overwritten, relinked or duplicated.
- Cancellation preserves history rather than deleting a session.
- An Administrator role label alone does not grant explanation review, correction-request review or Coordination authority.

