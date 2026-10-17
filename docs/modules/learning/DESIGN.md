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

## F08-A — per-recipient deadline and excusal policy

### Approved scope and ownership

This slice implements approved decision D10. Learning owns the effective deadline, excusal state, immutable policy history and the separately authorized named status projection. It does not expose a Student response or Teacher feedback, change an accepted submission, create a durable browser draft, or grant Learning authority from a Principal/Teacher role alone. A synthetic operator designates a current branch member for an exact `(section, subject)` and one of two capabilities: `RECIPIENT_POLICY_MANAGE` or `RECIPIENT_STATUS_READ`. Every read and write still rechecks the live account/token, active membership, active School, module release/entitlement/activation, exact grant and exact current immutable AssignmentVersion scope.

### Physical schema and read joins

| Physical table (model) | Fields | Invariants and indexes |
|---|---|---|
| `vs_learning_manager_grant` (`LearningManagerGrant`) | id/org/school/membership/account/section/subject uuid; capability; operator/grant/revoke timestamps; version | Scoped membership/Section/Subject FKs; capability/version checks; unique account/scope/capability; active lookup index |
| `vs_learning_recipient_policy_event` (`LearningRecipientPolicyEvent`) | id/org/school/version/recipient/student/actor uuid; event/action; previous/effective deadline and excusal; reason/timestamp | Scoped version/recipient/Student and account FKs; unique recipient/event; transition-shape and reason checks; assignment and Student history indexes; append-only trigger |

Effective policy is the latest event for the exact recipient, falling back to the immutable AssignmentVersion `due_at` and `excused=false`. Named evidence joins manager grant → current AssignmentVersion/CourseOffering → Recipient → Student/Person plus at most one SubmissionAttempt and latest policy event. Aggregate oversight uses the same latest-event relation but omits Student, Person, actor and reason fields. Parent/Student assignment reads use only effective deadline and status; Parent never joins submission response or Feedback tables.

All new tenant tables remain Path A registrations for TEN-03. Their intended policies require verified organization/school context plus the same live grant/resource predicates; TEN-03 remains the consolidated enforcement gate and production blocker.

### Commands, concurrency and replay

`extendRecipientDeadline`, `excuseRecipient` and `reverseRecipientExcusal` are Learning application commands. Each locks account UPDATE → organization SHARE → school UPDATE → assignment SHARE → recipient UPDATE, then repeats authorization. The browser supplies candidate IDs, expected recipient-policy version, normalized bounded reason, final confirmation and an idempotency key; it never supplies authority or trusted scope.

- **Extend** requires an unsubmitted, non-excused recipient and a strictly later effective deadline. A past original deadline may be reopened only by this reviewed final command, and the new deadline must be in the future.
- **Excuse** records `excused=true` and retains any already accepted immutable submission. The pair leaves the required-work denominator at the event timestamp without deleting work.
- **Reverse excusal** requires the current excused state. An unsubmitted recipient needs a new future deadline; a submitted recipient retains its prior effective deadline. Reversal never withdraws or changes an accepted attempt.

The event number is the optimistic version. A same actor/command/key and exact semantic input replays the original authorized result; a changed payload conflicts. Reauthorization occurs before protected replay disclosure. Event, safe audit/outbox evidence and command receipt commit atomically. Policy reasons never enter general aggregate reports, Parent/Student DTOs, outbox payloads or command receipts.

Student submission authority derives `effectiveDueAt` from the latest event under the recipient lock. Excused recipients cannot save a new draft or submit. Existing accepted receipts remain independently readable through prior live Student permissions. A new submission succeeds only at or before the effective deadline and stores that exact deadline in the immutable attempt.

### Aggregate and UI contract

`assignment-completion.v2` pins the server as-of instant. Non-excused pairs whose effective deadline is at or before the cutoff form the expected denominator; one accepted attempt counts once; awaiting is expected minus submitted. Non-excused future pairs and excused pairs are separate counts. The assignment rows expose the same categories and no learner identity. Historical retained report snapshots are not rewritten when a later event changes current results.

`/leadership/learning/evidence` is the separately guarded manager composition. It lists only assignments inside the manager's exact class/subject grants, then shows named recipient status without draft/answer/feedback content. Extend, excuse and reversal use review/final-confirmation UI, retain in-flow safe values, bind the expected policy version and recover a known receipt with the same key. `/leadership/learning` links to the evidence composition only when the current actor also holds an applicable status or policy grant.

### Verification

Unit checks cover exact input shape, reason bounds, future/later deadline and reversal rules. Real PostgreSQL checks cover exact grant scope, cross-tenant/branch denial, revocation, event append-only enforcement, version races, exact replay, extension after the original deadline, excusal/reversal, submitted-work immutability, effective-deadline submission, Parent content isolation and `assignment-completion.v2` reconciliation. Browser checks cover the staged manager actions, reload/recovery, Principal aggregate, Student/Parent permitted status, desktop/mobile layout and keyboard focus. Human acceptance, native accessibility, font portability, retained-note production policy and TEN-03 remain pending.

