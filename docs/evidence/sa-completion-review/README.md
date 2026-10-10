# School Administrator completion review

Review date: 10 October 2026. Human review: **PENDING**.

## Executive status

The approved Edition 03 catalog contains 63 unique School Administrator workflows, numbered SA-01 through SA-63 with no duplicate IDs. The catalog itself assigns 29 workflows to Phase 1. The Bible and approved PRODUCT_SCOPE explicitly defer the remaining 34 workflows to roadmap phases 2–7; those entries remain preserved rather than renumbered or treated as implementation tasks.

The earlier statement “28 eligible workflows are verified” is not defensible against the complete approved workflow bodies. This review finds:

| Primary status | Count | Meaning |
|---|---:|---|
| `IMPLEMENTED_AND_VERIFIED` | 22 | The approved Phase 1 objective has a live owner path and applicable automated evidence. |
| `PARTIALLY_IMPLEMENTED` | 6 | A useful real subset works, but an approved field, authority distinction or identity-selection path is absent. |
| `BLOCKED_BY_PRODUCT_DECISION` | 1 | SA-08 status/activation works; commercial request submission lacks an approved authority/lifecycle contract. |
| `OUT_OF_CURRENT_RELEASE` | 34 | The catalog assigns these workflows to phases 2–7 and the Bible explicitly excludes those modules from Phase 1. |
| Implemented but insufficiently verified / not implemented / dependency-blocked | 0 | No workflow uses these as its primary status after reconciliation. |

All human acceptance remains PENDING. The local synthetic demo remains useful for the implemented subset, but the Administrator batch is **partially complete**, not fully complete, and this review does not claim production readiness.

## Source and working-tree reconciliation

- Current branch: `work/stu-01-after-per02-wip`.
- Current HEAD at review start: `b52d42ae514de066347d509eb69444cf7e98c2e5`.
- Reported executable commit: `6f8983b1927d84380d727ec48185a9c0877f52e0`.
- `b52d42a` adds only completion evidence/status documentation after `6f8983b`; application behavior is unchanged.
- The running server was built from `6f8983b`, build ID `tDMy-XWMd8-r3fMVELDHx`, and responds ready at `http://127.0.0.1:3400/api/health`.
- The server uses `VSCHOOL_RELEASED_MODULES=academic_core,attendance,staff_core,student_core`. Starting without this documented manifest makes protected module workspaces fail closed.
- Pre-existing untracked `.puku-cli/`, `docs/references/` and `readiness-review.diff` were preserved and excluded from review commits.

## Why 29 workflows are Phase 1

The catalog's own `phase` property assigns Phase 1 to SA-01–SA-21 except SA-22, SA-23–SA-28, SA-30 and SA-62: 29 unique IDs. SA-22 is Phase 3, SA-29 and SA-31 are Phase 2, and SA-32–SA-61/SA-63 follow their recorded phases. This matches PRODUCT_SCOPE's Phase 1 delivery map and the Bible's explicit exclusions. Eligibility therefore comes from approved phase metadata and canonical release decisions, not from which pages happen to exist.

## Full workflow reconciliation

The approved interactive HTML supplies one review wizard per stable SA ID plus richer page compositions. Supporting documents add variants/states to those same IDs; they do not create additional workflows. The table gives every workflow one primary implementation status. Visual review and human acceptance remain secondary evidence.

