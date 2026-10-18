# Student navigation

Source: `components/student-portal-frame.tsx#StudentPortalFrame`; destination authorization is hosted by Student, Learning, Attendance, Communication, Events, Assessments and Access gateways.

## Complete configured catalogue

| Group/order | Label · icon | Destination | Visibility predicate |
|---|---|---|---|
| My school day 1 | My day · `home` | `/student` | Always after a server-authorized Student context resolves |
| My school day 2 | My profile · `students` | `/student/profile` | Always shown; destination is self-only |
| My school day 3 | My classes · `academics` | `/student/classes` | Currently tied to `learning.assignment.read_self` |
| My school day 4 | My timetable · `calendar` | `/student/timetable` | `timetable.read_self` purpose; destination independently checks publication/enrollment/module |
| My school day 5 | School calendar · `calendar` | `/student/calendar` | `calendar.event.read_self` purpose |
| My school day 6 | Assignments · `academics` | `/student/assignments` | `learning.assignment.read_self` purpose |
| My school day 7 | Results · `report` | `/student/results` | `results.read_self` purpose and current publication/document checks |
| My school day 8 | Attendance · `attendance` | `/student/attendance` | `attendance.read_self` purpose |
| My school day 9 | Messages · `mail` | `/student/notices` | `communication.notice.read_self` purpose |
| Personal 1 | My account · `account` | `/student/account` | Always shown for current account/context |

All links retain `?student=<server-returned Student id>`. The desktop drawer is flat. Active state is exact for `/student` and prefix-based for children. No badges exist.

## Current seeded persona

The private Student credential reached `/choose-workspace`, but the current demo returned no authorized workspace option. No current screenshot is claimed. Earlier Student desktop/mobile evidence remains applicable to unchanged source surfaces, but the current demo fixture/access discrepancy must be resolved before consolidated manual testing.

## Contextual and hidden destinations

- Class, assignment, notice and calendar detail: `/student/classes/[id]`, `/student/assignments/[id]`, `/student/notices/[id]`, `/student/calendar/[id]`.
- Attendance correction request: `/student/attendance/corrections/new`, `/student/attendance/corrections/[id]`.
- Invitation/access unavailable: `/student/invite`, `/student/access-unavailable`.
- Session management: `/student/account/sessions`.

The context ribbon exposes only server-authorized enrollment contexts. Switching uses a full navigation with the selected Student id, preventing a late prior-context response from overwriting the new page.

Mobile quick navigation is **My day**, **Work** when Learning is permitted, **Messages** when notice purpose exists, **Account**, and **More**. The drawer is focus-contained. Account and direct sign-out are in the footer; there is no separate Help link.

## Findings

- **My classes** is hidden behind Learning assignment purpose even though class membership is an Academics/Students projection. This can hide a legitimate class view or couple two owners unnecessarily.
- Ten flat destinations make the desktop group long; profile, learning work, results and school information are mixed.
- Prefix matching is simple and currently safe, but it is less explicit than the shared most-specific matcher.
- Direct sign-out differs from the staged account/context sign-out used by Administrator, Teacher and Principal.
- Current seeded persona availability is broken or stale on the served demo.

## Proposed grouping (documentation only)

- **My day:** My day; My timetable; School calendar.
- **Learning:** My classes; Assignments; Results.
- **My school information:** Attendance; Messages; My profile.
- **Personal:** My account.

Separate the My classes predicate from Learning only after confirming its existing owner authorization; do not infer new access from the navigation change.
