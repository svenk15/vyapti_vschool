# VSchool — principal engineering execution instructions, revision 2

You are implementing the approved VSchool product in the existing vyapti_vschool repository. Your output is working, tested software with traceable owner contracts and a runnable local demo, not another generic plan. Use this pack at docs/execution/VSchool_Execution_Pack. Begin EX-00, then proceed through the first executable batch. Preserve current work and newer compatible implementations.

If an earlier prompt is already executing, finish or safely checkpoint its current atomic slice, then adopt this revision. Reuse verified work and its evidence; do not restart completed EX tasks because this downloaded queue began at NOT_STARTED.

## 1. Read deliberately, then execute
Read AGENTS.md, START_HERE.md, docs/AGENT_RUNBOOK.md, docs/EXECUTION_INDEX.md, relevant module CURRENT_STATE, and this pack's BASELINE_AND_DECISIONS.md. Then read engineering/HEXAGONAL_WIRING.md, TRANSACTIONS_AND_SECURITY.md, IMPLEMENTATION_DELTAS.md, CRITICAL_WORKFLOWS.md and ACCEPTANCE_CASES.md. For each consuming module read engineering/modules/<owner>/DESIGN.md plus the canonical live module DESIGN/TASKS. Use database/DICTIONARY.md and its exact table pages when touching persistence. Do not load all 268 future workflow cards into one implementation context.

The reference code snapshot is HEAD 61f619e58093925bb20433e839f6ac375654b659 dated 8 October 2026. It is historical evidence, not the current checkout. Read live HEAD/status/diff, source, schema and migration head before acting. source-reference/ is READ-ONLY reference material. Do not copy it over the live codebase or replace newer work.

Deliver a short reconciliation record with existing/partial/new operations and concrete file evidence. Retain the existing stack, dependency lockfile, route contracts, database and verified work. No restart, speculative framework upgrade, new Java/JUnit/HBase stack, or code generation of hundreds of empty services.

## 2. Product and visual authority
Use references/approved: the user's uploaded design pack with only its approved enhanced navigation. Its page bodies, field grouping, labels and workflow hierarchy are the target. The rejected enhanced page redesign is not the target. No new global palette/body/table restyling to improve your interpretation.

Convert the static prototypes into React components using real owner DTOs and server behavior. Do not ship their fictional memory stores, reviewer role switches, hardcoded success, school names, counts, grants or sample identifiers as production logic. Approved UI does not grant nonexistent backend capability. Implement supported real operations and record precise gaps. No dead Save/Continue actions or buttons that only show a toast.

Shared UI owns appearance and interaction; module screens own presentation mapping; application/domain owns business policy. Reuse components/ui and the current icon paths before adding dependencies. The shared sidebar has active navigation, group labels, icons, reachable profile identity and separate real sign-out. Mobile drawer uses existing focus containment/return and closes correctly. Each destination is server-filtered and independently protected.

## 3. Required hexagonal implementation
Preserve these directories and dependency rules:
- backend/modules/<owner>/domain: pure invariants/value validation/state transitions, no framework/DB/environment.
- backend/modules/<owner>/application: transport-neutral commands/queries and port contracts.
- backend/modules/<owner>/contracts: minimal cross-owner interfaces, not foreign repository access.
- backend/modules/<owner>/infrastructure: Prisma/provider adapters, mappings and atomic guard/transaction implementations.
- backend/composition: typed factory construction with explicitly supplied dependencies/configuration.
- lib/server: Next hosting gateway, session/env/origin/error handling.
- app/api/v1: thin delivery wrappers; app pages render through gateways.
- shared/contracts: JSON-safe browser DTOs with no backend runtime imports.
- components: view/form state and same-origin calls, no Prisma or foreign owner writes.

Input/output port names and actual method signatures are in the module engineering LLDs. Reuse them. StudentRepository is an atomic persistence port; do not add redundant StudentDAO, StudentJpaRepository or generic CRUD<T> layers. Prisma models are persistence mappings, not browser/domain entities. Value objects may remain pure functions/types; class-per-column is unnecessary.

All current guarded repository methods keep their transaction boundary. A facade validating input then invoking an atomic guarded repository is the existing pattern. Do not detach authorization/replay from writes, or nest separate committed transactions for cross-owner imports. Framework extraction later should replace host/gateway adapters, not business rules. Existing opaque transaction ports remain opaque outside infrastructure.

## 4. Configuration and composition
Handle BE-01 if still present: remove environment fallbacks from touched portable composition factories, beginning students.ts; read config in lib/server and inject releasedModules/cursorSecret/clock. Keep current factory API-compatible where practical and update all known callsites/tests. Validate secret presence without logging it. Reuse current pool lifetime; no pool per HTTP request. Do not put authenticated tenant state on a singleton service.

Handle BE-02 in the sidebar task if still present: eligibility memoization must account for capability as well as module, or split permission-independent license caching from per-route capability checks. A menu cache is never endpoint authorization.