| ID | Approved objective | Phase / owner | Route / entry | Primary status | Evidence or deferment | Human |
|---|---|---|---|---|---|---|
| SA-01 | Sign in and choose a branch | 1 / home | `/sign-in`, `/sign-in/[school]`, `/account`, `/activate`, `/invite`, `/forgot-password`, `/reset-password` | IMPLEMENTED_AND_VERIFIED | `test/e2e/access.spec.ts`, `branding.spec.ts`, `iam04.spec.ts`; `docs/evidence/ex-04/README.md` | PENDING |
| SA-02 | Activate or recover an account | 1 / home | `/sign-in`, `/sign-in/[school]`, `/account`, `/activate`, `/invite`, `/forgot-password`, `/reset-password` | IMPLEMENTED_AND_VERIFIED | `test/e2e/access.spec.ts`, `branding.spec.ts`, `iam04.spec.ts` | PENDING |
| SA-03 | Switch branch or sign out | 1 / home | `/sign-in`, `/sign-in/[school]`, `/account`, `/activate`, `/invite`, `/forgot-password`, `/reset-password` | IMPLEMENTED_AND_VERIFIED | `test/e2e/access.spec.ts`, `branding.spec.ts`, `iam04.spec.ts`; `docs/evidence/ex-04/README.md` | PENDING |
| SA-04 | Complete first-use setup | 1 / home | `/admin`, `/admin/setup`, `/admin/school`, `/admin/branding`, `/admin/modules` | PARTIALLY_IMPLEMENTED | Derived readiness and source links work; approved responsible-role assignment has no contract or persistence. | PENDING |
| SA-05 | Resolve a daily exception | 1 / home | `/admin`, `/admin/setup`, `/admin/school`, `/admin/branding`, `/admin/modules` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/sa-comp-01/README.md`; unit, PostgreSQL and desktop/mobile browser evidence | PENDING |
| SA-06 | Edit branch information | 1 / settings | `/admin`, `/admin/setup`, `/admin/school`, `/admin/branding`, `/admin/modules` | PARTIALLY_IMPLEMENTED | Name, immutable timezone and campuses work; approved office email/phone/address/reason and stale comparison are absent. | PENDING |
| SA-07 | Review branding and school sign-in | 1 / settings | `/admin`, `/admin/setup`, `/admin/school`, `/admin/branding`, `/admin/modules` | PARTIALLY_IMPLEMENTED | Preview/publish works for the fixed SCHOOL_ADMIN grant; separate branding.read/request-update delegation is not representable. | PENDING |
| SA-08 | Review modules and request a capability | 1 / settings | `/admin/modules` | BLOCKED_BY_PRODUCT_DECISION | Status/activation works; commercial-request authority/lifecycle is unresolved. | PENDING |
| SA-09 | Create an academic year and calendar | 1 / academics | `/admin/academics`, `/admin/classes` | IMPLEMENTED_AND_VERIFIED | Academics PostgreSQL/browser tests; `docs/evidence/ex-07/README.md` | PENDING |
| SA-10 | Configure grades, sections and subjects | 1 / academics | `/admin/academics`, `/admin/classes` | IMPLEMENTED_AND_VERIFIED | Unit plus real PostgreSQL replay/cascade/blocking and desktop/mobile browser evidence; `docs/evidence/sa-comp-02/README.md` | PENDING |
| SA-11 | Create an offering and assign a teacher | 1 / academics | `/admin/academics`, `/admin/classes` | IMPLEMENTED_AND_VERIFIED | Academics PostgreSQL/browser tests; `docs/evidence/ex-07/README.md` | PENDING |
| SA-12 | Change calendar or teaching assignment | 1 / academics | `/admin/academics`, `/admin/classes` | IMPLEMENTED_AND_VERIFIED | Academics PostgreSQL/browser tests; `docs/evidence/ex-07/README.md` | PENDING |
| SA-13 | Create a staff profile | 1 / staff | `/admin/users`, `/admin/teachers` | PARTIALLY_IMPLEMENTED | Person/Employee creation works; approved staff-category field and lifecycle meaning are absent. | PENDING |
| SA-14 | Grant staff sign-in access | 1 / staff | `/admin/users`, `/admin/teachers` | PARTIALLY_IMPLEMENTED | Membership/invite works; it is not initiated from a selected Employee and does not collect the approved identity verification reference. | PENDING |
| SA-15 | Review invitation or resend access | 1 / staff | `/admin/users`, `/admin/teachers` | IMPLEMENTED_AND_VERIFIED | Access PostgreSQL token lifecycle and desktop/mobile recovery; `docs/evidence/sa-comp-03/README.md` | PENDING |
| SA-16 | Verify a staff identity and teacher eligibility | 1 / staff | `/admin/users`, `/admin/teachers` | IMPLEMENTED_AND_VERIFIED | People PostgreSQL/browser tests; `docs/evidence/ex-06/README.md` | PENDING |
| SA-17 | Change or revoke staff access | 1 / staff | `/admin/users`, `/admin/teachers` | IMPLEMENTED_AND_VERIFIED | Access PostgreSQL/browser tests; `docs/evidence/ex-06/README.md` | PENDING |
| SA-18 | Register a student manually | 1 / students | `/admin/students`, `/admin/students/[id]` | PARTIALLY_IMPLEMENTED | New-Person registration works; existing-Person lookup uses exact display name instead of approved person-ID or branch-owned admission resolution. | PENDING |
| SA-19 | Enroll and place a student | 1 / students | `/admin/students`, `/admin/students/[id]` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-08/README.md`; enrollment dates, scope, replay, concurrency and browser history | PENDING |
| SA-20 | Review or update a student record | 1 / students | `/admin/students`, `/admin/students/[id]` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/sa-comp-04/README.md`; unit, PostgreSQL migration/scope/replay/rollback/concurrency and desktop/mobile browser evidence | PENDING |
| SA-21 | Move a student to another section | 1 / students | `/admin/students`, `/admin/students/[id]` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-08/README.md`; effective-date transfer, frozen-session impact, stale/scope and preserved timeline | PENDING |
| SA-22 | Promote, transfer or leave school | 3 / students | `/admin/students`, `/admin/students/[id]` | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-23 | Preview a roster import | 1 / imports | `/admin/imports` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-09/README.md`; Imports PostgreSQL/browser tests | PENDING |
| SA-24 | Confirm, resume and reconcile an import | 1 / imports | `/admin/imports` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-09/README.md`; Imports PostgreSQL/browser tests | PENDING |
| SA-25 | Schedule attendance sessions | 1 / attendance | `/admin/attendance/sessions`, `/admin/attendance/sessions/[id]` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-10/README.md`; Attendance PostgreSQL/browser tests | PENDING |
| SA-26 | Monitor and inspect attendance | 1 / attendance | `/admin/attendance/sessions`, `/admin/attendance/sessions/[id]` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-10/README.md`; Attendance PostgreSQL/browser tests | PENDING |
| SA-27 | Correct submitted attendance | 1 / attendance | `/admin/attendance/sessions`, `/admin/attendance/sessions/[id]` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-10/README.md`; Attendance PostgreSQL/browser tests | PENDING |
| SA-28 | Cancel or review a session change | 1 / attendance | `/admin/attendance/sessions`, `/admin/attendance/sessions/[id]` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-10/README.md`; Attendance PostgreSQL/browser tests | PENDING |
| SA-29 | Review an absence explanation | 2 / attendance | `/admin/attendance/sessions`, `/admin/attendance/sessions/[id]` | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-30 | Review and export attendance | 1 / reports | `/admin/reports/attendance` | IMPLEMENTED_AND_VERIFIED | `docs/evidence/ex-12/README.md`; Reporting PostgreSQL/browser tests | PENDING |
| SA-31 | Compare trends and assign follow-up | 2 / reports | `/admin/reports/attendance` | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-32 | Verify and link a parent or guardian | 2 / families | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-33 | Invite a verified guardian | 2 / families | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-34 | Change, restrict or revoke a guardian link | 2 / families | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-35 | Compose and send a school message | 2 / communication | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-36 | Resolve failed delivery or missing acknowledgement | 2 / communication | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-37 | Review a family request | 2 / communication | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 2; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-38 | Capture inquiry and start an application | 3 / admissions | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-39 | Review application and make a decision | 3 / admissions | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-40 | Accept an offer and enroll once | 3 / admissions | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-41 | Build and publish a timetable | 3 / planning | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-42 | Arrange cover or a timetable exception | 3 / planning | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-43 | Review learning readiness and follow-up | 3 / planning | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-44 | Collect and review a document | 3 / documents | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-45 | Issue a certificate or publish a form | 3 / documents | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-46 | Coordinate assessment setup and marks readiness | 4 / assessments | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 4; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-47 | Approve, publish or correct results | 4 / assessments | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 4; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-48 | Configure fees and concessions | 5 / finance | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 5; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-49 | Generate invoices and collect payment | 5 / finance | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 5; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-50 | Resolve reconciliation, adjustment or refund | 5 / finance | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 5; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-51 | Prepare routes and allocate students | 6 / transport | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-52 | Resolve a trip or handoff exception | 6 / transport | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-53 | Review leave and staffing coverage | 6 / people-ops | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-54 | Review payroll inputs and hand off | 6 / people-ops | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-55 | Catalog and circulate library items | 6 / library | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-56 | Resolve overdue, lost or inventory discrepancies | 6 / library | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-57 | Receive, issue or return stock and assets | 6 / facilities | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-58 | Book a facility or request maintenance | 6 / facilities | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-59 | Refer a health or safeguarding concern | 6 / health | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-60 | Review emergency access and restricted case handling | 6 / health | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 6; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-61 | Review connection status and reconcile a sync | 3 / integrations | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 3; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |
| SA-62 | Review activity, privacy or support access | 1 / settings | `/admin/activity` | IMPLEMENTED_AND_VERIFIED | [SA-COMP-05 unit/PostgreSQL/browser evidence](../sa-comp-05/README.md); human review PENDING | PENDING |
| SA-63 | Review an AI-assisted explanation or draft | 7 / assistant | No production route | OUT_OF_CURRENT_RELEASE | Explicit roadmap phase 7; PRODUCT_SCOPE/Bible excludes it from Phase 1. | PENDING |

