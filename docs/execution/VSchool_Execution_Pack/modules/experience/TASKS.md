# Wave A — exact execution tickets

One task in progress at a time. Existing verified business behavior is reused. Dependencies refer to implementation verification, not implicit human approval.

Revision 2 binding detail: read engineering/READ_FIRST.md first. EX-00 includes BE-00 contract reconciliation and schedules BE-01 portable-config correction if present. EX-02 includes BE-02 cache correctness. EX-08 includes BE-04 live teacher-read-policy verification. Apply the consuming owner engineering LLD, dictionary tables and applicable acceptance cases to every task; these augment rather than replace the task acceptance below.

## EX-00 — Reconcile the live checkout and pin the approved reference

Dependencies: none. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** AGENTS.md; docs/EXECUTION_INDEX.md; docs/modules/*/CURRENT_STATE.md; package.json; git status; SOURCE_MANIFEST.json.

**Steps:** Read the existing instructions and live task states. Record current HEAD and uncommitted paths; do not stash/reset them. Compare schema, routes, gateways and migration head with this snapshot. Record the six approved HTML paths and hashes. Add this batch to canonical design-system/tasks and relevant owner tasks without changing existing completed evidence. Correct stale root navigation prose only if misleading, linking to authoritative module state. Build a route-to-reference map. Resolve drift by reusing newer equivalent code; block only the affected task for a real contract/security conflict.

**Contract:** No business contract changes. Current repository owner contracts override snapshot facts; approved reference governs visual intent. Do not infer human acceptance.

**Demo acceptance:** Existing local app runs at the verified configured URL; demo shows its current admin/teacher routes and a short route/reference map. No migration or seed reset.

**Focused verification:** Run existing docs/boundary checks affected by index edits. Record tools/DB availability and baseline test evidence separately from tests executed now.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-01 — Capture representative page states and freeze visual targets

Dependencies: EX-00. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** test/e2e; docs/evidence; references/approved/packs/*/*Review.html; app/admin and app/teacher routes.

**Steps:** Select synthetic data from existing demo artifacts. Capture sign-in, admin home, students table, staff form, attendance register/report, teacher day, open drawer and failure states. Use 1440x1000 and 390x844 with the same dates/data density where possible. List each target reference route/hash and its production route. Keep screenshots focused; no baseline mass-approval of bad layout. Retain existing functional assertions. Show a before/reference comparison for the next sidebar task.

**Contract:** Read-only browser evidence. Reference fixture data never becomes a production source. New browser route does not imply a new capability.

**Demo acceptance:** A reviewer can open the approved HTML next to the actual running page and identify the scoped changes.

**Focused verification:** Verify screenshots load and identify source commit/viewports; no production test pass claim from prototype rendering.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-02 — Implement the approved shared left navigation

