# Attendance reference-to-source comparison

Authority: approved-c.html and final ordered refinement assets at reference commit `b4bbb0d028e06484f5ff00777231b1972de6d7f8`.
Classification below is **source and local runtime compared / human acceptance pending**. Matched current-build captures and measurements are in `local-verified/`.

| Reference requirement | Final source treatment | Runtime acceptance still required |
| --- | --- | --- |
| Student/Staff-aligned open directory | Shared local navigation; no new table card; scoped semantic tables | Header, content inset and local-link alignment |
| Equal Registers/Reports summary | One shared component; radius 6; number 22/28 weight 600; 88px desktop minimum; 166px mobile 2×2 | Actual size with real labels/font |
| Full search + Filters + Sort | Shared 40px desktop toolbar, attribute selection, Enter search, fluid drawers | Width, keyboard focus, Back/Forward |
| Priority | Open → Not started → Submitted → Upcoming → Cancelled | Real mixed-state ordering |
| Registers rows | Class/subject, Teacher, start–end, status, marks, View arrow | 46px heading/67px row, mobile labels |
| Pagination | Count left; Rows 25/50/100 and compact chevrons right | Boundary pages and narrow width |
| Approved icon family | Reference search, filter, sort, calendar, arrow paths; shared shell icons unchanged | Stroke/alignment |
| Drawer | 470px desktop/full mobile; 24×28 header/body; 20px mobile horizontal inset | No global CSS override, footer reachability |
| Registers calendar | 320px desktop/344px mobile; compact days; external Today action; centered month navigation | Position, focus return, overflow |
| Reports calendar | 560px dual month desktop/360px single month mobile; presets, dates, selection hint, Apply/Cancel | Compact proportions, keyboard month crossing |
| Mobile/coarse targets | 44px calendar dates, presets, controls; labelled mobile table values | Touch targets and no clipping |
| Detail roster | Compact metadata, current count chips, roster search, frozen Student identity, real admission number, contextual Correct | Long names/identifiers and empty states |
| Correction | Status/reason details → review → correction; no legacy third wizard stage | Dirty close, stale, unknown, saved, history |
| Cancellation | Reason → explicit consequence review → final-only write | Exact replay and retained records |
| Requests | Counted pending/all buttons, type selection and pagination, review drawer | Real owner authority and all terminal states |
| Review response | Details → consequence review; immutable request; separate saved/refresh-failed | Lost response, close/reopen, denied access |
| Reports | Class coverage; Due registers sort; timed/status missing drilldown with Done; direct authorized full filtered CSV | Multiple session pages, duplicate class names |
| Theme | Existing Forest/Amethyst/Porcelain/Linen variables preserved | All four themes; no unintended color change |

## Intentional production adaptations

- Actual authorized records replace fictional reference rows and counts.
- Reporting periods remain bounded to 31 days by the existing owner contract.
- Pending command state is retained in memory, with before-unload protection; no unsupported persistent draft/receipt mechanism.
- All requests exposes only records allowed by the existing assigned-reviewer detail contract, including current Guardian-purpose checks for explanations.
- Timetable scheduling validates actual school calendar/teacher assignment at the server; no mock conflict result.
- Protected source-register links are labelled as opening a new tab to avoid losing review drafts.

No source-only observation in this document is a substitute for browser measurements or human approval.
