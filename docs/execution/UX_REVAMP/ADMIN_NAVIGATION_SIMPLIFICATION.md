# Administrator navigation simplification proposal

Prepared 20 October 2026 from current source at `f272989b9b3d6acba4f84d98e00c45fb240146a3` and refined from preview checkpoint `546b436dd88b9f848a62ee4480b4f627c9d7d83a`. This is a review checkpoint. It changes no production route, navigation, permission, database row or workflow.

Authority: [UX Constitution](../../ux/UX_CONSTITUTION.md), [control sizing](../../ux/CONTROL_SIZING_CONTRACT.md), [FIRST registration reference](../../ux/references/registration-approved/APPROVED_REGISTRATION.html), `components/workspace-navigation.ts`, `lib/server/admin-navigation.ts`, `app/admin/layout.tsx`, `components/portal/portal-shell.tsx`, and the current `app/admin/**/page.tsx` tree.

## Selected preview direction: Concept 1 — Quiet workspace

The owner selected [Concept 1 SVG](../../ux/references/student-concepts/concept-1.svg) and [PNG](../../ux/references/student-concepts/concept-1.png) for the desktop presentation direction. Concepts 2 and 3, the earlier dropdown selector, segmented pill group and contextual-sidebar proposal are rejected. Selection authorizes refinement of this isolated preview only; production navigation and the proposed mobile adaptation remain unaccepted.

Implementation-ready presentation contract:

- Desktop uses the reference geometry: 218px pale sidebar, 72px context header, content beginning 38px inside the workspace, 28/36px Students heading, open white canvas and no enclosing directory card.
- The Students secondary row uses real links with transparent backgrounds, 13px labels, 36px gaps, a 2px Forest current indicator and `aria-current="page"`. Directory, Admissions and Imports keep Students active in the primary navigation.
- Directory places its 36px **Register student** action in the secondary row, followed by a 40px search/filter/sort toolbar and an open semantic directory with 67px desktop rows and restrained dividers. Production keeps the existing attribute search, URL state, filters, stable sort, pagination and authorized Manage action.
- Admissions and Imports retain their own destinations and supported **New application** / **New import** actions. Registration is a separate focused route with **Back to Students** and does not inherit the secondary row.
- Staff demonstrates the same reusable link pattern with Profiles, Access and Availability while remaining a separate primary area. Other areas retain the mapping below and are not forced into three links.
- At 900px the primary action moves above the secondary row to protect labels. At 390px and 360px the title remains visible, the secondary links keep 44px targets in a horizontally scrollable row, the action receives its own 44px row, the directory becomes labelled cards and the existing modal sidebar remains independently scrollable. This mobile composition is a proposed extension awaiting review.
- Permission projection is server-owned. Multiple authorized children render links; one authorized child omits the switcher and names the destination in the heading; zero authorized children omit the primary area. The preview includes explicit simulations for Attendance only, no Timetable, no registration, Directory only, Imports only, no Students and Staff without Access.

Recorded differences from the static reference are intentional and visible: fictional preview records replace its schematic sample only where needed to demonstrate states; current optional School services remain present for the broad simulated profile; the local bundled Inter asset replaces the SVG's Arial authoring label; mobile is a review proposal because Concept 1 defines only 1440×920. No action in the preview calls an owner API.

## Current catalogue and proposed primary location

Navigation visibility is only a convenience. Every destination continues to authorize the current account, tenant/branch, module chain and resource on the server. “Owner probe” means the layout calls the owner read/availability operation and shows the item only when that operation succeeds; it is not a new capability.