### F08-B Coordination evidence boundary

Learning implements the registered `LEARNING_RECIPIENT` adapter inside Learning infrastructure. Named inspection repeats the same live module and exact `RECIPIENT_STATUS_READ` authority as the manager evidence page. Assignee eligibility additionally requires exact `RECIPIENT_POLICY_MANAGE`; Coordination independently requires active membership and `coordination.work`. The adapter returns status-only facts and verifies only the latest immutable recipient policy `event_no`. It exposes no response, feedback or policy reason and performs no Coordination write. Coordination owns the request lifecycle and invokes this adapter in its transaction; Learning remains the only policy writer.

## LEA-17 — bounded Principal assignment-completion oversight

### Supported owner contract

Learning owns `leadershipLearningOverview(identity, organizationId, schoolId, query)`. The query accepts an optional paired school-date range (maximum 93 days), exact class and subject UUID filters, a query-bound opaque cursor and a 1–50 page limit. The default window is school-local today minus 30 days through today plus 31 days, with the upper date exclusive. A current branch `PRINCIPAL` receives `learning.read_leadership`; School Administrator, Teacher, Parent and Student roles do not inherit it. Every read repeats live account/token, Principal membership, active School, release, entitlement and activation checks for Homework and its Academic, Staff and Student dependencies.

The read-only PostgreSQL transaction joins the current immutable published AssignmentVersion to CourseOffering, Section, Grade, Subject, its frozen AssignmentRecipient rows and at most one immutable accepted SubmissionAttempt per recipient. It returns class/subject assignment rows plus `expected due`, `submitted`, `awaiting` and `upcoming` counts under definition `assignment-completion.v1`. Due expected pairs are frozen recipients whose immutable due instant is at or before the server cutoff. Submitted counts one accepted attempt per pair. Awaiting is expected minus submitted. Future pairs remain separate and do not enter the due denominator. Private Student drafts and response text, learner identities, Teacher feedback drafts and performance inference are absent from the DTO.

The stable ordering is `(due_at, assignment_id)` and its cursor is bound to the effective dates and class/subject filters. Existing scoped due and assignment-version keys support this bounded query; no schema, migration or write transaction changes. Reads acquire no mutation locks.

### Completed LEA-17 composition

F08-A adds exact per-recipient extension/excusal history and separately designated named status evidence. F08-B connects that evidence to the typed Coordination lifecycle through a contextual source link and an exactly eligible academic assignee. Learning response and feedback content remain excluded. Verification covers the PostgreSQL denominator, pagination, cross-scope and revocation cases, source reauthorization, exact replay, independent verification, direct desktop/mobile comparison and repeat-safe fictional scenarios.

## LEA-18 — descriptive feedback-turnaround projection

Learning owns `leadershipFeedbackTurnaround(identity, organizationId, schoolId, query)`. It reuses the explicit branch Principal `learning.read_leadership` capability and repeats the same live account, token, membership, school, release, entitlement, activation and dependency checks as assignment completion. The query accepts a paired school-date interval of at most 93 days and exact class/subject filters. The default cohort runs from branch-local today minus 30 days through tomorrow, with the upper boundary exclusive.

Definition `feedback-turnaround.v1` includes immutable `LearningSubmissionAttempt` rows whose `accepted_at` lies within the explicit branch-timezone timestamp boundaries and is no later than the server as-of instant. First feedback is `MIN(LearningFeedbackVersion.published_at)` for the exact submission at or before that as-of instant. Private `LearningFeedback` draft fields never enter the query. Later immutable publication versions do not reset the first-publication instant. Accepted submissions without a publication are **awaiting feedback** and do not enter the median. Unsubmitted recipients never enter the cohort. Turnaround is elapsed clock seconds from acceptance to first publication; the UI rounds exact seconds to minutes, hours or days and displays **Not available** when no published-feedback result exists.

The read executes in one `REPEATABLE READ` transaction and returns accepted, first-published and awaiting counts, median elapsed seconds, branch timezone, interval, cutoff, filter options and definition metadata. It returns no Student, Teacher or account identifier; response, draft and feedback text; ranking; target; SLA; overdue flag; or comparative performance label. Existing submission accepted-time, feedback-version submission/publication, offering, section and subject indexes support the bounded query. There is no schema, migration, mutation, lock or duplicated report table.

