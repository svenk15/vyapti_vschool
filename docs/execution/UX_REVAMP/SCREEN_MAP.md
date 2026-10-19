# Screen map

Generated from the current working tree on 18 October 2026 and extended for the presentation programme on 19 October 2026. This is an implementation inventory, not a route or capability proposal. Route visibility remains server-filtered and every destination retains its independent owner authorization. M01–M08 mappings point to [the accepted journey scope](../MUST_HAVE_RELEASE/JOURNEYS.md); they do not broaden those journeys. The route table establishes the finite set of 203 current page entry points. The batch overlays below add workflow/state/reference/presentation status without replacing that route source of truth.

## Inventory classifications

- `PRESENTATION_WORK`: a working route/state still needs migration or direct visual evidence.
- `CONFORMING`: its implemented states satisfy the selected production recipe and current evidence.
- `DEFERRED_FUNCTIONALITY`: no working screen exists because the capability is outside the implemented release; it is not a presentation defect and is not added to the 203-route count.
- `PRODUCT_CONTRACT_REQUIRED`: the requested state depends on an unresolved owner/authority rule.
- `VISUAL_SPEC_REQUIRED`: implemented behavior has no exact production reference; the recipe produces a design extension pending human review.

Every route remains engineering-implemented only to the extent recorded by its owning workflow matrix. Route existence does not upgrade a partial workflow. Human acceptance is `PENDING` for every row unless a workflow matrix records explicit user acceptance for that exact state.

## Shared shell inventory

| Route family | Current shell owner | Revamp behavior |
|---|---|---|
| `/admin/**` | `app/admin/layout.tsx`, `components/admin-portal-frame.tsx`, `components/portal/portal-shell.tsx` | Server-resolved branch theme; shared desktop sidebar/mobile drawer |
| `/teacher/**` | `app/teacher/layout.tsx`, `components/teacher-portal-frame.tsx`, `components/portal/portal-shell.tsx` | Server-resolved branch theme; Teacher-authorized navigation |
| `/leadership/**` | `app/leadership/layout.tsx`, `components/principal-portal-frame.tsx`, `components/portal/portal-shell.tsx` | Server-resolved branch theme; Principal-authorized navigation |
| `/family/**` | `components/family-portal-frame.tsx` | Selected authorized child context; preserve bottom navigation and migrate tokens in UX-07 |
| `/student/**` | `components/student-portal-frame.tsx` | Selected authorized Student context; preserve bottom navigation and migrate tokens in UX-07 |
| Public/auth/operator | `app/layout.tsx`, `components/auth-layout.tsx`, route composition | Forest by default; only published branded sign-in resolves school appearance |

The source currently has 203 page routes. Receipt is a supported composition state within owner routes; no standalone route named “receipt” exists, so no route is falsely inventoried as RECEIPT. The page owning the mutation remains responsible for its receipt state.

## UX-11 searchable-directory overlay

| Route | Presentation status | Current query/actions | Reference relationship | Remaining presentation work |
|---|---|---|---|---|
| `/admin/students` | `CONFORMING` | Server search attributes, filters, deterministic sort, signed pagination and one Manage action | Exact Administrator Students reference | None for the verified states; human review remains pending |
| `/admin/teachers` | `CONFORMING_SUPPORTED_SCOPE` | Server name/staff-number search, signed pagination, dedicated Add staff, one Manage dialog preserving category/teaching/binding/end actions | Exact Administrator Staff reference | People has no approved server filter/sort contract; do not add page-local filtering or sorting |
| `/admin/users` | `CONFORMING_DESIGN_EXTENSION` | Cursor-paginated Access directory, dedicated verified-Employee grant, independent invitation and one guarded Manage dialog | Staff/access family; no exact standalone reference | Exact-reference review remains unavailable; human review is pending |

