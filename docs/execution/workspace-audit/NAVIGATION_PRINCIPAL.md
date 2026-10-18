# Principal navigation

Sources: `components/principal-navigation.ts#principalNavigationGroups`, `app/leadership/layout.tsx`, `lib/server/principal-navigation.ts`, `components/principal-area-navigation.tsx`, and the shared portal shell. This reflects the regrouping at HEAD `d6c9120`, not the older flat inventory.

## Complete configured catalogue

| Group/order | Label | Destination | Visibility/availability |
|---|---|---|---|
| Direct | My day | `/leadership` | Always after explicit leadership home resolves |
| Attendance 1 | Register coverage | `/leadership/attendance` | `attendance.read_leadership` and Attendance module available |
| Attendance 2 | Pupil attendance | `/leadership/attendance/pupils` | named-pupil review availability succeeds |
| Attendance 3 | Explanations | `/leadership/attendance/explanations` | exact explanation-reviewer availability succeeds |
| Attendance 4 | Correction requests | `/leadership/attendance/correction-requests` | correction-routing availability succeeds |
| Teaching & staff 1 | Timetable & cover | `/leadership/timetable` or `/leadership/cover` | Timetable leadership read and/or cover availability; route selects first authorized surface |
| Teaching & staff 2 | Staff availability | `/leadership/staff/availability` | People leadership availability succeeds |
| Teaching & staff 3 | Staff requests | `/leadership/staff/requests` | Requests review availability reports staff authority |
| Teaching & staff 4 | Learning | `/leadership/learning` or `/leadership/learning/evidence` | Learning leadership module read and/or recipient evidence manager purpose |
| Teaching & staff 5 | Assessments | `/leadership/assessments` or `/leadership/assessments/publications` | readiness and/or publication availability |
| Communication 1 | Notice coverage | `/leadership/communication` | leadership Communication list succeeds |
| Communication 2 | Notice reviews | `/leadership/notices/review` | current review-proposal list succeeds |
| Communication 3 | Family concerns | `/leadership/concerns` | Requests review availability reports family authority |
| Communication 4 | Meetings | `/leadership/meetings` | Events meeting list succeeds |
| My work 1 | My decisions | `/leadership/decisions` | Coordination verify or Finance exception authority |
| My work 2 | Follow-ups | `/leadership/coordination` | Coordination enabled with a decision/work capability beyond worker/history-only |
| My work 3 | Handover | `/leadership/handover` | `coordination.assign` |
| Reports & insights 1 | Reports | `/leadership/reports` | at least one export/snapshot/comparison capability |
| Reports & insights 2 | Decision history | `/leadership/history` | `coordination.history` |
| Reports & insights 3 | Evidence assistant | `/leadership/assistant` | synthetic Assistant enabled and current generator designation |
| Conditional | Financial exceptions | `/leadership/finance/exceptions` | Finance INR summary succeeds; synthetic-only |
| Conditional | Facilities incidents | `/leadership/services/incidents` | Facilities list succeeds; synthetic-only |
| Conditional | Restricted support | `/leadership/support` | restricted Support list succeeds |
| Utilities | My acting access | `/leadership/delegations` | current acting delegation exists |
| Utilities | My account | `/leadership/account` | current leadership account |

Attendance, Teaching & staff, Communication, My work, and Reports & insights are collapsible. Only one group is expanded, with the active group automatically expanded on route change. Explicit match sets and longest-path selection prevent parent/child collisions. Conditional and utility items have icons; child items use the parent group's icon. No badges exist.

Group icons are `attendance`, `academics`, `mail`, `activity`, and `report` in the rendered order. **My day** uses `home`; conditional Finance/Facilities/Support use `report`/`activity`/`people`; acting access and account use `activity`/`account`.

## Seeded persona

The current seeded Principal rendered 22 destinations. Missing from the maximum catalogue were **Notice reviews**, **Restricted support**, and **My acting access**. Desktop/mobile were captured with Attendance expanded: `navigation-captures/principal-{desktop,mobile}.png`.

## Contextual and hidden destinations

- Timetable tabs: **Exceptions** and **Cover requests**.
- Learning tabs: **Assignment completion**, **Feedback turnaround**, **Pupil evidence**.
- Assessments tabs: **Readiness** and **Report publication**.
- Detail/create/receipt routes include Attendance sessions; decision owner/detail/routing; Coordination detail/bulk/batches/new; cover detail; Learning follow-up/concern; notice review/detail/reminder; concern, meeting, staff request, support, Finance and Facilities detail/create; reports snapshots/comparisons/briefs/reviews; assistant new/detail.

Branch switching is in the shared top bar. Account, optional acting access and staged sign-out are utilities. No Help destination is configured.

## Findings

- The regrouping resolves the former long flat list and preserves most-specific active state.
- **Timetable & cover**, **Learning**, and **Assessments** intentionally choose the first authorized child route; contextual tabs expose the second route. This is concise but makes availability less obvious before entry.
- Some conditional visibility still executes list/summary reads and can hide an authorized empty area depending on gateway semantics.
- **Reports** owns briefs/reviews through explicit route matching although their labels are absent from the sidebar; breadcrumbs/context must carry the distinction.
- No badges communicate pending decisions, follow-ups or reviews.

## Proposed mapping

The implemented structure already matches the approved regrouping: **My day**, **Attendance**, **Teaching & staff**, **Communication**, **My work**, **Reports & insights**, conditional Finance/Facilities/Support, and utilities. Future work should refine cheap availability and optional count badges only under an approved data-minimization contract; no regrouping is recommended by this audit.