| Current configured item | Current group / rendered entry | Route | Current visibility contract | Purpose | Proposed primary location |
|---|---|---|---|---|---|
| Today | Today / Today | `/admin` | `school.manage`; current active institution/branch | Daily summary and attention | **Today** default |
| Students | Daily work / Students | `/admin/students` | `student.read`; `student_core` released, entitled, active | Find and manage Students | **Students** default |
| Admissions | School operations / Admissions | `/admin/admissions` | `admissions.manage`; `admissions` + `student_core` | Admission applications | Students local navigation |
| Imports | School operations / Imports | `/admin/imports` | `student.manage`; `student_core` + `academic_core` | Roster import/reconciliation | Students local navigation |
| Staff profiles | Daily work / merged **Staff** | `/admin/teachers` | `class.manage`; `staff_core` | Employee/Teacher profiles | **Staff** preferred default |
| Staff access | Daily work / merged **Staff** | `/admin/users` | `user.manage` | Membership, invitation and access | Staff local navigation |
| Staff availability | Daily work / merged **Staff** when available | `/admin/teachers/availability` | People owner `recorder(identity, branch-local date)` succeeds | Record dated availability | Staff local navigation |
| Attendance | Daily work / Attendance | `/admin/attendance/sessions` | `attendance.read_school`; `attendance` | Scheduling or monitoring, depending on query | **Attendance** using `?view=monitor` |
| Corrections | Not directly rendered in current section map; catalogue item | `/admin/attendance/correction-requests` | `attendance.correct`; `attendance` | Review assigned correction requests | Attendance local navigation |
| Attendance report | School operations / Attendance report | `/admin/reports/attendance` | `attendance.read_school`; `attendance` | Factual report/export | Attendance local navigation |
| Classes & subjects | Teaching & communication / Classes & subjects | `/admin/academics` | `class.manage`; `academic_core` | Academic setup/catalogue | Academics fallback/local navigation |
| Teacher assignments | Teaching & communication / Teacher assignments | `/admin/classes` | `class.read`; `academic_core` + `staff_core` | Offerings and dated assignments | Academics local navigation |
| Assessments | Teaching & communication / Assessments | `/admin/assessments` | `school.manage`; `assessments` + `academic_core` + `student_core` | Assessment planning/readiness | Academics local navigation |
| Timetable | Daily work / Timetable | `/admin/timetable` | `timetable.manage`; `timetable` + `academic_core` + `staff_core` | Draft/publish/reconcile timetable | **Academics** preferred default |
| Cover coordination | Teaching & communication / Cover coordination | `/admin/timetable/cover` | `timetable.manage`; timetable/academic/staff/attendance modules | Cover lifecycle | Academics local navigation |
| Notices | Teaching & communication / Notices | `/admin/communication` | `communication.publish`; `communication` | Notice publication/proposals | **Communication** preferred default |
| Calendar & events | Teaching & communication / Calendar & events | `/admin/events` | `communication.publish`; communication/academic/student modules | Calendar events | Communication local navigation |
| Requests | School operations when owner queue has categories | `/admin/requests` | Requests owner list succeeds with at least one category | Submitted school requests | Today local work list |
| Assigned follow-ups | School operations when Coordination work is enabled | `/admin/coordination` | Coordination synthetic availability plus `coordination.work` | Assigned follow-up queue | Today local work list |
| Activity | School operations / Activity | `/admin/activity` | `school.manage` | Branch audit/activity | Settings local navigation |
| School settings | School settings / School settings | `/admin/setup` | `school.manage` | Setup readiness and configuration | **Settings** preferred default |
| School details | School settings / School details | `/admin/school` | `school.manage` | Branch identity/details | Settings local navigation |
| Modules | School settings / Modules | `/admin/modules` | `module.configure` plus institution-admin probe | Module activation | Settings local navigation |
| Branding & appearance | School settings / Branding & appearance | `/admin/branding` | `branding.manage` | Published sign-in/theme | Settings local navigation |
| Support procedure | School operations when current procedure is readable | `/admin/support` | Support owner `currentProcedure` succeeds; its module/purpose restrictions remain owner-defined | Restricted support configuration | **Conditional services** direct item |
| Facilities incidents | School operations when owner list is readable | `/admin/services/incidents` | Facilities owner list succeeds; current inventory/module and grant checks | Facilities incident lifecycle | **Conditional services** direct item |
| Financial exceptions | School operations when INR summary is readable | `/admin/finance/exceptions` | Finance owner summary succeeds; current fees/grant/limit checks | Synthetic financial exception lifecycle | **Conditional services** direct item |

Corrections exists in the current catalogue but is not present in any current `adminNavigationSections.hrefs`; the queue remains reachable through Attendance tabs and contextual links. Absence explanations are similarly local-only at `/admin/attendance/explanations`. The proposal keeps both under Attendance rather than adding more primary links.

## Six primary destinations and fallbacks

| Primary item | Preferred landing | Ordered authorized fallback | No eligible child | Active-state paths |
|---|---|---|---|---|
| Today | `/admin` | `/admin/coordination`, `/admin/requests` | Omit if none authorize | `/admin` exact; requests and coordination families |
| Students | `/admin/students` | `/admin/admissions`, `/admin/imports` | Omit | students, admissions and imports families |
| Staff | `/admin/teachers` | `/admin/users`, `/admin/teachers/availability` | Omit | teachers and users families |
| Attendance | `/admin/attendance/sessions?view=monitor` | correction requests, explanations, attendance report | Omit | attendance and attendance-report families |
| Academics | `/admin/timetable` | `/admin/academics`, `/admin/classes`, `/admin/assessments`, `/admin/timetable/cover` | Omit | timetable, academics, classes and assessments families |
| Communication | `/admin/communication` | `/admin/events` | Omit | communication and events families |
| Settings utility | `/admin/setup` | `/admin/school`, `/admin/modules`, `/admin/branding`, `/admin/activity` | Omit | setup, school, modules, branding and activity families |

