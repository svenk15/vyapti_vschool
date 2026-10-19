# Administrator navigation map

Source: `components/workspace-navigation.ts`, `lib/server/admin-navigation.ts`, `app/admin/layout.tsx`, `components/portal/portal-shell.tsx`. This map changes presentation grouping only.

| Existing destination | Route | New group / label | Visibility retained | Active/local behavior |
|---|---|---|---|---|
| Today | `/admin` | direct **Today** | `school.manage` | exact match |
| Students | `/admin/students` | People / **Students** | `student.read` + Student Core | includes Student child routes |
| Staff profiles; Staff & access; Staff availability | `/admin/teachers`; `/admin/users`; `/admin/teachers/availability` | People / one **Staff** entry | respective profile/access/availability checks | one item matches all three; authorized local tabs select Profiles, Access or Availability |
| Admissions | `/admin/admissions` | People / **Admissions** | `admissions.manage` + Admissions/Student Core | includes contextual admissions states |
| Academics | `/admin/academics` | Teaching / **Classes & subjects** | `class.manage` + Academic Core | route preserved |
| Classes and teachers | `/admin/classes` | Teaching / **Teacher assignments** | `class.read` + Academic/Staff Core | route preserved |
| Timetable | `/admin/timetable` | Teaching / **Timetable** | `timetable.manage` + required modules | most-specific child matching retained |
| Assessment planning | `/admin/assessments` | Teaching / **Assessments** | existing assessment/module designation | destination still rechecks planning authority |
| Cover coordination | `/admin/timetable/cover` | Teaching / **Cover coordination** | existing timetable/module checks | exact child match wins over Timetable |
| Attendance | `/admin/attendance/sessions` | Attendance / **Registers** | `attendance.read_school` + Attendance | includes session details |
| Attendance explanations | `/admin/attendance/explanations` | Attendance / **Explanations** | existing reviewer availability | conditional; detail match included |
| Correction requests | `/admin/attendance/correction-requests` | Attendance local/contextual **Corrections** | exact reviewer/request grants | no sidebar item until a lightweight availability projection exists |
| Communication | `/admin/communication` | Communication / **Notices** | `communication.publish` + Communication | includes authoring/withdrawal/proposal routes |
| Calendar & events | `/admin/events` | Communication / **Calendar & events** | existing Communication/Academic/Student module checks | includes event create/detail |
| My requests | `/admin/requests` | My work / **Requests** | existing Requests availability | conditional |
| Assigned follow-ups | `/admin/coordination` | My work / **Assigned follow-ups** | Coordination availability + `coordination.work` | conditional |
| Reports | `/admin/reports/attendance` | Reports / **Attendance report** | existing Attendance check | route preserved |
| School setup | `/admin/setup` | School administration / **School setup** | `school.manage` | route preserved |
| School settings | `/admin/school` | School administration / **School details** | `school.manage` | route preserved |
| Branch module access | `/admin/modules` | School administration / **Modules** | institution administration + `module.configure` | separate institution scope retained |
| Sign-in branding | `/admin/branding` | School administration / **Branding & appearance** | `branding.manage` | route preserved |
| Imports | `/admin/imports` | School administration / **Imports** | `student.manage` + Student/Academic Core | contextual manage/operations routes retained |
| Branch activity | `/admin/activity` | School administration / **Activity** | `school.manage` | contextual manage route retained |
| Facilities incidents | `/admin/services/incidents` | Additional services / **Facilities incidents** | existing Facilities owner read | conditional synthetic scope |
| Financial exceptions | `/admin/finance/exceptions` | Additional services / **Financial exceptions** | existing Finance summary/read | conditional synthetic scope |
| Support procedure | `/admin/support` | Additional services / **Support procedure** | current Support procedure authority | conditional synthetic scope |

Account remains in the footer, sign out remains separate, and branch/year context remains in the top bar. No Help route exists. Deep links not listed in the sidebar remain reachable from their authorized parent record or queue.

