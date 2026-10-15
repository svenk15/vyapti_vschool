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