Dependencies: EX-01. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** components/admin-portal-frame.tsx; components/teacher-portal-frame.tsx; components/portal-navigation-group.tsx; components/portal/*; app/globals.css; lib/server/admin-navigation.ts.

**Steps:** Extract shared PortalSidebar and identity/footer composition with thin role wrappers. Reuse server-filtered groups and actual existing icon paths. Match enhanced dark nav exactly; preserve content area positioning and styling. Add distinct identity block and separate real sign-out action. Preserve branch switch flow and menu focus lifecycle. Use overflow for long navigation without hiding footer. Do not add links to unimplemented or unauthorized modules. In server navigation, permission-dependent memoization must include module AND capability, or cache only entitlement separately; never reuse another capability result.

**Contract:** Use existing AdminHome and teacher gateway outputs. Add minimal authorized identity projection only if required; do not expand getHome authority. shared/contracts/portal.ts is a presentation DTO, not an auth token.

**Demo acceptance:** Sign in as admin and teacher; navigate and sign out. Mobile menu opens/closes with keyboard focus return. Main-page body matches pre-change layout.

**Focused verification:** Type/lint/boundaries + focused menu E2E. Negative: revoked membership, disabled module, teacher denied admin URL. Screenshot comparison outside sidebar confirms no cosmetic regression.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-03 — Build reusable search/filter/sort and action-state recipes

Dependencies: EX-02. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** components/ui/forms.tsx; components/ui/interactive.tsx; components/ui/server-table.tsx; components/portal/list-toolbar.tsx; filter-drawer.tsx; sort-drawer.tsx; command-feedback.tsx; app/design-system/page.tsx.

**Steps:** Implement UI_LLD controlled contracts. Attribute default, Enter-to-search, separately focused input, adjacent Filters/Sort, borderless expandable multi-select attributes, draft Apply/Cancel behavior, radio Sort by/Order by groups. Reuse accessible dialog and semantic table. Build CommandFeedback renderer for existing owner results; preserve command keys in unknown states. Add representative gallery states using fictional data only, then consume in one real supported listing. Only expose server-supported filters/sort; list absent ones as owner gaps.

**Contract:** No generic repository or new API wrapper. Query state comes from existing validated DTOs; no client-side filtering of a partial server page presented as complete.

**Demo acceptance:** Open the gallery and one real listing; apply/cancel filters, change sort, search with Enter, recover an unknown command presentation.

**Focused verification:** Component interaction tests for draft cancel/apply, keyboard focus, multi-select staying open; one real listing E2E. No full persistence rerun for isolated CSS.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-04 — Align real school sign-in and account entry

Dependencies: EX-03. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** components/auth-layout.tsx; access-login.tsx; account-activation.tsx; password-reset.tsx; app/sign-in; app/account; app/activate; app/invite; lib/server/auth.ts.

**Steps:** Apply approved sign-in/form recipes to existing generic and branded entry. Keep actual published branding, trust-mode flows and generic credential/reset responses. Use current authorized role landing; teacher retains My teaching day navigation. Ensure submitted errors preserve non-sensitive fields only and passwords are not persisted. Separate public brand recognition from permission. Preserve existing activation/reset/invite URLs and token handling.

**Contract:** Existing Access facades and public branding route. No new identity roles, operator browser bypass or email provider integration.

**Demo acceptance:** Show branded and generic sign-in; successful admin/teacher entry, failed credentials, expired invitation and forgot-password generic response.

**Focused verification:** Focused public-entry/access E2E and affected unit tests. Recheck CSRF/session revocation only if those adapters changed; trust policy unit/functional suite if recovery logic changed.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-05 — Adopt Today, school settings and branding screens

Dependencies: EX-04. Implementation status: VERIFIED. Human review: PENDING.

**Files:** app/admin/page.tsx; app/admin/setup/page.tsx; app/admin/school/page.tsx; app/admin/branding/page.tsx; components/access-management.tsx; branding-workspace.tsx.

**Steps:** Translate approved page hierarchy into existing screen components. Today counts must use authorized owner totals, never prototype literals or counts of one page. Show honest unavailable blocks where no aggregate contract exists. Align actions, labels and page width; avoid putting Refresh inside the title. Keep school timezone read-only. Reuse branding draft/preview/publish and setup status; do not mix institution operator actions into school settings.

**Contract:** accountGateway + reportingGateway.overview + brandingGateway and existing school management contract. Preserve current date/timezone and asOf.

**Demo acceptance:** Admin sees correct branch, Today status, editable allowed school information and branded sign-in preview/publish; switching branch changes all protected context.

**Focused verification:** Real settings/branding happy path and permission denial; screenshot desktop/mobile. Unit projection tests only for newly added mappings; database tests if writes changed.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-06 — Adopt staff profile, access and teacher readiness screens

Dependencies: EX-05. Implementation status: VERIFIED. Human review: PENDING.

**Files:** app/admin/users/page.tsx; app/admin/teachers/page.tsx; components/access-management.tsx; people-workspace.tsx; lib/server/people.ts; lib/server/access.ts.

**Steps:** Use reference list/detail/form grouping while preserving separate profile, account, membership and teacher eligibility status. Connect existing create profile, grant/revoke, verified binding, invitation and resend operations. Keep operator and email issuance coexistence. Show delivery failure safely; never log tokens or raw provider diagnostics. Expose only currently permitted actions; contact email cannot establish verified person identity.

**Contract:** People/Access/Academics gateways and current staff-invite/trust-mode policy. Never create a second staff account store.

**Demo acceptance:** Create synthetic staff profile, inspect readiness, grant/invite as policy allows, inspect failure/retry and revoke; refresh retains state.

**Focused verification:** Focused people/access PostgreSQL tests for touched mutations; E2E admin success, teacher denial and revoked access. Check invite reuse/wrong-account only if invite path changed.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-07 — Adopt academic setup and class assignment screens

Dependencies: EX-05. Implementation status: VERIFIED. Human review: PENDING.

**Files:** app/admin/academics/page.tsx; app/admin/classes/page.tsx; components/academics-workspace.tsx; classes-workspace.tsx; lib/server/academics.ts.

**Steps:** Map approved sections/forms to actual academic year/calendar, grade/section/subject, offering and assignment operations. Preserve half-open date semantics, existing row versions and schedule impact validation. Keep table versus form action placement consistent. Calendar publication/open/close stays explicit. Do not implement recurring timetable as a styling task.

**Contract:** academicsGateway methods named in DESIGN.md; current DTOs and scoped tables.

**Demo acceptance:** Create/review year and section, assign eligible teacher to offering, reject overlap or invalid dates, show preserved published calendar on failed mutation.

**Focused verification:** Focused domain date tests and owner PostgreSQL tests if adapters change; E2E setup/assignment plus stale-version/denied state. No migration unless a separately designed capability gap is promoted.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-08 — Adopt student directory, enrollment and history

Dependencies: EX-07. Implementation status: VERIFIED. Human review: PENDING.

**Files:** app/admin/students/page.tsx; app/admin/students/[id]/page.tsx; components/students-workspace.tsx; student-enrollment-form.tsx; student-history-actions.tsx; lib/server/students.ts.

**Steps:** Apply list/detail/form recipes to actual registration, enrollment, transfer and archive. Retain admission identity and dated placement history. Map search only to existing supported semantics; person selection uses its owner policy, not a new fuzzy match. Keep supported student actions separate from unimplemented guardian linking. If prototype edit fields lack a command, record a module gap instead of a nonfunctional Save.

**Contract:** studentsGateway list/get/create/findExistingPeople/enrollmentOptions/enroll/transfer/archive. Owner scope, dates and optimistic version are unchanged.

**Demo acceptance:** Register synthetic pupil, enroll into section, transfer with effective date, reload and review historical placements; reject foreign branch pupil.

**Focused verification:** Existing student/enrollment functional suite when persistence touched; focused directory/detail/transfer E2E and stale/foreign-scope denial.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-09 — Adopt import preview and recovery screens

Dependencies: EX-08. Implementation status: VERIFIED. Human review: PENDING.

**Files:** app/admin/imports/page.tsx; components/import-preview-workspace.tsx; app/api/v1/imports; lib/server/imports.ts.

**Steps:** Use approved step layout and separate draft/continue actions. Retain upload size/row bounds and server-side preview. Display exact valid/error/skipped/result counts. Confirm once, show partial processing, resume and error CSV through existing owner commands. Unknown response reuses current receipt/job, never starts another import. No raw import content in logs or browser storage.

**Contract:** Existing ImportJob/ImportRow/SourceStudentMap and Students owner port; no client-side production importer.

**Demo acceptance:** Upload fictional mixed-validity CSV, inspect errors, confirm valid rows, resume safely and see persisted outcomes after reload.

**Focused verification:** Real PostgreSQL duplicate/replay/partial-result tests for changed paths plus one E2E import journey and blocked cross-scope job.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-10 — Adopt administrator attendance and correction screens

Dependencies: EX-07, EX-08. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** app/admin/attendance/sessions; components/attendance-admin-list.tsx; attendance-scheduler.tsx; attendance-cancel.tsx; attendance-corrections.tsx; lib/server/attendance.ts.

**Steps:** Match reference session list/detail, clear state labels and focused action grouping. Reuse schedule/inspect/cancel/correct/history. Preserve teacher conflict guards and frozen roster semantics. Submitted records are read-only until an authorized correction; reason/version/receipt remain required. Never mark missing register as pupil absence.

**Contract:** Existing Attendance application and reporting queries. Do not add timetable occurrence generation in this task.

**Demo acceptance:** Schedule and inspect a real session; submit via teacher, correct via admin with reason; inspect audit/history and stale correction response.

**Focused verification:** Focused attendance PostgreSQL suite if mutation touched; E2E schedule/correct/cancel and teacher/admin separation; unknown/stale result presentation.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-11 — Adopt teacher day and roll-call experience

Dependencies: EX-10, EX-04. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** app/teacher/today/page.tsx; app/teacher/sessions/[id]/page.tsx; app/account/page.tsx; components/teacher-sessions.tsx; attendance-roll-call.tsx; components/teacher-portal-frame.tsx.

**Steps:** Use approved original Teacher page layout, not rejected enhanced next-class hero. Connect actual assigned sessions, date selection and minimal pinned roster. Render marking, review totals, submit/receipt and recovery states consistently. Do not infer roster authority from teacher role alone. If separate My classes/history screens need new queries, record as gaps; no fake links or client fixture fallback.

**Contract:** Current teacher/session endpoints and verified assignment authorization. Shared UI may differ per role while owner commands remain identical.

**Demo acceptance:** Teacher signs in, follows My teaching day, opens assigned session, marks and submits, reloads receipt; another teacher cannot access it.

**Focused verification:** Desktop/mobile attendance E2E; revoked teacher, changed assignment, stale roster and same-key replay in relevant existing suites when affected.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-12 — Adopt attendance report and export experience

Dependencies: EX-10. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** app/admin/reports/attendance/page.tsx; components/ui/server-table.tsx; lib/server/reporting.ts; app/api/v1/reports/attendance*.

**Steps:** Use shared toolbar, scope/date context, semantic table and compact action column. Preserve owner denominator, pending/future/cancelled definitions and asOf. Apply filters to server query. CSV remains authorized with formula-safe escaping and correct scope; no exporting DOM rows as a substitute for full server query. Clear stale cursors on filter changes.

**Contract:** reportingGateway.overview/exportAttendance and AttendanceReportInput/AttendanceReport exact DTOs.

**Demo acceptance:** Compare visible summary and filtered sessions, change range, export valid scoped CSV; invalid range and forbidden export show correct states.

**Focused verification:** Reporting/export unit tests if mapping changes; current functional report tests plus focused E2E with pending and cancelled sessions.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-13 — Complete incremental demo fixtures and cross-page coherence

Dependencies: EX-06, EX-09, EX-11, EX-12. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** scripts/demo-seed.ts; feature-owned scripts/demo-*.ts; docs/modules/*/CURRENT_STATE.md; protected navigation consumers.

