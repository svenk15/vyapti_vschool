# Academic setup and teaching context — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## SA-COMP-02 — Review dependencies and retire academic catalog records

Workflow: SA-10. Depends on the verified ACA-01/02/03, STU-03 and ATT-04 owner behavior.

Outcome: a School Administrator sees complete dependency counts for grades, sections and subjects, confirms a prospective retirement with a reason, and retains all historical references. Current/future student placements and unresolved attendance sessions block the affected retirement with a direct recovery path; safe related sections/offerings retire atomically.

Acceptance: current scope, `class.manage`, academic release/license/activation and expected version are rechecked inside the existing School-guard transaction; replay is actor/scoped/input exact; no row is deleted; cross-branch IDs are hidden; PostgreSQL proves blocker/cascade/history/concurrency; desktop/mobile browser evidence proves explicit confirmation and useful dependency feedback. No schema migration is planned.

## ACA-01 — Configure academic year, terms, grades and sections

Depends on: IAM-02, TEN-02

Design: [flow ACA-01](DESIGN.md). Scope and API: POST /api/v1/academics/years; PUT /api/v1/academics/years/:id/terms; POST /api/v1/academics/grades|subjects|sections.

### Implementation instructions

1. Authorize school.manage for year/terms and class.manage for catalogs.
2. Lock account then School; replay receipt only after authorization.
3. Create DRAFT year and unpublished calendar atomically; terms replace only while DRAFT, within year and nonoverlapping.
4. Create school grade/subject and section after validating active references and matching year/campus.
5. Return joined display DTO; audit/outbox/receipt commit with version change.
6. Require the trusted `academic_core` release, active institution entitlement and branch activation on every read/write; do not enable it through browser input. Default deployment release remains deny-all. The local ACA-01 demo may explicitly pass `academic_core` to its server process and must use TEN-02 application commands to provision its synthetic contract/activation.

Files: extend `backend/modules/academics/application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/academics`, `test/functional/academics` and `test/e2e/academics` as the suite grows.

### Acceptance and test strategy

- Unit / application: Civil dates, term overlap, state rules, code normalization.
- Real PostgreSQL: Parallel no-campus duplicates: exactly one; cross-year/scope FK rejection; atomic year+calendar creation.
- Browser: Create year/terms/grade/subject/section then refresh; actionable duplicate and overlap errors.
- Failure contract: Duplicate code/section →409; invalid range/overlap→422; terms after OPEN→409; foreign/inactive references→404/409.
- Required DB effect: AcademicYear + SchoolCalendar on create; AcademicTerm replacement under year; GradeLevel, Subject, Section; transactional envelopes.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Create AY2026, Grade 8, Section A and Mathematics; add two adjacent terms; try an overlapping term and duplicate Section A; refresh and verify stored values.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## TT-00 — Reconcile timetable ownership and readiness

Depends on verified Academic setup, existing Attendance pinning semantics and Tenancy module configuration. Add the read-only readiness route described in DESIGN. It must obtain release, entitlement, activation and current permission from server-owned contracts, remain outside operational navigation while unavailable, and perform no planning write. Record the weekly-only reference deviation and the exact first-cut request/generation bounds.

Acceptance: denied and unavailable states are honest; no timetable/attendance row changes; lint, typecheck, boundary/backend and focused browser rendering at desktop/mobile. Human review remains PENDING. TT-01 follows only after its two scoped day-pattern tables, constraints, indexes, mutation guard and migration test are reconciled into the live LLD. SA-41 remains incomplete until draft editing, conflict preview, immutable publication and idempotent Attendance occurrence handoff are implemented.

## TT-01 — Configure a versioned weekly day pattern

Depends on TT-00, verified Academic setup, the trusted Timetable release, active institution entitlement and active branch activation. The Administrator outcome is one current branch/year draft containing teaching weekdays plus ordered lesson and break intervals. This task does not publish a timetable, assign lessons, create dated exceptions or generate Attendance sessions.

Acceptance: validate unique teaching days 1–7, 1–32 contiguous ordered periods, valid local times, nonoverlap and at least one lesson. Every protected read/write rechecks current account/token, membership, `timetable.manage`, release, entitlement and activation. Mutations use account→Organization→School guards, expected-version CAS, exact scoped idempotency and atomic audit/outbox/receipt evidence. Preserve published history while replacing only the one draft. Real PostgreSQL proves scope/FKs, replay, stale conflict, rollback and published-row preservation. Focused desktop/mobile browser journeys prove overlap recovery, save/reload, navigation visibility and responsive composition. The approved reference comparison remains partial until TT-02 supplies the weekly draft canvas and effective-date publication contract.

