# Parent/Guardian navigation

Source: `components/family-portal-frame.tsx#FamilyPortalFrame`; destination authorization is independently hosted by Guardians and each owner gateway.

## Complete configured catalogue

| Group/order | Label · icon | Destination | Visibility predicate |
|---|---|---|---|
| Family 1 | Home · `home` | `/family` | Always after current accepted child context resolves |
| Family 2 | My children · `students` | `/family/children` | Always shown; only server-returned accepted child links |
| Family 3 | Attendance · `attendance` | `/family/attendance` | Always shown in navigation; destination checks exact live Attendance purpose |
| Family 4 | Messages · `mail` | `/family/notices` | `communication.notice.read` purpose |
| Family 5 | School calendar · `calendar` | `/family/calendar` | `calendar.event.read_child` purpose |
| Family 6 | Learning · `academics` | `/family/learning` | `learning.assignment.read_child` purpose |
| Family 7 | Results · `report` | `/family/results` | `results.read_child` purpose |
| Family 8 | Child's timetable · `calendar` | `/family/timetable` | Always shown; destination independently checks exact timetable purpose/publication |
| Family 9 | Concerns · `mail` | `/family/concerns` | Always shown; destination independently resolves current request authority |
| Family 10 | Meetings · `calendar` | `/family/meetings` | Always shown; destination independently resolves participant authority |
| Personal 1 | My account · `account` | `/family/account` | Always shown |

Every link carries `?child=<server-returned Student id>`. Active state is exact for `/family` and prefix-based for children. No badges exist.

## Current seeded persona

The private Parent credential reached `/choose-workspace`, but the current demo returned no authorized workspace option. No current screenshot is claimed. Historic Parent evidence covers the unchanged shell; the fixture/access discrepancy remains a demo issue.

## Contextual and hidden destinations

- Invitation/access unavailable: `/family/invite`, `/family/access-unavailable`.
- Attendance explanations and correction requests: `/family/attendance/explanations/new`, `/family/attendance/explanations/[id]`, `/family/attendance/corrections/new`, `/family/attendance/corrections/[id]`.
- Notice/calendar/Learning/concern/meeting detail and create routes are children of their list routes.

The selected-child ribbon and chooser persist child context across navigation. The mobile quick bar is **Home**, **Attendance**, **Messages** when permitted (otherwise **Timetable**), and **More**. The drawer is focus-contained. Account and direct sign-out are in the footer; no Help link exists.

## Findings

- Attendance, timetable, concerns and meetings are always visible even when their owner availability is absent. Destination authorization prevents data disclosure, but the sidebar can expose unavailable areas.
- **Messages** and **Concerns** share the mail icon while representing different lifecycles.
- Eleven flat links mix child selection, school information, learning and communication.
- Direct sign-out differs from the staged account/context pattern.
- Current seeded persona availability is broken or stale on the served demo.

## Proposed grouping (documentation only)

- **My family:** Home; My children.
- **School life:** Attendance; Child's timetable; School calendar; Learning; Results.
- **Communication:** Messages; Concerns; Meetings.
- **Personal:** My account.

Add cheap owner availability predicates before changing visibility; never use the existence of a link as authority.