**Steps:** Extend the existing guarded seed only for missing demonstrated scenarios, with stable fictional identities and non-destructive reuse. Keep existing credentials and manual testing data. No teardown system. Verify Today links resolve the same staff/student/session records shown in owner screens. Hide unimplemented future actions and record mapped workflow gaps.

**Contract:** Existing owner provisioners and local file-only email sink; no raw Prisma write to bypass business invariants. No real outbound messages.

**Demo acceptance:** One pnpm demo:seed command prepares the complete Wave A demo; running it twice preserves credentials and manual data. Admin and teacher share the same real session outcome.

**Focused verification:** Guarded dev-database seed rerun; focused cross-role E2E. Never run seed against production or reset test data to mask failures.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-14 — Run consolidated visual, functional and regression gate

Dependencies: EX-13. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** test/e2e; module evidence; scripts/database.mjs existing harness; app route inventory.

**Steps:** Run full repository check, PostgreSQL functional suite, E2E and production build once on the integrated candidate. Inspect failures and fix their root cause, not assertions merely to accept changed behavior. Capture key production screens at reference sizes and inspect visual alignment. Record source SHA, baseline distinction, exact failed/blocked checks and native accessibility pending evidence.

**Contract:** No scope/authorization relaxations to turn checks green. Synthetic demo readiness is distinct from real-client release.