## TT-02 — Save, resume and discard a weekly timetable draft

Depends on TT-01. Implement the branch/year draft aggregate and slots exactly as reconciled in DESIGN. Use real scoped Sections, Offerings and effective TeacherAssignments; use the current TT-01 pattern and lesson period keys. The first cut is weekly and roomless under TT-00's accepted nullable-room boundary. Do not publish, validate TT-03 whole-branch clashes or generate Attendance occurrences.

Acceptance: at most 100 unique class/day/lesson-period slots; effective date within the academic year; each offering matches its section/year and each assignment matches the offering and covers effective date. Save/reopen and explicit discard use current authorization, module eligibility, account→Organization→School guards, version CAS and exact idempotency with atomic evidence. Discard retains the row and slots. The Administrator UI has a grid plus accessible list semantics, preserves in-flow edits, warns before abandoning changes, enables Save only after change and never exposes an unsupported two-week or room choice. Unit, real-PostgreSQL and sequential one-worker desktop/mobile browser evidence are required; human review remains PENDING.

## TT-03 — Preview whole-branch conflicts and publication impact

Depends on TT-02. Implement the read-only preview exactly as reconciled in DESIGN. Recheck the current draft/version, current calendar revision, assignment eligibility across the 42-day bounded horizon, class intervals and Teacher Person intervals across every class in the draft. Use current application authorization, tenant/branch scope, release, entitlement, activation and `timetable.manage`; reads do not acquire mutation locks. Count protected Attendance sessions only as an impact warning. Do not publish, generate/cancel sessions, infer occurrence reuse or persist a validation token.

Acceptance: same Teacher Person through two assignments at overlapping class periods blocks readiness; adjacent half-open periods pass; nonteaching calendar dates do not generate candidates; an assignment ending within the horizon produces an actionable issue; stale/foreign/permission paths are safe. The result distinguishes added/changed/removed candidate slots and protected-session count, with added-only comparison until TT-04 supplies a published baseline. Room validation is explicitly not applicable while the accepted nullable-room boundary has no room owner/column; do not claim it tested. Unit, real-PostgreSQL and sequential focused desktop/mobile preview evidence are required. TT-04 must reauthorize/recompute under the mutation guard and remains blocked until TT-03 passes.

## TT-04 — Publish an immutable timetable revision

Depends on verified TT-03. Reauthorize and recompute the reviewed preview inside the existing account → Organization → School guarded serializable transaction. Require draft expected version, exact preview digest, explicit acknowledgement and scoped command key. Copy the day pattern, periods, recurring slots and a complete JSON reproduction snapshot into a new immutable `PUBLISHED` revision. Close only the prior published revision's applicability metadata; never rewrite its content. Publication validates the bounded 42-day window and records `validated_until`; it does not claim validity beyond that window or perform TT-05 Attendance reconciliation.

Acceptance: applicability is half-open from `effective_from` to the next publication (or academic-year end); a successor must start after the current published revision. Exact replay returns the original publication, changed payload conflicts, stale review requires a renewed preview, concurrent publish yields one successor, and rollback leaves no partial snapshot/evidence. Published patterns/periods/slots are database-immutable. The receipt says Attendance reconciliation is `PENDING`. Real PostgreSQL, focused desktop/mobile review → confirm → receipt tests, repository gates and a production demo are required. SA-41 remains partial until TT-05.

## TT-05 — Reconcile bounded Attendance occurrences

Status: VERIFIED / human review PENDING (12 October 2026).

Depends on verified TT-04 and an accepted Attendance-owner planning contract. The coordinated contract settles stable occurrence identity, seven-day batches within the published `validated_until` horizon, resumable generation checkpoints, idempotent owner commands, cancellation rather than deletion of removed future generated sessions, and preservation of open/submitted sessions. It does not settle how to handle a pre-existing manually scheduled Attendance session occupying the same branch/year/class/date/period when no trusted timetable-source link exists.

Status: **IN_PROGRESS**. The owner approved an actionable per-occurrence block on 12 October 2026. Implement the narrow enlisted Attendance planning port and trusted source link; do not reuse the actor-facing manual schedule/cancel facade as an implicit system port. Verify creation/replay, mixed partial result, authorized manual cancellation then retry, frozen-session protection, concurrency, scope/revocation and lost-response recovery with real PostgreSQL; verify receipt → reconcile → conflict review → supported resolution → retry at desktop/mobile with one worker.

## Experience overlay consumption

EX-07 adopts the existing setup, calendar, offering and dated-assignment operations. It adds no recurring timetable engine or schema. Current versions, half-open dates, School guard and Attendance impact checks remain authoritative.