## Trace of the 28 previously claimed-complete workflows

Each row follows screen → request/gateway → application/authorization → persistence → outcome → evidence. Entries marked PARTIAL identify the exact break in that chain.

| ID | Live trace and finding |
|---|---|
| SA-01 | `/sign-in` → NextAuth credentials → Access authentication/current-context checks → UserAccount/Membership/RoleGrant → authorized `/admin`; generic failure, revoked session and foreign scope are covered by Access E2E/PostgreSQL evidence. |
| SA-02 | activation/invite/reset pages → Access token facades → account-wide trust, expiry, replay and revocation rules → hashed activation/invite/reset tables and evidence → old password/session rejection; Access functional/browser evidence applies. |
| SA-03 | portal context control/sign-out → `/api/v1/context/switch` or NextAuth sign-out → current target membership recheck → session context/cache clearing → destination reload; tenancy/access browser evidence covers denial and sign-out. |
| SA-04 | `/admin/setup` → Reporting `schoolAdminOverview` → live `school.manage`, module and branch checks → repeatable-read owner projections → derived readiness and source links. **Partial:** the approved responsible-role assignment step has no DTO, use case, table or defined lifecycle. |
| SA-05 | `/admin` → Reporting overview → current administrator authorization → scoped AttendanceSession/ImportJob/Membership/Invite counts → source workspace link; SA-COMP-01 PostgreSQL and browser evidence proves full counts rather than page-length totals. |
| SA-06 | `/admin/school` → PATCH `/api/v1/school` / POST `/api/v1/campuses` → Access management facade and guarded repository → School/Campus plus evidence → refresh persists name/campus changes. **Partial:** office email, phone, address, reason and stale-value comparison from the approved flow are absent from DTO/schema/UI. |
| SA-07 | `/admin/branding` → Branding draft/preview/publish/rollback APIs → Branding facade with current scope/release checks → BrandProfile/Revision/Asset/Host → branded public sign-in. **Partial:** fixed SCHOOL_ADMIN currently includes `branding.manage`; the approved read-only/request-update delegation distinction cannot be represented. |
| SA-09 | `/admin/academics` → academics APIs → Academics facade/guard → AcademicYear/Calendar/Revision/Exception → persisted published calendar; PostgreSQL/browser evidence covers dates, versioning and conflicts. |
| SA-10 | academic setup → catalog create/retire APIs → Academics catalog use cases → Grade/Section/Subject/Offering with guarded dependency reads → persisted prospective retirement or dependency blocker; SA-COMP-02 covers replay, concurrency and browser recovery. |
| SA-11 | `/admin/classes` → offering/teacher-assignment APIs → Academics facade plus People eligibility port → CourseOffering/TeacherAssignment → dated assignment visible after refresh; overlap/employment denial is tested. |
| SA-12 | academic calendar/assignment controls → revision/end-assignment APIs → Academics guarded transitions and Attendance impact port → immutable revisions/effective dates → historical references retained; owner PostgreSQL/browser evidence applies. |
| SA-13 | `/admin/teachers` → POST employees → People facade → Person+Employee atomic write → profile persists and same-name people remain separate. **Partial:** approved staff category is absent from the input, aggregate and schema. |
| SA-14 | `/admin/users` → membership/invitation APIs → Access management/invitation use cases → Account/Membership/RoleGrant/Invite → pending or invited branch access. **Partial:** the command is not anchored to a selected Employee and does not capture the approved identity-verification reference; binding is a separate SA-16 action. |
| SA-15 | Staff access failure panel → invitation resend → Access revoke-and-reissue use case → old token revoked, fresh hashed invite and sanitized delivery outcome → visible retry state; SA-COMP-03 PostgreSQL/browser evidence applies. |
| SA-16 | staff profile controls → account-binding/teacher-profile APIs → People facade with Access/Academics owner ports → AccountPersonBinding/Teacher → eligible teacher appears for dated assignment; email equality is not used. |
| SA-17 | Staff access dialog → membership PATCH → Access guarded management use case → Membership/RoleGrant/evidence → next request observes suspension/revocation; last-admin and concurrent revocation tests apply. |
| SA-18 | student registration → Students facade → Students repository with People/evidence ports → Person+Student atomic write → searchable record and duplicate rollback. **Partial:** existing-Person selection accepts exact display name, while the approved flow requires exact person ID or branch-owned admission resolution. |
| SA-19 | student detail enrollment → enroll API → Students guarded repository with Academics references → Enrollment+SectionPlacement → persisted history; scope, replay, overlap and concurrency are covered. |
| SA-20 | student detail correction → name-correction API → Students facade and People-owned correction port in one transaction → PersonNameRevision/Person/evidence → refresh shows corrected name/history; SA-COMP-04 covers stale comparison and shared-person refusal. |
| SA-21 | transfer action → enrollment transfer API → Students repository plus Attendance impact port → close old/add new placement atomically → contiguous dated history; frozen-session and stale conflicts are tested. |
| SA-23 | `/admin/imports` → bounded multipart preview → Imports facade → ImportJob/ImportRow preview only → creates/no-change/conflict/error display. Canonical Phase 1 authorization remains `student.manage`; the catalog's proposed `import.upload` label was not adopted. |
| SA-24 | confirm/process/status/cancel/error-export APIs → Imports use cases with enlisted Students registration → row transaction writes Person/Student/Enrollment/Placement/map/receipt/evidence → durable resumable outcomes; partial success and replay are tested. |
| SA-25 | attendance scheduler → POST sessions → Attendance facade with Academics assignment/calendar checks → AttendanceSession/evidence → teacher day shows occurrence; overlap and calendar denial are covered. |
| SA-26 | attendance list/detail/report links → school-day/detail query → Attendance live authorization/resource checks → Session/roster/record joins → submitted, open, scheduled and cancelled states remain distinct. |
| SA-27 | submitted detail correction → corrections API → Attendance correction transition with expected version → immutable AttendanceRevision/audit/outbox → effective result and history visible; conflicts and authorization are tested. |
| SA-28 | session cancel/detail history → cancel API → Attendance state machine/current permission → versioned AttendanceSession plus evidence → cancellation reason/history persists; unsupported states fail honestly. |
| SA-30 | attendance report/export → Reporting overview/CSV APIs → current read/export permission and module checks → scoped Attendance joins plus ExportRun/Platform audit → bounded injection-safe CSV and matching report; PostgreSQL/browser evidence applies. |
| SA-62 | `/admin/activity` → activity list/detail APIs → Platform safe activity facade with current `school.manage` → allowlisted branch-scoped AuditEntry projection → safe detail/reference only; privacy/support alternatives remain unavailable by design. |