The current owner model has no assignment-cancellation or published-feedback withdrawal lifecycle, so the projection fabricates neither. LEA-18 coordination remains absent: F08-B's recipient source cannot represent the aggregate feedback-turnaround cohort. A narrow owner source must pin the class/subject/cohort version, exact subject-lead eligibility and evidence disposition without revealing Student or Teacher content. Verification covers exact cohort boundaries, private-draft exclusion, first publication despite later revisions, awaiting and empty cohorts, filtering, cross-scope/revoked authority, no sensitive fields, and desktop/mobile comparison with the approved LEA-18 workflow. The supported descriptive slice remains PARTIAL until that separate source is implemented.

## LEA-03 — private text draft and on-time submission

### Narrow release contract

LEA-03 adds one text-only response lifecycle to the immutable assignment version published by LEA-01. A frozen Student recipient with the same live `learning.assignment.read_self` access may save one private draft, review it, and explicitly submit it while the authoritative server instant is at or before `due_at`. The accepted snapshot is immutable. The authoring Teacher may read accepted submissions only while the Teacher retains the exact current CourseOffering assignment and Learning module authority. Parents, other Students and unrelated Teachers never receive response text. Files, late work, extensions, resubmission, reopening, grading, feedback, returned/excused/closed policy and offline storage remain outside this slice.

The branch timezone is presentation context for the absolute `due_at` instant. The server clock decides acceptance; a browser-supplied clock or status is never authoritative. A successful receipt replay remains readable after the deadline when the same live Student access still authorizes the assignment.

### Tables and joins

| Physical table | Scope and ownership | Invariants and indexes |
|---|---|---|
| `vs_learning_assignment_draft` (LearningAssignmentDraft) | id/org/school/version/recipient/student/access uuid; status/version; private response_text; saved/submitted timestamps | Student-owned private text draft for one exact published assignment recipient. | Scoped recipient/version/Student-access FKs; one draft per version/Student; positive version and bounded text checks; Student and assignment indexes |
| `vs_learning_submission_attempt` (LearningSubmissionAttempt) | id/org/school/version/recipient/student/access/draft uuid; attempt_no; immutable response_text; effective_due/accepted timestamps; receipt reference | Immutable on-time Student text submission snapshot and receipt. | Scoped recipient/version/access/draft FKs; one attempt per version/Student; on-time and bounded text checks; unique receipt; append-only trigger |

Student reads join the live accepted portal access → frozen student binding → recipient → current immutable assignment version → draft/attempt. Teacher reads join assignment → current version → accepted attempt and independently re-establish the author Teacher's current exact offering assignment. Parent assignment projection deliberately stops before draft/attempt tables.

### Commands, queries and transaction protocol

- `studentWork(identity, studentId, assignmentId)` returns published assignment metadata plus only that Student's draft version/text and accepted receipt.
- `saveStudentDraft(identity, studentId, assignmentId, expectedVersion, text, key)` locks account → organization SHARE → school UPDATE → assignment SHARE → recipient → draft, repeats live Student purpose/module/enrollment and exact frozen-binding checks, and creates or CAS-updates the private draft. A submitted draft rejects writes. Audit/receipt payloads contain identifiers, state and version only; response text is excluded.
- `submitStudentWork(identity, studentId, assignmentId, reviewedAssignmentVersion, expectedDraftVersion, key)` uses the same lock prefix and locks the draft. It reauthorizes before receipt disclosure. A matching accepted receipt is returned before deadline validation so a lost on-time response can be recovered later. A new command requires the assignment still published/current, the exact reviewed version, the unchanged non-empty draft and `server_now <= due_at`. It inserts one immutable attempt, marks the draft `SUBMITTED`, appends safe audit/outbox/command receipt evidence and commits atomically.
- `teacherSubmissions(identity, assignmentId)` and `teacherSubmission(identity, assignmentId, submissionId)` are bounded (maximum 100 for this slice), assignment-scoped reads. They return accepted content and time only after live account, branch/module, author Teacher and exact current offering-assignment checks.

Same command key and semantic payload returns the original authorized result; a changed payload conflicts. Concurrent saves use draft version CAS. Save versus submit locks the same draft: one winner commits, and the loser receives `STALE_VERSION`/`CONFLICT` without changing the accepted snapshot. The unique assignment-version/Student attempt constraint prevents two distinct submission intents from creating duplicate attempts.

### UI, errors and verification

Student detail uses the approved `Write response` → `Review work` → `Receipt` stages. Back/Continue preserves in-tab text; only acknowledged Save draft persists, and only final Submit creates an attempt. A stale save retains attempted text and offers reload. Unknown submission outcome retains the exact payload/key for retry. Directory status supports only `DRAFT` and `SUBMITTED` in addition to existing open published work; absent Returned/Closed/Excused semantics remain visibly unavailable. My day excludes submitted work from actionable priorities.