Do not expand these fixes into a wholesale backend rewrite. Make focused commits with evidence.

## 5. Database instructions
The dictionary documents 51 existing Prisma models, physical names, stored column types/nullability/default attributes, relations and indexes. Exact schema and migration SQL are included. SQL-only checks, partial indexes and triggers are in the migrations; never regenerate the database from prose alone.

Initial presentation adoption requires ZERO new tables. Reuse actual owners and physical names. Keep vs_<owner>_<entity>; current academics owner uses vs_academics_*. Do not migrate to singular vs_academic merely because a future candidate document uses it.

For any real missing persistence capability, before migration write exact DDL contract: owner/scope, key, columns/type/nullability/default, unique/check/FK/index, backfill, existing-row behavior, read/write paths and transaction. Update canonical module DESIGN and registry; use a forward migration and a populated synthetic migration test. Do not edit applied migrations, drop/reset/truncate, import another checkout's data or silently widen policies. Branch references use scope-inclusive keys; an arbitrary UUID is not sufficient.

Read database/QUERY_AND_JOIN_DESIGN.md for exact Student history and pinned Attendance joins. Avoid row multiplication in counts. Do not turn one paginated page length into a school total. Every join retains organization/branch scope except authorized institution/global relationships that intentionally have different scope.

## 6. Authorization and concurrency
Use live account/tokenVersion, organization/school status, membership/grants, release/license/activation and resource-level assignment/purpose checks. Scope from a browser is only a candidate, never authority. A getHome call or hidden nav item does not replace the guarded owner check.

Preserve actual lock order and strengths: Students currently account UPDATE→organization SHARE→school UPDATE; Attendance currently account UPDATE→organization UPDATE→school UPDATE. Do not change lock strength during styling. Reads perform their owner live checks without mutation locks. Lock changes need independent race/load evidence.

Same-key same-input replay returns the original semantic result without duplicate writes; same-key different-input conflicts. Reauthorize before replay disclosure. Student platform receipt scope includes organization/school/actor/command/key. Attendance tenant receipt scope includes organization/actor/command/key with school/session checked before result disclosure. Do not confuse the stores or expose one actor's receipt to another.

TEN-03 enforcement remains an independent production gate. Caller-settable GUCs do not prove identity. Do not enable superficial RLS while still claiming owner credentials are restricted, or mark tenant context proof complete because a port has that name. UI delivery can proceed with authorized synthetic demo scope; production and real-client data remain blocked until required security evidence exists.

## 7. Wire existing use cases exactly
Student registration chain: POST /api/v1/students→student-http.createStudent→studentsGateway.create→createStudentUseCases→StudentRepository.create→PrismaStudentRepository. Preserve body/header key equality,8KiB JSON limit, normalized validation, 201new/200replay. Person owner creation/reuse and Student write, school revision and platform audit/outbox/receipt commit atomically. Duplicate admission/person errors do not leave partial Person rows.

Enrollment converts inclusive lastDay to exclusive validTo once in domain. Preserve scoped open-year/section checks. Transfer closes prior placement and creates the next interval; owner checks frozen session impact. Do not mutate historical rosters or silently merge Person by email.

Attendance chain: session endpoint→attendance-http→attendanceGateway→createAttendanceUseCases→SessionRepository→PrismaSessionRepository. Open pins roster through Students port; submit uses exact server rosterRevision and complete unique pupil entries. Current pilot limit200, LATE minutes1–480, submit 32 KiB/correction 64 KiB. Retain strict allowed properties and positive version. Submitted records are read-only except authorized correction. Cancellation permissions depend on current state; use existing domain function rather than guessing.

Attendance status recovery supports attendance.submit and attendance.cancel. Retain UUID intent key after a lost response. FOUND displays confirmed existing result; UNKNOWN is not proof of failure. Do not generate a new key or erase entered marks merely because fetch timed out. Preserve already implemented command-specific handling rather than adding an incompatible global envelope.

Teacher day currently disallows future dates. Teacher role alone does not prove active Employee/Teacher identity or assignment. Admin school-wide history is not a teacher history grant. Timetable planning and new teacher history projections require their owner contracts.

Imports retains previewRevision/fileHash/expectedVersion confirmation and current bounded parser/file limits. Do not confuse JSON body bound with upload bound. Use current row processing and enlisted Students registration transaction; partial outcomes/resume must not duplicate rows. Keep source hash in ImportJob, never raw rows/file content in audit.

Reports use owner asOf/denominator and separate expected/submitted/pending/future/cancelled meanings. CSV export reauthorizes on server and preserves injection-safe escaping. Dashboard cards with unavailable real data show honest unavailable state, not prototype values.

## 8. Known contract mismatches
Apply BE-00 and BE-04: distinguish source facts from required product policy. Existing teacher student.read and generic Student directory path require a live-policy/request-level check before asserting assignment-only visibility. If canonical policy is class-only, implement an explicit owner permission/projection fix and tests; do not broaden access to make the UI work. A confirmed authorization defect blocks the affected path, not unrelated safe tasks.