## Architecture and database findings

No product code or schema was changed during this review. The six partial findings require owner-contract work before coding:

1. SA-04 needs a decision whether “responsible role” is informational/derived or a persisted assignment with owner, lifecycle and authorization.
2. SA-06 needs an Access-owned contact/address contract, validation, safe audit diff and forward migration before its missing fields can be added.
3. SA-07 needs a permission-model decision separating branding read, delegated publish and a non-publisher request/handoff.
4. SA-13 needs a People-owned staff-category vocabulary and lifecycle semantics.
5. SA-14 needs a cross-owner contract tying a verified Employee to requested branch access without treating email as identity proof.
6. SA-18 needs the approved exact identifier selector: person ID and branch-owned admission resolution are distinct query paths; exact display-name matching must not be presented as identity proof.

Existing business writes remain behind portable application facades and guarded infrastructure transactions. No Prisma query was found in the reviewed page/component paths. Existing PostgreSQL evidence covers transaction rollback, replay, version conflicts and authorization for implemented operations; it does not prove the six missing contracts.

Read-only catalog inspection on 10 October 2026 found the development connection uses role `vyapti_vschool`: NOSUPERUSER, NOBYPASSRLS, INHERIT. It owns/uses the application schema and is not the restricted runtime role. The catalog has 53 ordinary tables, 33 applied migrations, 0 RLS-enabled tables, 0 FORCE-RLS tables and 0 policies. Application authorization remains active, but TEN-03 database isolation is incomplete; production and real-client onboarding remain blocked.