The server must calculate the first authorized landing from the same live probes used for item visibility. The browser never chooses authority. Nested paths select exactly one primary item; query/hash state remains owned by the destination page. Account (`/account`), branch/workspace context (`/admin/context`) and Sign out remain separate utilities.

Facilities, Finance and restricted Support remain direct, conditional links under a compact **School services** label below the six primary items. This avoids a compulsory hub and preserves their owner-probed visibility. They do not appear for accounts that fail their current probes.

## Proposed local navigation

| Area | Local navigation | Context actions kept off navigation |
|---|---|---|
| Students | Directory; Admissions; Imports | Register student, Enroll student, Move student, Parent/Student access and row-level Manage |
| Staff | Profiles; Access; Availability when authorized | Add staff, invite/grant/change/end access and profile mutations |
| Attendance | Registers; Explanations; Corrections; Report | Schedule session, open/correct/cancel a register, review one request |
| Academics | Timetable; Classes & subjects; Teaching assignments; Assessments; Cover when authorized | Create/publish timetable, catalogue changes, assignment actions and cover decisions |
| Communication | Notices; Calendar | New/publish/withdraw notice and create/revise/cancel event |
| Today | No long tab strip. Compact links to current Requests and Assigned follow-ups when available. | Attention-row actions |
| Settings | Setup; School details; Modules; Appearance; Activity | Versioned save/publish actions |

Existing Attendance tabs already provide Registers, Corrections and Explanations; the production slice would add the authorized report entry. Communication currently uses in-page Notice anchors, while Calendar is separate. Other local navigation must be URL-backed links and must be rendered from the server-filtered destination list.

## Complete route-family ownership

Every current `app/admin/**/page.tsx` destination appears once below. Detail/create/manage routes inherit the active primary location and remain directly deep-linkable.

| Proposed location | Existing route patterns |
|---|---|
| Today | `/admin`; `/admin/requests`, `/admin/requests/new`, `/admin/requests/:id`; `/admin/coordination`, `/admin/coordination/:id` |
| Students | `/admin/students`, `/admin/students/register`, `/admin/students/enroll`, `/admin/students/transfer`, `/admin/students/:id`, `/admin/students/:id/enrollment`; `/admin/admissions`; `/admin/imports`, `/admin/imports/manage`, `/admin/imports/operations` |
| Staff | `/admin/teachers`, `/admin/teachers/create`, `/admin/teachers/availability`; `/admin/users`, `/admin/users/grant`, `/admin/users/change` |
| Attendance | `/admin/attendance/sessions`, `/admin/attendance/sessions/:id`; `/admin/attendance/correction-requests`, `/admin/attendance/correction-requests/:id`; `/admin/attendance/explanations`, `/admin/attendance/explanations/:id`; `/admin/reports/attendance` |
| Academics | `/admin/timetable`, `/admin/timetable/readiness`, `/admin/timetable/cover`, `/admin/timetable/cover/:id`; `/admin/academics`; `/admin/classes`; `/admin/assessments` |
| Communication | `/admin/communication`, `/admin/communication/new`, `/admin/communication/:id/withdraw`, `/admin/communication/proposals/:id`; `/admin/events`, `/admin/events/new`, `/admin/events/:id` |
| Settings | `/admin/setup`; `/admin/school`; `/admin/modules`, `/admin/modules/manage`; `/admin/branding`, `/admin/branding/manage`; `/admin/activity`, `/admin/activity/manage` |
| Conditional services | `/admin/support`; `/admin/services/incidents`, `/admin/services/incidents/new`, `/admin/services/incidents/:id`; `/admin/finance/exceptions`, `/admin/finance/exceptions/new`, `/admin/finance/exceptions/:id` |
| Context utility | `/admin/context` |

## Task paths and navigation activations

Counts include route-changing navigation activations and exclude typing, form fields and consequential confirmation buttons.