**Demo acceptance:** A stable built candidate supports the full admin-to-teacher-to-report walkthrough; manual reviewer can repeat it without fixture mock mode.

**Focused verification:** pnpm check; pnpm test:functional; pnpm test:e2e; pnpm build using existing isolated harness; visual reference audit. Rerun only impacted failed suites after fixes, with qualification if full suite predates final change.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.

## EX-15 — Checkpoint the delivery and publish the next owner-ready queue

Dependencies: EX-14. Implementation status: NOT_STARTED. Human review: NOT_REQUESTED.

**Files:** docs/EXECUTION_INDEX.md; docs/modules/*/CURRENT_STATE.md; docs/VSchool_Bible.md changelog; execution queue.

**Steps:** Commit focused verified changes without unrelated files. Record demo source SHA/build/URL, seed paths, manual scenario steps, workflow coverage and gaps. Keep human review pending. Update next eligible tasks: operator authority/lifecycle design, family-linking design, communication design and existing security closure according to dependencies. Do not claim all 268 workflows or Phase 1 production complete.

**Contract:** No deployment, Git push, external messaging or production data import implied. Local development continuation remains authorized.

**Demo acceptance:** User can start the candidate, follow one concise scenario list and see what is complete versus pending.

**Focused verification:** Docs/state consistency and diff checks; no repeated full suite for evidence-only changes.

**Checkpoint:** update the canonical module state, record tested source/commands/seed/demo and remaining gaps; leave human review PENDING and continue the next eligible slice. This ticket adopts existing behavior; do not mark linked source workflows fully complete when additional operations remain.