Verification requires real PostgreSQL evidence for isolation, CAS, deadline boundary, post-deadline receipt replay, concurrent duplicate and save/submit races, revocation/unavailability, immutable attempt content, scoped Teacher reads and Parent denial. Browser evidence covers the Teacher publication → Student save/reload/review/submit/receipt → Teacher list/detail journey at desktop and mobile, including keyboard focus and direct reference comparison. Every new tenant-table migration carries TEN-03 Path A metadata; enforcement remains the consolidated production gate.

## LEA-04 — private Teacher feedback and Student publication

### Design-readiness decision

LEA-04 implements the approved TEA-29 → STW-22 text-only feedback slice. The current authoring Teacher for the exact published assignment and current CourseOffering assignment may save private feedback against one immutable accepted submission and explicitly publish it. The submitting Student may read the latest published feedback through the existing exact `learning.assignment.read_self` binding. Parent assignment access does not grant feedback or response access. Publication releases comments only: it does not mark work Returned, Graded, Closed or Excused and creates no resubmission, reply, mark or rubric authority.

The two required fields are **What worked well** and **Next step for learning**, each normalized plain text from 1–4,000 characters. A private draft uses aggregate revision CAS. A published version is immutable. Publishing clears the private draft but retains the current published pointer; saving a later correction draft never hides or changes the current publication. The next explicit publication creates version `n+1`. This is the smallest conservative correction lifecycle authorized by the programme.

### Physical schema, joins and ownership

| Physical table (model) | Physical fields | Responsibility | Constraints and read indexes |
|---|---|---|---|
| `vs_learning_feedback` (LearningFeedback) | id/org/school/submission/reviewer/current_version uuid; revision; private draft strength/next-step; timestamps | Mutable private Teacher feedback root and pointer to the current published version for one accepted submission. | Scoped Submission/Teacher/current-version FKs; one root per submission; positive revision; paired bounded draft fields; reviewer/update index |
| `vs_learning_feedback_version` (LearningFeedbackVersion) | id/org/school/feedback/submission/publisher uuid; version; immutable strength/next-step; published_at | Immutable Student-visible published feedback snapshot pinned to one accepted submission. | Scoped Feedback/Submission/account FKs; unique feedback/version; bounded text checks; submission/publication index; append-only trigger |

Teacher reads start from live account/membership/capability → account/Person/active Teacher → exact authored published Assignment → current dated TeacherAssignment → exact accepted SubmissionAttempt → Feedback. Student reads start from live accepted StudentPortalAccess and `learning.assignment.read_self` → frozen Student binding/recipient → exact accepted SubmissionAttempt → Feedback.currentVersion. Every join carries organization and school scope. Guardian projections stop before Feedback and FeedbackVersion.

### Ports, transactions and recovery

- `teacherFeedback(identity, scope, assignmentId, submissionId)` returns the immutable submission plus only that Teacher's private draft and the current published version.
- `saveFeedbackDraft(... expectedRevision, strength, nextStep, key)` locks account UPDATE → organization SHARE → school UPDATE → assignment SHARE → submission UPDATE → feedback UPDATE, repeats live Teacher/resource/module checks, then creates or CAS-updates the private draft. Audit and command receipts contain IDs/revisions only.
- `publishFeedback(... expectedRevision, reviewedSubmissionId, key)` repeats the same guard and lock order, reauthorizes before replay disclosure, requires a non-empty unchanged draft and explicit final confirmation at the UI, inserts immutable version `n+1`, updates the current pointer, clears the draft, and appends safe audit/outbox/receipt evidence atomically.
- `studentFeedback(identity, studentId, assignmentId)` returns only the latest published version for that exact submitting Student. It never returns private feedback drafts.

Same actor/key/payload replays the original result; changed payload conflicts. Concurrent draft saves use revision CAS. Draft save versus publish locks the same root so one wins and the other receives `STALE_VERSION`. Because the Student submission table is immutable, feedback always remains pinned to the accepted content reviewed by the Teacher. Revoked Teacher or Student authority denies the next protected request.

### UI and verification

The Teacher submission reader links to an approved two-stage **Feedback → Return review** composition. Entered text survives Back/Continue in the active flow; only Save draft persists privately, and only the final **Publish feedback** action releases a version. Unknown publication retains the exact key/payload for receipt recovery. The Student receipt displays the latest published feedback, attempt number and publication time with a safe link back to assignment details. Teacher submission lists show Not started, Draft or Published without exposing text.

Focused verification covers validation, draft privacy, exact submission scope, Teacher authority/revocation, Parent/other-Student denial, stale save, publish replay after response loss, concurrent save/publication, immutable versions, correction versioning and unchanged Student submission content. Desktop/mobile comparison uses TEA-29 and STW-22 reference states; where their generic prototype cannot show the real receipt/recovery state, the established feedback/action patterns form a labelled narrow extension. Human review, font portability, native accessibility, TEN-03 and production readiness remain separate gates.