Direct Staff reference/application evidence is in [UX-11 Staff directory](../../evidence/ux-revamp-11-staff-directory-2026-10-19/README.md). The Access-owned extension and shared-consumer captures are in [UX-11 Staff access](../../evidence/ux-revamp-11-staff-access-2026-10-19/README.md). Exact query support controls whether Filters and Sort are rendered; a visual recipe never authorizes client-only sorting of one loaded cursor page.

## Actual routes

| Route | Class | Owning page | Theme behavior | Verification scope |
|---|---|---|---|---|
| `/account/context` | DETAIL | `app/account/context/page.tsx` | Authorized institution theme when context exists; otherwise Forest | M01 |
| `/account` | DETAIL | `app/account/page.tsx` | Authorized institution theme when context exists; otherwise Forest | M01 |
| `/account/review` | DETAIL | `app/account/review/page.tsx` | Authorized institution theme when context exists; otherwise Forest | M01 |
| `/activate` | PUBLIC_AUTH | `app/activate/page.tsx` | Forest until an authorized/published context resolves | M01 |
| `/admin/academics` | DIRECTORY | `app/admin/academics/page.tsx` | Authorized active branch effective theme | M02 |
| `/admin/activity/manage` | DETAIL | `app/admin/activity/manage/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/activity` | DIRECTORY | `app/admin/activity/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/admissions` | DIRECTORY | `app/admin/admissions/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/assessments` | DIRECTORY | `app/admin/assessments/page.tsx` | Authorized active branch effective theme | M07 |
| `/admin/attendance/correction-requests/[id]` | DETAIL | `app/admin/attendance/correction-requests/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/attendance/correction-requests` | DIRECTORY | `app/admin/attendance/correction-requests/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/attendance/explanations/[id]` | DETAIL | `app/admin/attendance/explanations/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/attendance/explanations` | DIRECTORY | `app/admin/attendance/explanations/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/attendance/sessions/[id]` | DETAIL | `app/admin/attendance/sessions/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/attendance/sessions` | DIRECTORY | `app/admin/attendance/sessions/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/branding/manage` | DETAIL | `app/admin/branding/manage/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/branding` | DETAIL | `app/admin/branding/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/classes` | DIRECTORY | `app/admin/classes/page.tsx` | Authorized active branch effective theme | M02 |
| `/admin/communication/[id]/withdraw` | STAGED_FORM | `app/admin/communication/[id]/withdraw/page.tsx` | Authorized active branch effective theme | M05 |
| `/admin/communication/new` | STAGED_FORM | `app/admin/communication/new/page.tsx` | Authorized active branch effective theme | M05 |
| `/admin/communication` | DIRECTORY | `app/admin/communication/page.tsx` | Authorized active branch effective theme | M05 |
| `/admin/communication/proposals/[id]` | DETAIL | `app/admin/communication/proposals/[id]/page.tsx` | Authorized active branch effective theme | M05 |
| `/admin/context` | DETAIL | `app/admin/context/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/coordination/[id]` | DETAIL | `app/admin/coordination/[id]/page.tsx` | Authorized active branch effective theme | M08 |
| `/admin/coordination` | DIRECTORY | `app/admin/coordination/page.tsx` | Authorized active branch effective theme | M08 |
| `/admin/events/[id]` | DETAIL | `app/admin/events/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/events/new` | STAGED_FORM | `app/admin/events/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/events` | DIRECTORY | `app/admin/events/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/finance/exceptions/[id]` | DETAIL | `app/admin/finance/exceptions/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/finance/exceptions/new` | STAGED_FORM | `app/admin/finance/exceptions/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/finance/exceptions` | DIRECTORY | `app/admin/finance/exceptions/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/imports/manage` | DETAIL | `app/admin/imports/manage/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/imports/operations` | DETAIL | `app/admin/imports/operations/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/imports` | DIRECTORY | `app/admin/imports/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/modules/manage` | DETAIL | `app/admin/modules/manage/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/modules` | DIRECTORY | `app/admin/modules/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin` | DASHBOARD | `app/admin/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/reports/attendance` | DIRECTORY | `app/admin/reports/attendance/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/requests/[id]` | DETAIL | `app/admin/requests/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/requests/new` | STAGED_FORM | `app/admin/requests/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/requests` | DIRECTORY | `app/admin/requests/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/school` | DETAIL | `app/admin/school/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/services/incidents/[id]` | DETAIL | `app/admin/services/incidents/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/services/incidents/new` | STAGED_FORM | `app/admin/services/incidents/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/services/incidents` | DIRECTORY | `app/admin/services/incidents/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/setup` | DETAIL | `app/admin/setup/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/students/[id]/enrollment` | DETAIL | `app/admin/students/[id]/enrollment/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/students/[id]` | DETAIL | `app/admin/students/[id]/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/students/enroll` | STAGED_FORM | `app/admin/students/enroll/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/students` | DIRECTORY | `app/admin/students/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/students/register` | STAGED_FORM | `app/admin/students/register/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/students/transfer` | STAGED_FORM | `app/admin/students/transfer/page.tsx` | Authorized active branch effective theme | M03 |
| `/admin/support` | DIRECTORY | `app/admin/support/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/teachers/availability` | DETAIL | `app/admin/teachers/availability/page.tsx` | Authorized active branch effective theme | M02 |
| `/admin/teachers/create` | STAGED_FORM | `app/admin/teachers/create/page.tsx` | Authorized active branch effective theme | M02 |
| `/admin/teachers` | DIRECTORY | `app/admin/teachers/page.tsx` | Authorized active branch effective theme | M02 |
| `/admin/timetable/cover/[id]` | DETAIL | `app/admin/timetable/cover/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/timetable/cover` | DIRECTORY | `app/admin/timetable/cover/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/timetable` | DIRECTORY | `app/admin/timetable/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/timetable/readiness` | DETAIL | `app/admin/timetable/readiness/page.tsx` | Authorized active branch effective theme | M04 |
| `/admin/users/change` | STAGED_FORM | `app/admin/users/change/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/users/grant` | STAGED_FORM | `app/admin/users/grant/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/admin/users` | DIRECTORY | `app/admin/users/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/choose-workspace` | PUBLIC_AUTH | `app/choose-workspace/page.tsx` | Forest until an authorized/published context resolves | M01 |
| `/configure` | DETAIL | `app/configure/page.tsx` | Platform Forest | Shared/deferred regression |
| `/design-system` | DETAIL | `app/design-system/page.tsx` | Platform Forest | Shared/deferred regression |
| `/family/access-unavailable` | DETAIL | `app/family/access-unavailable/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/account` | DETAIL | `app/family/account/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M01 |
| `/family/attendance/corrections/[id]` | DETAIL | `app/family/attendance/corrections/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/family/attendance/corrections/new` | STAGED_FORM | `app/family/attendance/corrections/new/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/family/attendance/explanations/[id]` | DETAIL | `app/family/attendance/explanations/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/family/attendance/explanations/new` | STAGED_FORM | `app/family/attendance/explanations/new/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/family/attendance` | DIRECTORY | `app/family/attendance/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/family/calendar/[id]` | DETAIL | `app/family/calendar/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/calendar` | DIRECTORY | `app/family/calendar/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/children` | DIRECTORY | `app/family/children/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M03 |
| `/family/concerns/[id]` | DETAIL | `app/family/concerns/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/concerns/new` | STAGED_FORM | `app/family/concerns/new/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/concerns` | DIRECTORY | `app/family/concerns/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/invite` | STAGED_FORM | `app/family/invite/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M01, M03 |
| `/family/learning/[id]` | DETAIL | `app/family/learning/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M06 |
| `/family/learning` | DIRECTORY | `app/family/learning/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M06 |
| `/family/meetings/[id]` | DETAIL | `app/family/meetings/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/meetings` | DIRECTORY | `app/family/meetings/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/notices/[id]` | DETAIL | `app/family/notices/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M05 |
| `/family/notices` | DIRECTORY | `app/family/notices/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M05 |
| `/family` | DASHBOARD | `app/family/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/family/results` | DIRECTORY | `app/family/results/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M07 |
| `/family/timetable` | DIRECTORY | `app/family/timetable/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/forgot-password` | PUBLIC_AUTH | `app/forgot-password/page.tsx` | Forest until an authorized/published context resolves | M01 |
| `/institutions` | DETAIL | `app/institutions/page.tsx` | Authorized institution theme when context exists; otherwise Forest | Shared/deferred regression |
| `/invite` | PUBLIC_AUTH | `app/invite/page.tsx` | Forest until an authorized/published context resolves | M01 |
| `/leadership/account` | DETAIL | `app/leadership/account/page.tsx` | Authorized active branch effective theme | M01 |
| `/leadership/assessments` | DIRECTORY | `app/leadership/assessments/page.tsx` | Authorized active branch effective theme | M07 |
| `/leadership/assessments/publications` | DETAIL | `app/leadership/assessments/publications/page.tsx` | Authorized active branch effective theme | M07 |
| `/leadership/assistant/[id]` | DETAIL | `app/leadership/assistant/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/assistant/new` | STAGED_FORM | `app/leadership/assistant/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/assistant` | DETAIL | `app/leadership/assistant/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/attendance/correction-requests` | DIRECTORY | `app/leadership/attendance/correction-requests/page.tsx` | Authorized active branch effective theme | M04 |
| `/leadership/attendance/explanations/[id]` | DETAIL | `app/leadership/attendance/explanations/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/leadership/attendance/explanations` | DIRECTORY | `app/leadership/attendance/explanations/page.tsx` | Authorized active branch effective theme | M04 |
| `/leadership/attendance` | DIRECTORY | `app/leadership/attendance/page.tsx` | Authorized active branch effective theme | M04 |
| `/leadership/attendance/pupils` | DETAIL | `app/leadership/attendance/pupils/page.tsx` | Authorized active branch effective theme | M04 |
| `/leadership/attendance/sessions/[id]` | DETAIL | `app/leadership/attendance/sessions/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/leadership/briefs/[id]/edit` | STAGED_FORM | `app/leadership/briefs/[id]/edit/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/briefs/[id]` | DETAIL | `app/leadership/briefs/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/briefs/new` | STAGED_FORM | `app/leadership/briefs/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/communication/[id]/remind` | DETAIL | `app/leadership/communication/[id]/remind/page.tsx` | Authorized active branch effective theme | M05 |
| `/leadership/communication` | DIRECTORY | `app/leadership/communication/page.tsx` | Authorized active branch effective theme | M05 |
| `/leadership/concerns/[id]` | DETAIL | `app/leadership/concerns/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/concerns` | DIRECTORY | `app/leadership/concerns/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/context` | DETAIL | `app/leadership/context/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/coordination/[id]` | DETAIL | `app/leadership/coordination/[id]/page.tsx` | Authorized active branch effective theme | M08 |
| `/leadership/coordination/batches/[id]` | DETAIL | `app/leadership/coordination/batches/[id]/page.tsx` | Authorized active branch effective theme | M08 |
| `/leadership/coordination/bulk` | DETAIL | `app/leadership/coordination/bulk/page.tsx` | Authorized active branch effective theme | M08 |
| `/leadership/coordination/new` | STAGED_FORM | `app/leadership/coordination/new/page.tsx` | Authorized active branch effective theme | M08 |
| `/leadership/coordination` | DIRECTORY | `app/leadership/coordination/page.tsx` | Authorized active branch effective theme | M08 |
| `/leadership/cover/[id]` | DETAIL | `app/leadership/cover/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/cover` | DIRECTORY | `app/leadership/cover/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/decisions/[owner]/[id]` | DETAIL | `app/leadership/decisions/[owner]/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/decisions` | DIRECTORY | `app/leadership/decisions/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/decisions/routing` | DETAIL | `app/leadership/decisions/routing/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/delegations` | DIRECTORY | `app/leadership/delegations/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/finance/exceptions/[id]` | DETAIL | `app/leadership/finance/exceptions/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/finance/exceptions/new` | STAGED_FORM | `app/leadership/finance/exceptions/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/finance/exceptions` | DIRECTORY | `app/leadership/finance/exceptions/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/handover/[id]` | DETAIL | `app/leadership/handover/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/handover` | DIRECTORY | `app/leadership/handover/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/history` | DIRECTORY | `app/leadership/history/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/learning/concerns/new` | STAGED_FORM | `app/leadership/learning/concerns/new/page.tsx` | Authorized active branch effective theme | M06 |
| `/leadership/learning/evidence` | DETAIL | `app/leadership/learning/evidence/page.tsx` | Authorized active branch effective theme | M06 |
| `/leadership/learning/feedback/follow-up/new` | STAGED_FORM | `app/leadership/learning/feedback/follow-up/new/page.tsx` | Authorized active branch effective theme | M06 |
| `/leadership/learning/feedback` | DETAIL | `app/leadership/learning/feedback/page.tsx` | Authorized active branch effective theme | M06 |
| `/leadership/learning` | DIRECTORY | `app/leadership/learning/page.tsx` | Authorized active branch effective theme | M06 |
| `/leadership/meetings/[id]` | DETAIL | `app/leadership/meetings/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/meetings/new` | STAGED_FORM | `app/leadership/meetings/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/meetings` | DIRECTORY | `app/leadership/meetings/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/notices/review/[id]` | DETAIL | `app/leadership/notices/review/[id]/page.tsx` | Authorized active branch effective theme | M05 |
| `/leadership/notices/review` | DETAIL | `app/leadership/notices/review/page.tsx` | Authorized active branch effective theme | M05 |
| `/leadership` | DASHBOARD | `app/leadership/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/reports/communication` | DIRECTORY | `app/leadership/reports/communication/page.tsx` | Authorized active branch effective theme | M05 |
| `/leadership/reports/compare` | DETAIL | `app/leadership/reports/compare/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/reports/feedback` | DETAIL | `app/leadership/reports/feedback/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/reports/learning` | DIRECTORY | `app/leadership/reports/learning/page.tsx` | Authorized active branch effective theme | M06 |
| `/leadership/reports` | DIRECTORY | `app/leadership/reports/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/reports/snapshots/[id]` | DETAIL | `app/leadership/reports/snapshots/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/reports/snapshots` | DIRECTORY | `app/leadership/reports/snapshots/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/reports/timetable` | DIRECTORY | `app/leadership/reports/timetable/page.tsx` | Authorized active branch effective theme | M04 |
| `/leadership/reviews/new` | STAGED_FORM | `app/leadership/reviews/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/services/incidents/[id]` | DETAIL | `app/leadership/services/incidents/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/services/incidents/new` | STAGED_FORM | `app/leadership/services/incidents/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/services/incidents` | DIRECTORY | `app/leadership/services/incidents/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/staff/availability` | DETAIL | `app/leadership/staff/availability/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/staff/requests/[id]` | DETAIL | `app/leadership/staff/requests/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/staff/requests` | DIRECTORY | `app/leadership/staff/requests/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/support` | DIRECTORY | `app/leadership/support/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/support/referrals/[id]` | DETAIL | `app/leadership/support/referrals/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/support/referrals/new` | STAGED_FORM | `app/leadership/support/referrals/new/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/support/urgent` | DETAIL | `app/leadership/support/urgent/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/leadership/timetable` | DIRECTORY | `app/leadership/timetable/page.tsx` | Authorized active branch effective theme | M04 |
| `/` | PUBLIC_AUTH | `app/page.tsx` | Forest until an authorized/published context resolves | Shared/deferred regression |
| `/reset-password` | PUBLIC_AUTH | `app/reset-password/page.tsx` | Forest until an authorized/published context resolves | M01 |
| `/sign-in/[school]` | PUBLIC_AUTH | `app/sign-in/[school]/page.tsx` | Published school effective theme; unknown/unpublished fails generically | M01 |
| `/sign-in` | PUBLIC_AUTH | `app/sign-in/page.tsx` | Forest until an authorized/published context resolves | M01 |
| `/student/access-unavailable` | DETAIL | `app/student/access-unavailable/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/student/account` | DETAIL | `app/student/account/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M01 |
| `/student/account/sessions` | DIRECTORY | `app/student/account/sessions/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M01 |
| `/student/assignments/[id]` | DETAIL | `app/student/assignments/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M06 |
| `/student/assignments` | DIRECTORY | `app/student/assignments/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M06 |
| `/student/attendance/corrections/[id]` | DETAIL | `app/student/attendance/corrections/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/student/attendance/corrections/new` | STAGED_FORM | `app/student/attendance/corrections/new/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/student/attendance` | DIRECTORY | `app/student/attendance/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/student/calendar/[id]` | DETAIL | `app/student/calendar/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/student/calendar` | DIRECTORY | `app/student/calendar/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/student/classes/[id]` | DETAIL | `app/student/classes/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M02 |
| `/student/classes` | DIRECTORY | `app/student/classes/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M02 |
| `/student/invite` | STAGED_FORM | `app/student/invite/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M01, M03 |
| `/student/notices/[id]` | DETAIL | `app/student/notices/[id]/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M05 |
| `/student/notices` | DIRECTORY | `app/student/notices/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M05 |
| `/student` | DASHBOARD | `app/student/page.tsx` | Selected authorized child/Student school theme; Forest before selection | Shared/deferred regression |
| `/student/profile` | DETAIL | `app/student/profile/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M03 |
| `/student/results` | DIRECTORY | `app/student/results/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M07 |
| `/student/timetable` | DIRECTORY | `app/student/timetable/page.tsx` | Selected authorized child/Student school theme; Forest before selection | M04 |
| `/teacher/assessments` | DIRECTORY | `app/teacher/assessments/page.tsx` | Authorized active branch effective theme | M07 |
| `/teacher/attendance/corrections/[id]` | DETAIL | `app/teacher/attendance/corrections/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/teacher/attendance/corrections/new` | STAGED_FORM | `app/teacher/attendance/corrections/new/page.tsx` | Authorized active branch effective theme | M04 |
| `/teacher/classes/[id]` | DETAIL | `app/teacher/classes/[id]/page.tsx` | Authorized active branch effective theme | M02 |
| `/teacher/classes` | DIRECTORY | `app/teacher/classes/page.tsx` | Authorized active branch effective theme | M02 |
| `/teacher/cover/[id]` | DETAIL | `app/teacher/cover/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/cover` | DIRECTORY | `app/teacher/cover/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/history` | DIRECTORY | `app/teacher/history/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/learning/[id]` | DETAIL | `app/teacher/learning/[id]/page.tsx` | Authorized active branch effective theme | M06 |
| `/teacher/learning/[id]/submissions/[submissionId]` | DETAIL | `app/teacher/learning/[id]/submissions/[submissionId]/page.tsx` | Authorized active branch effective theme | M06 |
| `/teacher/learning/new` | STAGED_FORM | `app/teacher/learning/new/page.tsx` | Authorized active branch effective theme | M06 |
| `/teacher/learning` | DIRECTORY | `app/teacher/learning/page.tsx` | Authorized active branch effective theme | M06 |
| `/teacher/meetings/[id]` | DETAIL | `app/teacher/meetings/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/meetings` | DIRECTORY | `app/teacher/meetings/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/readiness` | DETAIL | `app/teacher/readiness/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/sessions/[id]` | DETAIL | `app/teacher/sessions/[id]/page.tsx` | Authorized active branch effective theme | M04 |
| `/teacher/support` | DIRECTORY | `app/teacher/support/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/support/referrals/[id]` | DETAIL | `app/teacher/support/referrals/[id]/page.tsx` | Authorized active branch effective theme | Shared/deferred regression |
| `/teacher/timetable` | DIRECTORY | `app/teacher/timetable/page.tsx` | Authorized active branch effective theme | M04 |
| `/teacher/today` | DASHBOARD | `app/teacher/today/page.tsx` | Authorized active branch effective theme | M04 |

## Verification matrix

- UX-02 verifies shared primitives/gallery in all four themes and records computed font/token values.
- UX-05 verifies public versus protected first paint, publication boundaries, and context changes.
- UX-06 prioritizes Administrator M01–M08 routes; UX-07 covers the corresponding Teacher, Student, Parent/Guardian, and Principal routes.
- Exact production references are compared directly at 1440×1000 and 390×844. Explorer-only references are labelled shared-pattern reviews. Intermediate layouts are checked at 1024px and 768px.
- Shared-shell changes require representative regression coverage for each consuming workspace. Deferred/bespoke screens must remain readable in every theme and are recorded as debt rather than silently redesigned.

## Presentation batch overlay

The [production recipes](PAGE_RECIPES.md) define component order and responsive behavior. This overlay is updated one verified route family at a time so the route inventory remains finite and reviewable.

### Workspace dashboards

| Workspace / workflow | Route and entry | Owner | Reference state | Implemented states | Theme/context | Engineering | Visual status | Human | Remaining presentation gap |
|---|---|---|---|---|---|---|---|---|---|
| Administrator / shared operational home | `/admin`; authorized role landing and Today navigation | `app/admin/page.tsx` | User-approved Refined Forest composition; exact Administrator landing specification | Populated summaries, attention, sessions, setup readiness; projection unavailable/empty states remain owner-specific | Active authorized branch | VERIFIED | CONFORMING at desktop/mobile/intermediate and four themes | PENDING | Calendar omitted because no authorized event projection exists |
| Teacher / TEA-05 | `/teacher/today`; Teacher role landing and My teaching day | `components/teacher-sessions.tsx` | Teacher pack `today`, populated and empty | Populated, date change, empty, request failure, scheduled/open/submitted actions | Active authorized branch and school-local date | VERIFIED | CONFORMING specialized dashboard; direct exact comparison retained | PENDING | Native browser zoom and assistive-technology evidence remain release gates |
| Parent / PAR-07–PAR-08 | `/family?child=…`; Family role landing and child switch | `app/family/page.tsx` | Parent pack family overview for the selected accepted child | Selected child, multiple authorized contexts, sparse fixed-bundle summary, withdrawn-access route | Selected accepted child context | VERIFIED | CORRECTED_TO_RECIPE; exact comparison required for this checkpoint | PENDING | Prototype-only unowned summaries remain intentionally absent |
| Student / STW-06 | `/student?student=…`; Student role landing and context switch | `app/student/page.tsx` | Student pack day overview | Due work, draft, feedback, next class, no-more-classes, owner-projection unavailable | Selected accepted Student context | VERIFIED_SUPPORTED_SLICE | CORRECTED_TO_RECIPE; exact comparison required for this checkpoint | PENDING | Room/change/request priorities wait for their owner projections |
| Principal / LEA-01–LEA-07 home slice | `/leadership`; Principal role landing and My day | `app/leadership/page.tsx` | Principal workflow explorer and first-release evidence requirements; no exact production page | Attendance populated/unavailable and acting-delegation notice | Active authorized branch | VERIFIED_SUPPORTED_SLICE | DESIGN_EXTENSION_CORRECTED_TO_RECIPE; direct pattern review required | PENDING | Only currently available owner summaries are shown; no inferred cross-owner metrics |

Dashboard action surfaces are part of these rows: Administrator attention/session links, Teacher date toolbar and session actions, Parent child selector and common actions, Student priority actions/context selector, Principal Attendance and context/account links. Their destinations independently authorize every read or command.

### Searchable directories

| Workspace / workflow | Route and entry | Owner | Reference state | Implemented states | Theme/context | Engineering | Visual status | Human | Remaining presentation gap |
|---|---|---|---|---|---|---|---|---|---|
| Administrator / Staff profiles | `/admin/teachers`; People & access | `app/admin/teachers/page.tsx`, `components/staff-admin.tsx` | Exact Administrator Staff directory | Populated/empty search, responsive rows, Manage dialog and authorized mutations | Active authorized branch | VERIFIED | CONFORMING_SUPPORTED_SCOPE; exact desktop/mobile comparison | PENDING | Owner exposes name search but no approved server filter/sort query |
| Administrator / Staff access | `/admin/users`; People & access | `app/admin/users/page.tsx`, `components/membership-admin.tsx` | No standalone exact reference; shared directory/dialog recipe | Cursor directory, grant, independent invitation, per-row Manage, delivery recovery | Active authorized institution/branch | VERIFIED | DESIGN_EXTENSION_DIRECTLY_INSPECTED desktop/mobile | PENDING | Exact reference unavailable |
| Administrator / Attendance sessions | `/admin/attendance/sessions?view=monitor`; Attendance | `app/admin/attendance/sessions/page.tsx`, `components/attendance-admin-list.tsx` | Exact Administrator `#/attendance` directory | Date/class filtering, populated/empty sessions, state-specific review/correct/cancel links, responsive semantic rows | Active authorized branch and school-local date | VERIFIED | CONFORMING_SUPPORTED_SCOPE; exact desktop/mobile comparison | PENDING | Owner query lacks prototype subject search, sort, summary denominators and pagination; session record lacks Teacher field |
| Administrator / Attendance correction requests | `/admin/attendance/correction-requests`; authorized reviewer entry | `app/admin/attendance/correction-requests/page.tsx` | No exact production queue reference | Assigned populated/empty, exact-source ready/changed states and review entry | Active authorized branch and explicit reviewer grant | VERIFIED | DESIGN_EXTENSION_DIRECTLY_INSPECTED desktop/mobile | PENDING | Native accessibility and human review remain |
| Administrator / Absence explanations | `/admin/attendance/explanations`; Attendance tab | `app/admin/attendance/explanations/page.tsx` | Attendance module tabs plus SA-29 review workflow; no exact production queue page | Populated/empty, guardian-purpose-scoped records and review entry | Active authorized branch and current reviewer authority | VERIFIED | DESIGN_EXTENSION_DIRECTLY_INSPECTED desktop/mobile | PENDING | Queue composition uses shared recipe; exact reference exists only for the detail workflow |

### Remaining recipe queues

| Batch | Current classification | Next representative | Notes |
|---|---|---|---|
| Searchable directories | IN_PROGRESS; Students, Staff, Access and Attendance directory/queue families have direct current evidence | Next implemented M01–M08 directory family from the finite inventory | URL/query and owner pagination support must be inspected per route |
| Record detail/history | PRESENTATION_WORK | `/admin/students/[id]` | Preserve current owner tabs/actions and immutable history |
| Staged forms/review/receipt | MIXED: several conforming, remaining presentation work | Student registration and Attendance correction are conforming representatives | Missing durable draft contracts remain functional scope, not visual debt |
| Timetable/Attendance/assessment | MIXED specialized surfaces | Teacher Attendance and published timetable | Never replace specialized interactions with a generic table |
| Settings/public entry | PRESENTATION_WORK plus explicit backend compatibility tasks | `/admin/school`, `/sign-in/[school]` | Browser institution creation, Porcelain publication and real sign-in evidence remain separate tasks |