## SA-08 authority decision

SA-08's approved objective is to review current module status and communicate a school need without self-escalating a commercial entitlement.

Already implemented:

- Server-derived release, entitlement, branch activation and actor capability checks.
- Institution-authorized branch activation preview/confirmation.
- A truthful School Administrator handoff stating that unavailable selection does not submit a request.

Blocked portion: durable commercial request submission. Existing decisions say a School Administrator cannot grant entitlement, request submission alone changes nothing, and institution/operator authority owns commercial configuration. The sources do not decide who can submit on behalf of which branch, who receives/decides, states and withdrawal/duplication rules, whether the record is non-binding interest or an approved commitment, or required notification/audit behavior.

Recommended smallest contract: a **non-binding branch capability-interest request** submitted by a current School Administrator for the current branch, routed to an explicitly granted Institution Administrator, with `OPEN → WITHDRAWN | ACKNOWLEDGED | DECLINED` states. It must never activate or license a module. This still requires the user/product owner to answer one question:

> Should VSchool persist a non-binding branch capability-interest request for review by an authorized Institution Administrator, with no commercial commitment or automatic activation?

Until answered, SA-08 remains blocked only for request persistence; status review and authorized activation remain usable.

## Visual and interaction review

Reused SA-COMP-06 captures cover administrator overview, module access, branch activity, student directory, import workspace, teacher day and branded sign-in at desktop/mobile sizes. The 64-view audit covers all implemented routes and a 720 CSS-pixel layout equivalent for 200% zoom with no document overflow. Direct inspection confirmed the shared enhanced sidebar, selected states, header context, compact toolbars, bounded forms/tables and mobile reflow.