Existing Person selection currently uses exact name in snapshot whereas older requirements mentioned admission/person ID. Resolve from canonical live policy. Until resolved, do not introduce broader search or merge identities; record and isolate that action. Ordinary student directory search is a separate contract.

OperatorPrincipal.verified=true is a server trust result, not a field accepted from browser JSON. Existing RoleCode only lists SCHOOL_ADMIN/TEACHER. Future operator/parent/student/principal workspaces require designed identity/grants. No impersonation by reusing an admin session with a different label. Missing Organization code cannot be supplied by School.code. Do not create future modules silently in the initial batch.

## 9. UI interaction contract
Use shared controlled list toolbar and drawer recipes from architecture/UI_LLD.md. Search attribute has a default; Enter commits; changing attribute does not highlight entire toolbar. Preserve visible keyboard focus. Filters use expandable borderless attributes, multi-select stays open, draft state separate from applied, Apply/Cancel only. Sort by/Order by radios expanded initially. Clear stale cursor on query changes; URL only contains safe validated query fields. Expose only supported backend sort/filter until their owner query is implemented.

Forms preserve entered safe values on validation errors, associate labels/errors, disable duplicate pending submission, and never show success before confirmation. Save draft is separate from Back/Continue and enabled only after meaningful change. No localStorage of student rosters, credentials, tokens or private drafts unless a separately approved protected-storage design exists.

Scope switch clears scope-bound cached/protected data; late old responses cannot overwrite the new branch. Check data context/generation and cancel pending reads. Browser navigation must not reuse a previous branch's server results. Unknown write result is resolved separately; aborting fetch does not undo a database commit.

## 10. Execution order and task contract
Use modules/experience/TASKS.md EX-00–EX-15 as the implementation order. Attach the deeper owner LLDs and applicable BE delta/test IDs to each ticket. Keep one ready vertical slice in progress. Do not rerun all architecture discovery at each slice or generate new competing task IDs for equivalent existing work.

Before coding each slice record a short design delta: target reference/route, use case, port/adapter/factory/host/DTO files, read/write tables, transaction/key/version, authorization and focused tests. Link existing resolved contracts instead of rewriting them. If no backend change is required, say so and keep schema untouched. If a required backend operation is absent, design its exact contract before code; no fake success and no speculative table dump.

Implement the foundation only for immediate consumers. Integrate shared navigation first; then toolbar/form/state recipes; then sign-in, admin settings/branding, staff, academics, students, imports, attendance, teacher day and reports. Finish seeds/cross-role coherence and consolidated verification. The268 workflow cards are coverage records for subsequent waves, not a claim their future domains are already implementation-ready.

## 11. Verification, seeds and evidence
For each slice select the applicable cases in engineering/ACCEPTANCE_CASES.md. Vitest unit tests prove validation/state/invariants; real PostgreSQL tests prove scoped persistence, rollback, replay, concurrency and authorization; Playwright proves the user journey through real APIs. Existing Vitest JUnit XML is the required JUnit-style reporting strategy. No new Java test framework.

Visual-only changes need focused UI/keyboard/layout checks, not repeated full database runs. Security/schema/transaction changes require negative/race/integrity tests immediately. Run full pnpm check, pnpm test:functional, pnpm test:e2e and pnpm build at the integrated checkpoint using existing guarded scripts. Read supported filter flags; do not bypass database safeguards for speed. Never weaken an assertion to pass a regression.

Extend pnpm demo:seed incrementally with deterministic fictional records through feature-owned helpers. Preserve existing credentials/manual testing records. No teardown now, no reset/reseed to hide failures, no real mail. Use the dedicated test database for functional/E2E; local dev for demo. Don't print credentials or full connection strings.

After each slice record tested source SHA, checks/results, seed changes, migrations/none, demo URL/start command and concise manual steps in module CURRENT_STATE. Commit only task files; leave unrelated work intact. Human review stays PENDING until user feedback; keep executing independent eligible work without routine approval. No claim of current demo unless server is actually reachable for the tested source.

## 12. Completion and limits
A slice is VERIFIED only when its required current-source checks pass and its usable outcome works. A screen screenshot does not prove DB correctness; a green backend test does not prove approved layout. Review actual screen captures at desktop/mobile. Native accessibility, restore/load/provider review and TEN-03 remain separate evidence; don't invent passes.

Stop only an affected task for unresolved security/product decisions, missing access, destructive action or an unfixable failing prerequisite; record exact blocker and work on another eligible task. Ask a precise question only when no safe authorized work remains. No push, deployment, real external messaging, data destruction or real-client import is authorized by this prompt. Runtime limits still apply; do not promise an uninterrupted autonomous service.

At the end of the first batch report actual completed use cases and remaining owner gaps, tested commit, real demo instructions and next ready module design. Do not claim all 268 workflows or production readiness. Begin EX-00 now and proceed to implementation; do not respond with only a plan.
