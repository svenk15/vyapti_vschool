# Learning module design

Status: LEA-01 design-ready first-release slice · 15 October 2026

## Decision and scope

The authorized Parent/Student programme delegates a conservative first-release decision for published learning tasks. LEA-01 provides one text-only assignment publication flow: a currently assigned Teacher creates and resumes a draft for one current CourseOffering, then publishes one immutable version to the offering's current class. Exact eligible Parent and Student access bindings are frozen at publication. The affected workflow slices are TEA-27, PAR-20, STW-10 and STW-11.

This slice excludes resources/files, learner drafts, submissions, late/extension rules, withdrawal, feedback, criteria, grading, questions, external delivery and offline storage. Those remain separate owner contracts; LEA-01 must not present their controls as functional.

## Ownership and invariants

Learning owns Assignment, AssignmentVersion, AssignmentRecipient and frozen access bindings. Academics owns CourseOffering, TeacherAssignment, academic year and Section. Students owns Enrollment/Placement and Student access; Guardians owns child access. Learning reads those owners through scoped persistence joins and never mutates their tables.

- An Assignment belongs to one institution, branch and CourseOffering. Its offering cannot change after creation.
- Status is `DRAFT` or `PUBLISHED`. Draft fields are mutable through revision CAS. Publication appends immutable version 1 and cannot be reversed or edited in LEA-01.
- Title is 1–120 normalized characters; instructions 1–2,000; due time is an instant displayed in branch timezone and must be future at publication and before the offering academic year's exclusive end.
- Teacher writes require a live account/token, active branch membership with `TEACHER`, active bound Employee/Teacher, `learning.assignment.write` or `learning.assignment.publish`, released/licensed/active `homework` plus dependencies, and a TeacherAssignment covering the branch-local current date for the exact offering.
- Publication freezes current active Students with an effective Enrollment and SectionPlacement for the offering's year and section. A Student is included only when an accepted live Student portal access has `learning.assignment.read_self`, or an accepted live guardian link has `learning.assignment.read_child`. An empty exact audience is rejected.
- Parent and Student reads require the frozen exact access binding plus current account/token, non-revoked accepted access, the same live purpose, original school/module availability and current enrollment context. Later grants or enrollments do not add recipients retroactively; purpose/access revocation denies subsequent reads immediately.
- Browser school, offering, Student and access IDs are candidates. Server-side scoped joins establish authority.

## Schema, constraints and joins

All tables are Path A branch tenant tables registered for TEN-03 closure:

| Physical table (model) | Physical fields | Responsibility | Constraints and indexes |
|---|---|---|---|
| `vs_learning_assignment` (LearningAssignment) | id/org/school/offering/teacher uuid; status/revision/current_version; title/instructions/due_at; timestamps | Mutable Teacher-owned draft root and published-version pointer. | Scoped Offering/Teacher FKs; DRAFT/PUBLISHED and positive revision checks; scoped/current version unique keys; teacher and status list indexes |
| `vs_learning_assignment_version` (LearningAssignmentVersion) | id/org/school/assignment/offering/year/section uuid; version/title/instructions/due; digest/publisher/timestamp | Immutable exact published assignment version. | Scoped assignment/Offering/account FKs; unique assignment/version; due index; append-only trigger |
| `vs_learning_assignment_recipient` (LearningAssignmentRecipient) | id/org/school/version/student uuid; created_at | Frozen Student audience membership for an exact assignment version. | Scoped version/Student FKs; unique version/Student; Student lookup index; append-only trigger |
| `vs_learning_guardian_binding` (LearningAssignmentGuardianBinding) | id/org/school/recipient/access/student uuid | Frozen exact Guardian access provenance for one assignment recipient. | Scoped recipient and Guardian access+Student FKs; unique recipient/access; lookup index; append-only |
| `vs_learning_student_binding` (LearningAssignmentStudentBinding) | id/org/school/recipient/access/student uuid | Frozen exact Student portal access provenance for one assignment recipient. | Scoped recipient and Student access+Student FKs; unique recipient/access; lookup index; append-only |

- `vs_learning_assignment`: UUID key; `organization_id`, `school_id`, `offering_id`, `author_teacher_id`, status, revision, current version, draft title/instructions/due instant, created/updated timestamps. Scope key; status/revision checks; scoped Offering and Teacher FKs; list indexes by branch/status/update and teacher/update.
- `vs_learning_assignment_version`: immutable UUID key; scoped assignment, version number, offering/section/year snapshot identifiers, title/instructions/due instant, audience digest, publisher and timestamp. Unique scoped assignment/version and immutable trigger.
- `vs_learning_assignment_recipient`: immutable exact version/Student row, unique per version/Student, with scoped Student FK and Student lookup index.
- `vs_learning_guardian_binding` and `vs_learning_student_binding`: immutable exact recipient/access bindings, unique per recipient/access, with scoped access and Student FKs.

