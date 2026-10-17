# Learning tasks

## LEA-01 — publish text-only class assignments

- [x] Add forward Learning tables, purpose constraints and Path A registry entries.
- [x] Add Teacher-scoped draft/update/publish operations with replay and CAS.
- [x] Freeze exact Parent/Student recipient bindings at publication.
- [x] Add independent Parent/Student learning purposes and management.
- [x] Add Teacher, Parent and Student routes through typed gateways.
- [x] Extend deterministic demo seed without replacing existing records.
- [x] Pass focused PostgreSQL/browser and required repository checks.
- [x] Compare the supported states directly with TEA-27, PAR-20 and STW-10/11 references; retain richer reference capabilities as explicit partial-workflow gaps.

Human acceptance remains PENDING.

## LEA-02 — query published Student assignments

- [x] Validate bounded Assignment name/Subject search and Due date/Assignment name/Subject sort inputs.
- [x] Query the complete exact frozen-recipient set in PostgreSQL with scoped joins, stable UUID tie-breaker and query-bound cursor pagination.
- [x] Preserve live Student access, purpose, module and current enrollment checks on every page and independent detail read.
- [x] Add approved URL-backed toolbar, separate Sort drawer, responsive table and no-results recovery.
- [x] Pass focused real-PostgreSQL, desktop/mobile browser, type/lint and production-build checks.
- [x] Directly compare the supported states with the approved STW-10 reference.

Submission-status filters remain outside this task because their draft/attempt/feedback lifecycle is not implemented. Human acceptance remains PENDING.

## LEA-03 — private text draft and on-time submission

- [x] Add forward-only private draft and immutable submission tables with scoped keys, constraints, indexes and TEN-03 registry entries.
- [x] Add private Student save/resume with optimistic version checks and safe evidence excluding response text.
- [x] Add explicit on-time submission with immutable snapshot, exact-payload replay and concurrency protection.
- [x] Add assignment-scoped Teacher submission list/detail without exposing unsubmitted drafts.
- [x] Integrate supported Draft/Submitted states into Student detail, directory filters and My day priorities.
- [x] Extend deterministic fictional seed data without replacing existing records.
- [x] Pass focused real-PostgreSQL, desktop/mobile browser, migration, boundary, type/lint and build checks.
- [x] Directly inspect approved Student/Teacher reference states and record supported extensions/deviations.

Human acceptance remains PENDING. Files, late work, extensions, resubmission, grading, feedback, Returned/Closed/Excused semantics and durable browser storage remain separate tasks.

## LEA-04 — private Teacher feedback and Student publication

- [x] Add forward-only feedback root/version tables, constraints, indexes and TEN-03 registry entries.
- [x] Add exact-submission Teacher private draft save with CAS, replay and safe text exclusions.
- [x] Add explicit immutable feedback publication and versioned correction without changing submission state.
- [x] Add Student-only current published feedback read; deny Parent, other Student and unauthorized Teacher access.
- [x] Integrate feedback progress into Teacher submissions and Student detail/directory/My day navigation.
- [x] Extend deterministic fictional seed data without replacing accepted responses or published feedback.
- [x] Pass focused unit/PostgreSQL, desktop/mobile browser, migration, boundary, type/lint and build checks.
- [x] Directly compare supported TEA-29/STW-22 states and record reference-less recovery deviations.

Human acceptance remains PENDING. Marks, rubrics, return/reopen, Student reply, Parent feedback access and resubmission remain outside LEA-04.

## LEA-17 — Principal assignment-completion oversight

- [x] Add the narrow `learning.read_leadership` capability only to the explicit Principal branch role.
- [x] Implement a transport-neutral bounded query over immutable published audiences and accepted attempts.
- [x] Apply date, class and subject predicates before stable PostgreSQL pagination and bind the cursor to the query.
- [x] Exclude private drafts, response text and learner identity from the browser-safe projection.
- [x] Add the Principal navigation/page with cutoff, denominator definition, filters, responsive rows and truthful unavailable/empty states.
- [x] Extend `pnpm demo:seed` with repeat-safe submitted and awaiting fictional pairs.
- [x] Pass focused unit, real-PostgreSQL, build and sequential desktop/mobile browser checks and directly inspect the reference/application captures.
- [x] Add extension/excused rules, permitted named status evidence and the typed recipient follow-up under approved D10/D04.

Engineering status: LEA-17 ENGINEERING_COMPLETE after F08-A/F08-B; human review PENDING.

## F08-A — Learning recipient policy and named status evidence

- [x] Reconcile approved D10 into exact Learning-owned schema, grant, transaction, replay, denominator and disclosure contracts.
- [x] Add forward-only manager-grant and immutable recipient-policy history tables with TEN-03 Path A registry entries.
- [x] Implement operator designation, exact class/subject policy commands and separate named-status projection.
- [x] Enforce effective deadline/excusal in Student work and preserve accepted submissions/authorized replay.
- [x] Upgrade current Principal completion to the pinned v2 denominator without exposing learner identity or reasons.
- [x] Add staged manager UI plus permitted Student/Parent status and incremental fictional seed.
- [x] Pass focused unit, real PostgreSQL, sequential desktop/mobile browser, migration, boundary, build and visual checks.
- [x] Implement the typed Coordination academic-evidence adapter and eligible assignee flow in F08-B.

Engineering status: F08-A and F08-B ENGINEERING_VERIFIED. F08 remains PARTIAL for the distinct LEA-18 aggregate feedback-turnaround source; LEA-17 and LEA-19 are ENGINEERING_COMPLETE. Human review PENDING.

## LEA-18 — Principal feedback-turnaround oversight

- [x] Adopt the explicitly approved accepted-submission cohort, first-publication and elapsed-clock definitions.
- [x] Add a bounded Learning-owned query with branch-timezone boundaries and exact class/subject filters.
- [x] Exclude private drafts, content, learner/Teacher identity, later-revision resets and staff-performance inference.
- [x] Pass focused real-PostgreSQL and sequential desktop/mobile browser verification; the current-source repository and production-build gates are recorded with the checkpoint evidence.
- [x] Directly inspect the approved LEA-18 reference against the application states and record remaining deviations.
- [x] Add the approved exact accepted-submission feedback source, cursor-paginated safe awaiting projection and exact subject-lead coordination under D10/D04; do not reuse named recipient evidence or expose private content.

Engineering status: LEA-18 and F08 ENGINEERING_COMPLETE. Human review PENDING.