## ACA-02 — Publish calendar and open or close the year

Depends on: ACA-01

Design: [flow ACA-02](DESIGN.md). Scope and API: POST /api/v1/academics/calendars/:id/publish; POST /api/v1/academics/years/:id/open|close; GET /api/v1/academics/calendars/:id/evaluate?date=.

### Implementation instructions

1. Authorize school.manage and acquire guards.
2. Validate complete policy, dates/campuses and expected calendar/year version.
3. Compare affected existing sessions through attendance CalendarImpact port; no-op adapter allowed only before attendance tables exist, then replace it in ATT-01.
4. Append immutable revision and exceptions, then change current pointer/version in one transaction.
5. Open year requires published calendar; close requires no noncancelled scheduled/open session on or after school-local today. Persist events/audit/receipt.

Files: extend `backend/modules/academics/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/academics`, `test/functional/academics` and `test/e2e/academics` as the suite grows.

### Acceptance and test strategy

- Unit / application: Campus-over-school precedence; all weekdays validation; state transitions.
- Real PostgreSQL: Publication failure leaves pointer unchanged; deferred pointer FK; immutable records; close-vs-schedule serialization.
- Browser: Publish holiday/campus exception and evaluate dates; open year; term edit denied; close empty disposable year.
- Failure contract: Affected existing future session→409 CALENDAR_IN_USE; no calendar on open→409; pending future sessions on close→409; stale revision→409.
- Required DB effect: CalendarRevision, CalendarException, SchoolCalendar pointer/version; AcademicYear state/version; envelopes. No editing old revisions.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Publish weekdays and one holiday; inspect a teaching day and holiday; open the year; confirm term editing is disabled and old revision remains visible after a valid future revision.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ACA-03 — Create offerings and assign teachers

Depends on: ACA-02, PER-02

Design: [flow ACA-03](DESIGN.md). Scope and API: POST /api/v1/offerings; POST /api/v1/teacher-assignments; PATCH /api/v1/teacher-assignments/:id/end.

### Implementation instructions

1. Reauthorize class.manage plus trusted release, institution entitlement and branch activation on each protected read/write; mutations use account→Organization→School guards and recheck before replay/commit.
2. Create offerings only in an OPEN year with an active same-year section and active same-school subject.
3. Assign only an active Academics Teacher with an active People Employee for the entire half-open interval inside both the year and employment period. AccountPersonBinding is not required for an instructional assignment; it controls portal access separately.
4. Enforce one primary assignment per offering/date using the documented offering/date predicate under the shared School guard. End via expected-version CAS and an exclusive `valid_to`; reject surviving assignments when People offboards the Employee.
5. Use a zero-impact Attendance session port only while sessions cannot be scheduled. ATT-01 replaces it before scheduling release; ATT-02 owns actual end-assignment versus teacher-submit reauthorization evidence.
6. Persist Academics-owned Offering/Assignment changes and shared envelopes atomically; class list joins current scoped Section/Grade/Subject and date-effective Teacher/Employee/Person.

Files: extend `backend/modules/academics/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/academics`, `test/functional/academics` and `test/e2e/academics` as the suite grows.

### Acceptance and test strategy

- Unit / application: Half-open effective-date endpoints, teacher eligibility and transition rules.
- Real PostgreSQL: Scoped offering/assignment keys and FKs; concurrent same-offering assignment race; assignment-end CAS; Employee offboarding rollback when assignments survive; authorization and replay.
- Browser: Read current-year offerings, create offering, assign teacher, inspect effective dates; reject overlap and assignment outside employment.
- Failure contract: Overlapping assignment, inactive teacher/employee, closed year or impacted session→409; section/year mismatch→422; foreign references→404; missing capability→403; invalid range→422.
- Required DB effect: CourseOffering, TeacherAssignment; may create Teacher through academic owner when Employee already exists; envelopes.
- Persistence/security gate: preserve scoped composite FKs/unique keys and both offering/date and teacher/date indexes; serialize effective-range checks under School guard and reauthorize before replay/commit. Capture `EXPLAIN (ANALYZE, BUFFERS)` plans at the Bible §20 pilot profile and record actual plans/cardinality/timing; do not impose TEN-03's larger scale thresholds as the pilot gate. Under TEN-ADR-006 Path A, record class, scope, constraints, indexes, intended policy and TEN-03 closure in the LLD/registry; defer database enforcement to TEN-03 while application authorization stays active.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Create Grade 8 A Mathematics, assign the teacher for the year, then attempt an overlapping primary assignment and confirm it is rejected.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
