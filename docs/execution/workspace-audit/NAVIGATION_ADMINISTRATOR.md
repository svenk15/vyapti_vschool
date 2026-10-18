# School Administrator navigation

Sources: `lib/server/admin-navigation.ts#getAdminNavigation`, `app/admin/layout.tsx#AdminLayout`, `components/admin-portal-frame.tsx`, shared `components/portal/portal-shell.tsx` and `components/portal-navigation-group.tsx`.

Navigation visibility is only a convenience projection. Every destination re-resolves identity, scope, module and resource authority in its page/gateway/API path.

## Complete configured catalogue

| Group/order | Label · icon | Destination | Visibility/availability |
|---|---|---|---|
| Operations 1 | Today · `home` | `/admin` | `school.manage`; no module predicate |
| Operations 2 | Attendance · `attendance` | `/admin/attendance/sessions` | `attendance.read_school`; Attendance released, entitled and branch-active |
| Operations 3 | Students · `students` | `/admin/students` | `student.read`; Student Core available |
| Operations 4 | Staff & access · `staff` | `/admin/users` | `user.manage` |
| Operations 5 | Academics · `academics` | `/admin/academics` | `class.manage`; Academic Core available |
| Operations 6 | Assessment planning · `academics` | `/admin/assessments` | `school.manage`; Assessments, Academic Core and Student Core available; destination additionally requires explicit planning designation |
| Operations 7 | Timetable · `calendar` | `/admin/timetable` | `timetable.manage`; Timetable, Academic Core and Staff Core available |
| Operations 8 | Cover coordination · `people` | `/admin/timetable/cover` | `timetable.manage`; Timetable, Academic Core, Staff Core and Attendance available |
| Operations 9 | Reports · `report` | `/admin/reports/attendance` | `attendance.read_school`; Attendance available |
| Operations 10 | Communication · `mail` | `/admin/communication` | `communication.publish`; Communication available |
| Operations 11 | Calendar & events · `calendar` | `/admin/events` | `communication.publish`; Communication, Academic Core and Student Core available |
| Operations 12 | My requests · `mail` | `/admin/requests` | Added when Requests returns at least one configured category; destination still checks current originator authority |
| Operations 13 | Assigned follow-ups · `activity` | `/admin/coordination` | Coordination availability enabled and `coordination.work` present |
| Operations 14 | Facilities incidents · `activity` | `/admin/services/incidents` | Facilities list availability succeeds under current exact purpose |
| Operations 15 | Financial exceptions · `report` | `/admin/finance/exceptions` | Finance INR summary succeeds under current exact purpose; synthetic Finance restrictions apply |
| Management 1 | Staff profiles · `people` | `/admin/teachers` | `class.manage`; Staff Core available |
| Management 2 | Imports · `import` | `/admin/imports` | `student.manage`; Student and Academic Core available |
| Management 3 | Admissions · `students` | `/admin/admissions` | `admissions.manage`; Admissions and Student Core available |
| Management 4 | Classes and teachers · `classes` | `/admin/classes` | `class.read`; Academic and Staff Core available |
| Management 5 | School setup · `school` | `/admin/setup` | `school.manage` |
| Management 6 | School settings · `school` | `/admin/school` | `school.manage` |
| Management 7 | Branch module access · `modules` | `/admin/modules` | `module.configure` plus successful Institution Administration gateway. This is a shared/Institution Administrator flow and is not an extra School Administrator catalogue workflow. |
| Management 8 | Sign-in branding · `branding` | `/admin/branding` | `branding.manage` |
| Management 9 | Branch activity · `activity` | `/admin/activity` | `school.manage` |
| Management 10 | Staff availability · `people` | `/admin/teachers/availability` | Current People availability-recorder projection succeeds |
| Management 11 | Support procedure · `people` | `/admin/support` | A current Support procedure is readable; destination requires the exact procedure-publisher authority for changes |

All items are first-level links below noncollapsible group labels. Active state uses the most-specific matching route; base one-segment `/admin` is exact. `Cover coordination` correctly wins over `Timetable` on its child path. No sidebar badge is configured.

## Seeded persona

The current seeded Administrator rendered 25 items: every configured item above except **Support procedure**. Desktop and mobile produced the same catalogue. Captures: `navigation-captures/administrator-{desktop,mobile}.png` and the corresponding `-lower.png` files; machine inventory: `navigation-captures/rendered-navigation.json`.

## Contextual and hidden destinations

- Student registration, detail, enrollment and transfer: `/admin/students/register`, `/admin/students/[id]`, `/admin/students/[id]/enrollment`, `/admin/students/enroll`, `/admin/students/transfer`.
- Staff create/grant/change: `/admin/teachers/create`, `/admin/users/grant`, `/admin/users/change`.
- Attendance detail/explanations/correction requests: `/admin/attendance/sessions/[id]`, `/admin/attendance/explanations`, `/admin/attendance/explanations/[id]`, `/admin/attendance/correction-requests`, `/admin/attendance/correction-requests/[id]`.
- Communication/calendar authoring and receipts: `/admin/communication/new`, `/admin/communication/[id]/withdraw`, `/admin/communication/proposals/[id]`, `/admin/events/new`, `/admin/events/[id]`.
- Request/follow-up/Finance/Facilities detail and create routes live below their list entries.
- Timetable readiness and cover detail: `/admin/timetable/readiness`, `/admin/timetable/cover/[id]`.
- Imports and branding/module/activity management use `/manage` or `/operations` child routes.
- `/institutions` is Institution Administration and is not a School Administrator sidebar item.

The top bar owns branch switching and academic-year context. The footer owns account identity and staged sign-out. No Help destination is configured.

## Findings

- A seeded user sees 25 flat links, requiring substantial desktop/mobile scrolling.
- Staff work is split among **Staff & access**, **Staff profiles**, **Classes and teachers**, **Staff availability**, **My requests**, and **Cover coordination**.
- Setup, audit and operational queue links are mixed in two broad groups. **Management** contains admissions/imports as well as configuration.
- Dynamic visibility sometimes performs a list/summary read rather than a cheap availability query. Endpoint authorization remains intact, but navigation assembly is more expensive and an empty authorized queue can be hidden.
- **Branch module access** is institution/shared administration inside the School Administrator shell and needs a clearer label/context.
- There are no badges; operational queues do not indicate count or urgency.

## Proposed grouping (documentation only)

- **Today:** Today; Attendance; Students; Calendar & events.
- **Teaching & academics:** Academics; Classes and teachers; Assessment planning; Timetable; Cover coordination.
- **People & access:** Staff & access; Staff profiles; Staff availability.
- **Communication & work:** Communication; My requests; Assigned follow-ups.
- **Services** (conditional): Facilities incidents; Financial exceptions.
- **School management:** Admissions; Imports; School setup; School settings; Branch module access; Sign-in branding; Branch activity; Support procedure.

Use collapsible task groups with the active group expanded. Preserve all current visibility predicates and independent destination authorization.
