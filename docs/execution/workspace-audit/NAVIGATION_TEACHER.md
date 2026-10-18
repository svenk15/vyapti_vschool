# Teacher navigation

Sources: `components/teacher-portal-frame.tsx#TeacherPortalFrame`, `app/teacher/layout.tsx#TeacherLayout`, and the shared portal shell/navigation components.

## Complete configured catalogue

| Group/order | Label · icon | Destination | Visibility/availability |
|---|---|---|---|
| Teaching 1 | My teaching day · `calendar` | `/teacher/today` | Always after authenticated Teacher home resolves; destination verifies current bound Employee/Teacher and dated work |
| Teaching 2 | My classes · `classes` | `/teacher/classes` | `class.read` and `student.read`; `teacherClasses` succeeds for current school-local date |
| Teaching 3 | Assignments · `academics` | `/teacher/learning` | `learning.assignment.write`; Learning Teacher workspace succeeds; Homework module/resource checks remain live |
| Teaching 4 | Assessment marks · `report` | `/teacher/assessments` | Assessments mark workspace succeeds; exact dated offering assignment required |
| Teaching 5 | Attendance history · `attendance` | `/teacher/history` | `attendance.read_class`; Teacher history query succeeds under current and historical assignment checks |
| Teaching 6 | My timetable · `classes` | `/teacher/timetable` | `timetable.read`; Timetable released, entitled and branch-active |
| Teaching 7 | Cover requests · `people` | `/teacher/cover` | Timetable cover inbox query succeeds for the exact named substitute |
| Teaching 8 | Meetings · `calendar` | `/teacher/meetings` | Events meeting list succeeds for a current participant |
| Teaching 9 | Specialist support · `people` | `/teacher/support` | Restricted Support referral list succeeds; Teacher role alone is insufficient |
| Personal 1 | My account · `account` | `/account` | Current authenticated account |

Groups are flat and noncollapsible. Active state uses the shared most-specific route matcher. No badges exist. The current seeded Teacher rendered every item except **Specialist support**.

## Hidden/contextual destinations

- Assignment readiness: `/teacher/readiness`.
- Assigned class detail/roster: `/teacher/classes/[id]`.
- Attendance register and correction request: `/teacher/sessions/[id]`, `/teacher/attendance/corrections/new`, `/teacher/attendance/corrections/[id]`.
- Assignment author/detail/submission feedback: `/teacher/learning/new`, `/teacher/learning/[id]`, `/teacher/learning/[id]/submissions/[submissionId]`.
- Cover, meeting and specialist detail: `/teacher/cover/[id]`, `/teacher/meetings/[id]`, `/teacher/support/referrals/[id]`.
- Account context/review and staged sign-out are under `/account/context` and `/account/review`.

## Desktop/mobile and utilities

The shared shell keeps the desktop sidebar persistent and turns it into a focus-contained drawer on mobile. Escape and close return focus to the opener. Branch/workspace switching is at `/account/context`; account and staged sign-out are in the footer. There is no mobile bottom navigation, Help link or badge.

## Findings

- Nine operational destinations share one **Teaching** group. Classes/Attendance, planning, assessment and assigned nonteaching work are not visually separated.
- `canUseCover`, Meetings and Specialist support are inferred by executing protected list queries. An authorized empty workspace may be hidden depending on gateway semantics.
- **Specialist support** is assigned-specialist work, not TEA-36 Teacher referral creation; its label can be misunderstood.
- The timetable icon uses the `classes` glyph rather than `calendar`, creating avoidable inconsistency.
- Meetings currently supports participant response, while the catalogue's TEA-20 originator journey is partial.

## Proposed grouping (documentation only)

- **My day:** My teaching day; My timetable; Cover requests.
- **Classes & attendance:** My classes; Attendance history.
- **Teaching work:** Assignments; Assessment marks.
- **Assigned work:** Meetings; Specialist support (conditional, label as assigned specialist work).
- **Personal:** My account.

Keep one sidebar level beneath each group and retain all current owner checks.