Known deviations are functional as well as visual: SA-04 has no responsible-role control; SA-06 omits approved contact/address fields; SA-07 cannot show a read-only requester state; SA-13 omits staff category; SA-14 separates access from Employee selection; SA-18 labels exact-name candidates as identity choices. These are not fixed with cosmetic work. Native 200% browser zoom, VoiceOver, NVDA and human visual acceptance remain PENDING.

## Verification provenance

Reused evidence on executable source `6f8983b`:

- `pnpm check`: lint, TypeScript, docs/database/boundary/backend checks and 120 unit tests passed.
- `pnpm test:functional`: 115/115 on real `vyapti_vschool_test` PostgreSQL.
- `pnpm test:e2e`: 94/94 desktop/mobile Chromium journeys using real APIs/PostgreSQL.
- `pnpm build`: passed; build ID `tDMy-XWMd8-r3fMVELDHx`.
- SA-COMP-06 route audit: 64 rendered observations with no document overflow.
- `pnpm demo:seed`: passed against guarded local `vyapti_vschool`, preserving existing credentials/data.

Newly executed for this review: source/status reconciliation, running health probe and the read-only PostgreSQL role/RLS/migration catalog query. Broad suites were not repeated because no application/schema path changed. Historical green tests remain valid for implemented operations but cannot prove absent workflow fields or authority contracts.