Teacher list joins Assignment→Offering→Subject/Section and returns only assignments authored by the current Teacher for offerings they remain currently assigned to. Parent/Student list joins the exact binding→recipient→current AssignmentVersion and orders by `due_at,id`. Recipient resolution joins Offering→effective Enrollment→effective Placement; it does not resolve people by name/email or perform identity merging.

### LEA-02 / STW-10 published-assignment directory query

The supported Student directory query accepts `q` (0–100 normalized characters), `by=title|subject`, `sort=due|title|subject`, `order=asc|desc`, an opaque query-bound cursor and `limit` 1–50 (UI default 20). Assignment name is the default search attribute. Enter applies the draft query to the URL; changing search or sort clears a stale cursor. Ordering and pagination run in PostgreSQL across the complete authorized frozen-recipient set with assignment UUID as the deterministic tie-breaker. A cursor records only the normalized query signature, last sort value and assignment ID. It cannot grant access: the repository re-establishes current Student scope/purpose and repeats the exact binding joins on every page.

The query joins `vs_learning_student_binding` → recipient → immutable current version → current published assignment → scoped CourseOffering → Subject. Every join carries organization and school scope. Title/subject substring search escapes SQL wildcard characters. Existing binding, recipient, due-date, assignment-list and scoped Academics keys support the predicates; the focused dataset does not justify another index or migration. Detail still reauthorizes independently.

The UI uses the approved Assignment name/Subject search selector, separate Sort drawer, responsive table, no-results recovery and next-page link. Status filtering is not in LEA-02: the approved values Draft, Submitted, Returned, Closed and Excused require learner draft/submission/feedback policy. Due time alone never fabricates those states. Published work due in the future may be labelled **To do**; older immutable work is labelled **Published**, with no claim that it was missing or closed.

## Commands, queries and boundaries

Portable `LearningFacade` operations are:

- `teacherWorkspace(identity, organizationId, schoolId)` — current authorized offerings and owned assignments.
- `createDraft(identity, scope, fields, key)` — serializable guarded create.
- `updateDraft(identity, scope, assignmentId, expectedRevision, fields, key)` — serializable CAS.
- `publish(identity, scope, assignmentId, expectedRevision, key)` — serializable guarded immutable publication and audience freeze.
- `list/detailParent(identity, studentId[, assignmentId])` and `list/detailStudent(...)` — repeatable-read protected projections.

`backend/modules/learning` owns domain/application/infrastructure. `backend/composition/learning.ts` constructs it. `lib/server/learning*.ts` hosts it for Next.js. Browser DTOs live in `shared/contracts/learning.ts`; route handlers contain no business rules or Prisma writes.

## Transactions, replay and recovery

Writes use serializable transactions and lock account UPDATE → organization SHARE → school UPDATE → assignment UPDATE where applicable. The write rechecks live authority and module state before inspecting the scoped command receipt. The receipt scope is institution/branch/actor/command/key and hashes the exact semantic payload. Same key/same payload returns the original result; changed payload conflicts. Audit/outbox payloads contain identifiers/status/counts, never instructions. Publication creates version, recipients, access bindings, assignment transition, audit, outbox and receipt atomically.

Unknown responses retain the exact key/payload and may be retried. CAS mismatch returns `STALE_VERSION`; the UI reloads current state and never claims publication. Concurrent update/publish permits one winner. Reads do not acquire mutation locks.

## UI and failures

Teacher uses `/teacher/learning`, `/teacher/learning/new`, `/teacher/learning/[id]`; Parent uses `/family/learning`; Student uses `/student/assignments`. The Teacher composition follows the approved TEA-27 entry/list language and shared staged form patterns. Parent follows PAR-20 published homework list/detail. Student follows STW-10/11 list/detail but omits submission/resource controls outside LEA-01.

Validation preserves entered safe fields. Failure states distinguish unavailable authority/module, not found, validation, stale version, no eligible audience and unknown service failure. Mobile uses the shared portal navigation and card composition; keyboard focus returns to the active stage/action. The established font portability exception remains.

## Verification criteria

- Unit: normalization, bounds, future due-date validation shape.
- Real PostgreSQL: assigned Teacher create/update/publish, exact frozen Parent/Student audience, later-grant non-retroactivity, purpose revocation, cross-class/branch denial, replay, stale/concurrent mutation, immutable version/recipient enforcement and revoked Teacher denial.
- Browser: Teacher draft/resume/publish → Parent list/detail → Student list/detail; persistence after reload; desktop 1440×1000 and mobile 390×844 with keyboard-visible actions.
- LEA-02 query: real PostgreSQL proves title/subject search, database ordering, a Student beyond page one, cursor/query mismatch rejection and unchanged exact recipient scope; browser proves Enter-applied URL state, Back restoration, Sort Apply/focus and responsive table/detail navigation.
- Repository: migration status, database registry, backend/boundary/docs checks, lint and build.

Human acceptance, native VoiceOver/NVDA, font portability, TEN-03 enforcement and production readiness remain separate gates.