| Task | Current path / activations | Proposed path / activations | Observation |
|---|---|---|---|
| Find and register a Student | Students → Register student / 2 | Students → Register student / 2 | Same depth; fewer unrelated sidebar choices |
| Enroll and set up Parent access | Students → Manage Student → Enrollment or Family & access / 3 | Same contextual record path / 3 | No artificial hub |
| Add Staff and manage access | Staff → Add staff or Staff sign-in access / 2 | Staff → Profiles/Access → contextual action / 2–3 | One extra local choice only when switching owner area |
| Monitor today’s Attendance | Attendance → Monitor sessions / 2 because current default schedules | Attendance (`?view=monitor`) / 1 | Corrects the misleading default |
| Review explanation or correction | Attendance → local queue / 2 | Attendance → Explanations/Corrections / 2 | Same depth and clearer ownership |
| Review Timetable | Timetable / 1 | Academics, whose preferred landing is Timetable / 1 | Same depth |
| Publish a notice | Notices → New notice / 2 | Communication → New notice / 2 | Same depth |
| Open assigned follow-up | Assigned follow-ups / 1 | Today → Assigned follow-ups / 2 | One extra navigation activation; accepted only if the Today work list is consistently visible |
| Change school settings | School settings / 1 | Settings / 1 | Same depth |

The proposal reduces first-level choice count, but it does not claim every task becomes shorter. Assigned follow-ups become one activation deeper; production acceptance should verify that Today makes the link immediately discoverable.

## Access-profile evaluation

Only the broad seeded Administrator can be observed without changing grants. The other profiles in the isolated preview are explicitly **simulated from current visibility contracts**, not authenticated authorization evidence.

| Profile | Expected primary navigation | Default/fallback result |
|---|---|---|
| Broad Administrator | All six; Settings; authorized School services | Students directory, Staff profiles, Attendance monitor, Timetable, Notices |
| Attendance-only branch | Attendance; Account; Sign out | Monitor; queue/report fallbacks only when their distinct checks pass |
| No staff-access management | Staff remains if profiles or availability authorize; Access local link omitted | Profiles, then Availability |
| Academics without Timetable | Academics remains | Classes & subjects, then assignments/assessments |
| Communication unavailable | Communication omitted | Deep links still fail closed at the owner |
| Conditional service access | School services shows only successful owner probes | Direct owner route; no hub |
| New school/incomplete setup | Today and Settings when `school.manage`; module areas omitted until activated | Today or Setup; no fabricated empty module links |

## Remaining review decisions and route gaps

1. The exact ordering of `/admin/coordination` and `/admin/requests` inside Today requires no product rule, but the production Today page must expose both only from their current owner probes.
2. The proposed Staff and Settings local navigation does not yet exist as a shared component. It is straightforward presentation work using server-filtered URL links.
3. Attendance must change only the navigation href to `?view=monitor`; the scheduling page remains a contextual **Schedule session** action.
4. There is no empty grouping page to build. A missing preferred child selects the next live authorized route or omits the primary item.
5. Support, Facilities and Finance remain synthetic/conditional according to their current owners. Their presence in this proposal does not authorize production enablement.
6. Owner review is still required for the refined 390px/360px adaptation, including the full-width contextual action and labelled directory cards; the desktop selection does not imply mobile acceptance.
7. Owner review is still required before applying the 218px quiet sidebar and reusable secondary-navigation component to production. The existing production route catalogue and permission projection remain unchanged until then.
8. The broad preview retains current authorized School services although the Concept 1 image does not show them. Production must keep each owner-probed destination unless a separate accepted navigation decision relocates it.

## Bounded production implementation plan

1. Add one transport-neutral navigation-area projection in `lib/server/admin-navigation.ts` that preserves the existing per-destination checks and computes preferred/fallback hrefs plus exact active-match paths.
2. Replace `adminNavigationSections` in `components/workspace-navigation.ts` with the accepted six-primary presentation map and conditional-service group. Keep current route identifiers and icons.
3. Compose URL-backed local navigation through a small shared component consumed by the Students, Staff, Attendance, Academics, Communication and Settings page families. Reuse `workspace-tabs`; do not introduce hubs or permissions.
4. In `app/admin/layout.tsx`, retain every owner probe and Staff merge behavior while mapping eligible children to the accepted primary item. Never cache capability success across a changed account or branch.
5. Focused tests: navigation unit cases for ordering/fallback/active specificity; broad and limited browser profiles; disabled module omission; Attendance monitor default; deep-link Back/Forward; mobile drawer Tab containment, Escape and focus restoration; 1440/900/390/360 layout, sidebar scroll/footer clearance and long-label growth. Representative shared-shell checks cover one Teacher and one Student page.

No production implementation begins until the map and preview are accepted.
