# Attendance navigation map

## Current configured navigation

```text
Administrator sidebar
└── Attendance
    └── first currently visible authorized destination
        ├── Registers   /admin/attendance/sessions?view=monitor
        ├── Corrections /admin/attendance/correction-requests
        ├── Explanations /admin/attendance/explanations  (dynamic)
        └── Report      /admin/reports/attendance
```

The sidebar shows one direct **Attendance** item. `composeAdminNavigation` chooses the first visible destination in preferred order. Registers requires `attendance.read_school` and the Attendance module. Corrections requires `attendance.correct`. Report requires `attendance.read_school`. Explanations is injected only when `reviewerAvailable` confirms live membership plus an explicit explanation reviewer grant.

Every destination independently performs server authorization. Hidden navigation is not endpoint authorization.

## Current local navigation

Registers, Explanations, Corrections and Report appear as peer tabs for the seeded Administrator. The same links appear on desktop and below the page heading on mobile. Contextual routes do not appear as tabs:

- schedule: `/admin/attendance/sessions`
- session detail/correction/cancellation: `/admin/attendance/sessions/[id]`
- explanation detail: `/admin/attendance/explanations/[id]`
- correction-request detail: `/admin/attendance/correction-requests/[id]`
- timetable reconciliation/conflict: `/admin/timetable`
- assigned follow-up: `/admin/coordination` when separately authorized

## Findings

1. Selecting Attendance currently opens Registers. There is no Attendance-specific task landing page.
2. Explanations is correctly hidden without the reviewer grant, but the local order reserves a conceptual destination that may disappear. This is truthful, though users can see different tab sets by grant.
3. Schedule session is repeated as a prominent queue action, including on the explanation queue where it is unrelated to the current task.
4. The session detail links back to a generic session route and does not preserve the list date/class query. This loses review context.
5. Today and Report each provide session drill-down, but neither carries an explicit safe return target.
6. Timetable conflicts and missing-register follow-ups belong to other owner workspaces. Duplicating them as Attendance destinations would misrepresent authority.
7. Mobile navigation is reachable and scrollable in the captured state; Attendance local tabs remain horizontally compact. The full-page mobile capture has no root horizontal overflow.

## Proposed information hierarchy

```text
Attendance
├── Today
│   ├── coverage summary: submitted / awaiting / future / cancelled
│   ├── due and exception rows
│   └── contextual actions: open register, inspect, follow up (only if granted)
├── Registers
│   ├── date and class filters
│   ├── register detail / frozen roster
│   ├── Schedule session
│   └── contextual correction or cancellation
├── Requests
│   ├── Parent explanations
│   └── routed correction requests
└── Reports
    ├── session completeness
    ├── drill-down
    └── authorized export
```

This is a proposal only. It preserves existing routes, grants and owner boundaries. **Requests** is a presentation grouping, not a shared approval service. It may show separate lists or a type filter while each item continues to use its own owner contract.

## Context preservation contract for a future implementation

- Date, class and any future supported filter/sort fields stay in validated URL state.
- Detail links carry only an allowlisted same-origin return path or reconstruct the validated list query.
- Back/Forward restores the list without reusing another branch's data.
- A branch switch invalidates prior scope data and late responses.
- Mutations never use a return URL, visible tab or hidden control as authority.