## Demo and repeatability

Entry URL: `http://127.0.0.1:3400/sign-in`

Seed command: `pnpm demo:seed`

Private credentials:

- School Administrator and teacher: `artifacts/people-02/private-demo.json`
- Institution Administrator: `artifacts/iam-01/private-demo.json`

| Objective / workflows | Start and actions | Expected visible and persisted result | Failure/repeatability |
|---|---|---|---|
| Entry/context (SA-01–03) | Sign in, use context control, sign out/recover. | Authorized branch only; context reloads; sign-out ends session. | Foreign/revoked branch denied. Recovery creates new one-time evidence; use a fresh seed-supported intent. |
| Setup/exceptions (SA-04–05) | Open `/admin/setup` and dashboard exception links. | Readiness and counts come from saved owner records. | No mutation; repeat freely. Responsible-role assignment is unavailable. |
| School/brand/modules/activity (SA-06–08, SA-62) | Edit school name/campus; preview/publish brand; inspect module status/activity. | Supported changes survive refresh; unavailable module request does not claim success. | Use unique campus code/brand revision; missing SA-06 fields and SA-08 request remain unavailable. |
| Academics (SA-09–12) | Create unique year/catalog records, offering and dated assignment; review impact/retirement. | Owner records and revisions persist. | Use unique codes/keys; duplicates, overlap and in-use retirement show blockers. |
| Staff/access (SA-13–17) | Create a uniquely numbered fictional Employee; create/invite access; bind verified account; enable teacher; suspend/reinstate. | Separate Person/Employee, Account/Membership and Teacher facts persist. | Email never proves identity; use unique staff number/email. Missing category and Employee-anchored grant remain unavailable. |
| Students (SA-18–21) | Register unique fictional student, enroll/place, correct name, transfer at a valid future date. | Student, history, correction revision and placement intervals persist. | Use unique admission/key. Duplicate/stale/frozen-session failures remain safe. Existing-Person exact identifier flow is incomplete. |
| Imports (SA-23–24) | Upload `artifacts/imports-01/sample-roster.csv`, preview, confirm/process or inspect errors. | Durable job/row results; preview alone writes no students. | Reuse exact file/job to observe no-change/replay; do not reset data. |
| Attendance (SA-25–28) | Schedule a unique session; inspect, cancel where allowed, or correct submitted synthetic session. | Session/revision/evidence persists; teacher day reflects assignment. | Use a new date/time/key; overlap/state/version failures are shown. |
| Reporting (SA-30) | Report 2026-10-06 through 2026-10-07 and export. | Counts and CSV match scoped submitted records; export evidence persists. | Repeat creates a new authorized export evidence row. |

The connected teacher demonstration remains 6 October 2026 with three assigned sessions. “Today” may correctly show zero sessions when the actual current school date is not a seeded teaching day.

## Remaining gates and next batch

- Six Phase 1 Administrator workflows are partial as listed above.
- SA-08 requires the single product decision above.
- Human product/visual review is PENDING.
- TEN-03 RLS/restricted-role context proof, native accessibility, production mail/provider, restore/reconciliation and load evidence remain release gates.
- The 34 later-phase workflows are explicitly deferred, not silently missing.

Recommended next batch: **Administrator contract closure**, ordered SA-18 exact identifier selection, SA-06 branch contact schema, SA-14 Employee-linked access, SA-13 staff category, SA-07 branding delegation, then SA-04 action ownership. This order resolves identity/security boundaries first and avoids adding UI controls before their owner contracts exist. Do not start another persona workspace until these Phase 1 decisions/contracts are closed or explicitly deferred.
