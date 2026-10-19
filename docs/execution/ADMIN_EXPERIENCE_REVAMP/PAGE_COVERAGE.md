# Administrator page coverage

Status values describe this presentation programme only. `DIRECT VERIFIED` means a matched rendered inspection exists for the current source; `SHARED VERIFIED` means the route consumes a directly inspected shared composition; `PENDING` means it is inventoried and still requires this programme's direct inspection. Functional owner status remains in the authoritative workflow matrix/current-state document.

| Route(s) | Workflow / owner | Pattern | Current presentation status | Authority / notes |
|---|---|---|---|---|
| `/admin` | SA-01 / home | dashboard | DIRECT VERIFIED for revised shell/navigation at four widths; landing composition retains prior direct evidence | school management scope |
| `/admin/students` | SA-06/07 / Students | directory | DIRECT VERIFIED at four widths plus focused browser interactions | server search/filter/sort/cursor |
| `/admin/students/[id]` | SA-18–22 / Students | record + local sections | DIRECT VERIFIED main composition at four widths; local sections retain prior owner evidence | Student scope; independent guardian/portal grants |
| `/admin/students/register` | SA-18 / Students | staged form + receipt | DIRECT VERIFIED entry at four widths; connected reference covers stages/receipt; production mutation evidence reused | final-only owner command/replay |
| `/admin/students/enroll`; `/admin/students/[id]/enrollment` | SA-19 / Students | selection + staged form | PENDING | authorized Student and Academics reads |
| `/admin/students/transfer` | SA-21 / Students | staged form + receipt | prior direct comparison; PENDING current shell | frozen Attendance constraints retained |
| `/admin/teachers`; `/admin/teachers/create` | SA-11+ / People | directory + staged form | DIRECT VERIFIED directory at desktop/mobile; create flow retains prior owner evidence | `class.manage` + Staff Core |
| `/admin/users`; `/admin/users/grant`; `/admin/users/change` | SA-13/14 / Access | directory + staged forms | DIRECT VERIFIED directory at desktop/mobile; staged flows retain prior owner evidence | `user.manage`; independent Access guards |
| `/admin/teachers/availability` | People availability | operational table/form | DIRECT VERIFIED at desktop/mobile | recorder availability projection |
| `/admin/setup`; `/admin/school` | settings | settings/checklist | DIRECT VERIFIED at desktop/mobile | `school.manage`; unsupported draft action removed |
| `/admin/modules`; `/admin/modules/manage` | tenancy | settings/staged command | PENDING | institution admin + module configure |
| `/admin/branding`; `/admin/branding/manage` | branding | settings/preview/publish | PENDING | branding authority; four-theme SSR retained |
| `/admin/activity`; `/admin/activity/manage` | platform | directory/detail | PENDING | safe allowlisted evidence only |
| `/admin/academics`; `/admin/classes` | academics | directory/settings | DIRECT VERIFIED at desktop/mobile | class manage/read plus modules; long setup page remains content-driven |
| `/admin/assessments` | assessments | directory/planning entry | DIRECT VERIFIED at desktop/mobile; primary planning action moved into page header | exact planning designation retained |
| `/admin/timetable`; `/admin/timetable/readiness` | TT-01–04 / timetable | settings/grid/review | DIRECT VERIFIED current shell at desktop/mobile; owner mutation evidence reused | immutable version/publication contracts; functional draft save retained |
| `/admin/timetable/cover`; `/admin/timetable/cover/[id]` | TT-05+ / timetable | queue/detail | DIRECT VERIFIED populated queue at desktop/mobile; detail retains prior owner evidence | existing cover authority only; mobile overflow corrected |
| `/admin/attendance/sessions`; `/admin/attendance/sessions/[id]` | SA-23–27 / Attendance | directory/detail/staged correction | DIRECT VERIFIED populated directory/scheduling entry at desktop/mobile; prior staged detail evidence retained | frozen roster, cancellation and correction guards |
| `/admin/attendance/explanations`; `/admin/attendance/explanations/[id]` | LEA-13 counterpart / Attendance | queue/detail | DIRECT VERIFIED populated queue at desktop/mobile; detail evidence retained | named reviewer availability and protected text |
| `/admin/attendance/correction-requests`; `/admin/attendance/correction-requests/[id]` | LEA-14 counterpart / Attendance | queue/detail | DIRECT VERIFIED empty queue at desktop/mobile; detail evidence retained | authorized navigation now uses `attendance.correct` |
| `/admin/reports/attendance` | reporting | report/export | DIRECT VERIFIED populated report at desktop/mobile | server reauthorization and safe CSV; mobile results use labelled records |
| `/admin/communication`; `/admin/communication/new`; `/admin/communication/[id]/withdraw`; `/admin/communication/proposals/[id]` | SA communication / Communication | directory/staged/detail | DIRECT VERIFIED directory/compose at desktop/mobile; lifecycle details retain prior owner evidence | publish/review/withdraw owner checks; requests remain under My work |
| `/admin/events`; `/admin/events/new`; `/admin/events/[id]` | Calendar/events | directory/staged/detail | DIRECT VERIFIED directory/create at desktop/mobile; detail retains prior owner evidence | current Communication/calendar scope |
| `/admin/admissions` | SA-38 / Admissions | directory/application entry | PENDING | implemented application scope only |
| `/admin/imports`; `/admin/imports/manage`; `/admin/imports/operations` | SA-23/24 / Imports | directory/wizard/recovery | PENDING | preview revision/hash/version preserved |
| `/admin/requests`; `/admin/requests/new`; `/admin/requests/[id]` | Requests | directory/staged/detail | PENDING | originator/category authority |
| `/admin/coordination`; `/admin/coordination/[id]` | Coordination counterparts | queue/detail | PENDING | assignment never substitutes source authority |
| `/admin/services/incidents`; `/admin/services/incidents/new`; `/admin/services/incidents/[id]` | LEA-44 counterpart / Facilities | queue/staged/detail | PENDING | conditional synthetic scope |
| `/admin/finance/exceptions`; `/admin/finance/exceptions/new`; `/admin/finance/exceptions/[id]` | LEA-43 counterpart / Finance | queue/staged/detail | PENDING | conditional synthetic scope; no payment |
| `/admin/support` | Support configuration | settings | PENDING | conditional synthetic scope |
| `/admin/context` | Access/context | context switch | PENDING | validated server context and staged exit |
| `/institutions` | institution administration | directory/create | PENDING | authorized institution-level destination; separate scope |

The connected reference `/design-system/admin-reference` is not a business route and never upgrades an owner workflow status.

