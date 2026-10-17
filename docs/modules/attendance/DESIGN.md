# Session attendance and accountable corrections — design

Phase 1 · Design revision 1 · 3 October 2026. Status: ATT-01 is implemented locally; ATT-02 design-ready and implementation in progress; later attendance workflows remain planned. Review unresolved deployment choices in FND-02 before real-data use.

## Database naming and physical mapping

All physical objects follow [the VS database contract](../../DATABASE_DESIGN.md). Table names and columns below are physical SQL names; workflow prose uses logical domain names. `organizationId` maps to `organization_id`, `schoolId` to `school_id`, and `scope` expands to both columns. Models retain PascalCase through Prisma `@@map`; camelCase fields use `@map`. Planned schemas are implemented only through their named tasks and reviewed migrations.

## Ownership, aggregates and values

AttendanceSession is the aggregate root; roster snapshot entries and attendance records are owned children. Lifecycle SCHEDULED→OPEN→SUBMITTED; any permitted nonterminal/session can become CANCELLED through explicit policy, with submitted cancellation restricted to attendance.correct. Values: SessionOccurrenceKey, SchoolDate, RosterRevision(hash of sorted student/placement/version membership), AttendanceStatus, LateMinutes(1..480), CorrectionReason(5..500). Events: SessionScheduled/Opened/Submitted/Corrected/Cancelled.v1. Records are mutable current projection only through aggregate methods; immutable revisions preserve prior submissions/corrections. Session version is the optimistic write guard.

## Module decisions

ATT-ADR-001: explicit OPEN freezes roster and version; no silent roster refresh at submission. Opening a future session is disallowed: schoolDate must equal school-local today and server now must be at or after startsAt. Submitting permitted only on that date; missed historical sessions require admin cancellation/replanning policy, not fabricated late teacher submission. An administrator can review incomplete history but cannot mark without teacher role+assignment.

ATT-ADR-002: complete atomic roster submission, no server-side partial draft. Mark all present only edits in-memory draft after explicit action. Alternative automatic all-present-on-open rejected. Exact missing/extra/duplicate student IDs fail validation.

ATT-ADR-003: correction is an admin command and immutable revision, not resubmission. A cancelled submitted session retains records, removes its contribution from metrics and records reason. Returning it to active is not supported in Phase 1.

ATT-ADR-004: the Principal first-release `register-coverage.v1` projection uses scheduled session end with no hidden grace period as its explicit due policy. This is distinct from the existing Administrator RPT-01 “started sessions” report definition and does not alter it. Attendance owns the projection and independently requires the narrow `attendance.read_leadership` capability plus current module/scope checks. It never grants school-wide roster, mark, explanation, correction, export or mutation authority.

ATT-ADR-005: Principal source evidence re-reads one scoped AttendanceSession and exposes its current lifecycle state, version, scheduled context and owner-maintained `state_updated_at`. New lifecycle writes set this nullable timestamp in the same transaction as the state/version change. The forward migration backfills existing lifecycle timestamps and command-receipt schedule evidence where available; legacy scheduled rows without trustworthy evidence remain null and the UI says so. Scheduled times, migration time and current time are not substituted for missing source evidence.

ATT-ADR-006: LEA-12 uses a separate Attendance-owned named-pupil review grant for one active branch membership, account and Student. Principal role, `attendance.read_leadership`, another pupil grant or a Coordination assignment never substitutes for this grant. Trusted operator provisioning may create or revoke the grant for synthetic development; real-data use additionally requires the school's pupil-detail disclosure purpose and TEN-03 closure.

The `pupil-pattern.v1` query accepts inclusive branch-local `fromDate`/`toDate` and a user-entered absent-session threshold. The window is 1–90 calendar days, cannot end after the branch-local current date, and is evaluated in one repeatable-read snapshot. Results include only Students named by current grants for the caller. Submitted, non-cancelled registers contribute their latest effective current Attendance record. The projection reports absent sessions, distinct absent dates and unique pupils separately. A due SCHEDULED register uses historical effective Enrollment/SectionPlacement for its offering section; a due OPEN register uses its frozen roster. Both remain missing coverage and never become absence. CANCELLED and not-due sessions contribute to neither. No explanation text, family relationship, correction history, export, diagnosis or hidden score is exposed.

The support handoff uses a new typed Coordination source `ATTENDANCE_PUPIL_PATTERN` with request kind `PUPIL_ATTENDANCE_SUPPORT`. Its source identity is an immutable Attendance-owned snapshot ID that binds the scoped Student, exact window, threshold, factual counts and evidence hash. Snapshot creation reauthorizes the named-pupil grant and uses the actor's stable command key; replay returns the same snapshot. The adapter reauthorizes the same named-pupil grant, branch and modules on inspect and retry, and exposes only factual bounded counts. It permits only `NO_CHANGE_NEEDED` verification. It does not change or relabel the existing `ATTENDANCE_SESSION` adapter and grants no marking, correction or explanation authority. An assigned Coordination worker must independently hold `coordination.work` and a current named-pupil grant for the same Student.

Read joins retain `(organization_id, school_id)` throughout: grant → Student/Person; AttendanceSession → CourseOffering/Section; SessionRosterEntry → AttendanceRecord for submitted/open frozen evidence; Enrollment → SectionPlacement for due pre-open scheduled coverage. The active-grant index complements the existing session school-day, roster student, placement roster and record indexes. No Attendance write occurs in this query. Coordination creation keeps its existing serializable receipt/audit boundary and re-inspects the source before commit. Revocation immediately denies projection, source inspection and protected receipt disclosure.

## Physical data contract

All tables remain planned until their named task migrates them; ATT-01 installs only `AttendanceSession` in this module. `scope` below means `(organizationId,schoolId)`. All business roots have version >=1. All scoped references require composite FK targets with matching unique keys, even when abbreviated in the table. Creation times use server clock; IDs server generated. Required unless nullable is stated. Enum labels are constrained enums/CHECKs, not unchecked strings. Do not silently implement a weaker constraint because Prisma syntax cannot express it; use reviewed migration SQL.

| Table | Fields and data stored | Meaning | Keys / constraints / query support |
|---|---|---|---|
| `vs_attendance_session` (AttendanceSession; ATT-01 MIGRATED, TT-05/LDR-03 extended) | id uuid PK; organization_id uuid; school_id uuid; offering_id uuid; school_date date; starts_at timestamptz(3); ends_at timestamptz(3); occurrence_key varchar(80); calendar_revision_id uuid; source_occurrence_id uuid nullable; status SCHEDULED/OPEN/SUBMITTED/CANCELLED; version int; roster_revision char(64) nullable; opened_at timestamptz(3) nullable; submitted_at timestamptz(3) nullable; submitted_by uuid nullable; cancelled_at timestamptz(3) nullable; state_updated_at timestamptz(3) nullable | One actual offering occurrence; retains calendar version and scope. A nullable trusted Academics occurrence link distinguishes timetable-generated sessions from manual sessions. `state_updated_at` is owner-written source freshness; null means trustworthy legacy evidence is unavailable. School timezone validates local date. | Scoped Offering/CalendarRevision and optional LessonOccurrence FKs; UNIQUE(scope,offering_id,occurrence_key); UNIQUE(scope,source_occurrence_id); UNIQUE(scope,id); CHECK starts<ends, known status and version>=1; index(scope,school_date,status,starts_at,id). |
| `vs_attendance_session_roster_entry` (SessionRosterEntry; ATT-02) | id uuid PK; organization_id uuid; school_id uuid; session_id uuid; student_id uuid; student_version int; enrollment_version int; display_name_snapshot varchar(210); roll_number_snapshot varchar(30) nullable | Exact membership, versions and minimal name/roll display frozen at OPEN. Access remains current. No mutable roster after OPEN in Phase 1. | Scoped Session and Student FKs; UNIQUE(scope,session_id,student_id); CHECK both snapshot versions>=1; immutable trigger; session cancellation retains rows; unique key supports read and record join |
| `vs_attendance_record` (AttendanceRecord; ATT-02) | id uuid PK; organization_id uuid; school_id uuid; session_id uuid; student_id uuid; status PRESENT/ABSENT/LATE/EXCUSED; late_minutes int nullable; current_revision int | Current submitted status; one per roster pupil. No blank record stored before submit. | FK(scope,session_id,student_id)→SessionRosterEntry UNIQUE(scope,session_id,student_id); UNIQUE(scope,session_id,student_id); CHECK recognized status; CHECK (status='LATE' AND late_minutes BETWEEN 1 AND 480) OR (status<>'LATE' AND late_minutes IS NULL); current_revision>=1; unique key supports roster join |
| `vs_attendance_revision` (AttendanceRevision; ATT-02) | id uuid PK; organization_id uuid; school_id uuid; session_id uuid; number int; kind SUBMIT/CORRECT/CANCEL; actor_account_id uuid; occurred_at timestamptz(3); reason varchar(500) nullable; changes jsonb | Immutable status diff with old/new values and affected student IDs; SUBMIT includes the complete initial status set and counts. No names, roll values or raw private notes in changes. | Scoped session FK; global UserAccount actor FK; UNIQUE(scope,session_id,number); number>=1; CHECK recognized kind; SUBMIT requires null reason and CORRECT/CANCEL require reason length 5..500; append-only trigger; unique key supports ordered history |
| `vs_attendance_pupil_review_grant` (AttendancePupilReviewGrant; LEA-12) | id uuid PK; organization_id uuid; school_id uuid; membership_id uuid; account_id uuid; student_id uuid; granted_by_operator_id uuid; granted_at/revoked_at timestamptz(3); version int | Explicit current authority to review factual Attendance outcomes for one named pupil. | Scoped Membership/account and Student FKs; UNIQUE(scope,account_id,student_id); version>0; active grant index(scope,account,revoked,student). |
| `vs_attendance_pupil_review_snapshot` (AttendancePupilReviewSnapshot; LEA-12) | id uuid PK; organization_id uuid; school_id uuid; grant_id uuid; student_id uuid; actor_account_id uuid; from_date/to_date date; threshold int; evidence_hash char(64); facts jsonb; created_at timestamptz(3); version int | Immutable exact evidence bound to one Coordination support handoff; contains factual counts and permitted display identity, never explanation/correction/family text. | Grant, scoped Student and actor FKs; inclusive window 1..90 days; threshold 1..90; version>0; UNIQUE(scope,id); actor/time index; owner-local immutable trigger. |

## Read workflows and joins

Teacher Today: current account→verified Person→Employee ACTIVE→Teacher active→Assignment covering schoolDate→Offering→Session. Requires attendance.read_class; assignment effective for the requested date plus current active membership/account. Query date is school-local today by default; explicit history date is no later than today and remains within the open academic year containing today, not browser timezone. An eligible teacher with no sessions receives an empty list; missing open-year/service state is an error, not an empty schedule.

ATT-01 query predicates are explicit. Admin offering selection resolves one active offering by `(organization_id, school_id, id)` and joins its active OPEN year, section/calendar, subject, plus the dated assignment predicate `valid_from <= schoolDate AND valid_to > schoolDate`; session creation only needs the eligible assignment rows for that offering/date. The teacher read is `AttendanceSession.organization_id=? AND school_id=? AND school_date=? AND status<>'CANCELLED'`, joined to assignment on the same scope/offering with `teacher_id=currentTeacher AND valid_from<=schoolDate AND valid_to>schoolDate`. Current membership, Person binding, active Employee/Teacher, attendance.read_class, module release/entitlement and branch activation are resolved server-side on every protected request. The session day index `(organization_id,school_id,school_date,status,starts_at,id)` supports the scoped date scan; Academics' `vs_academics_teacher_assignment_teacher_date_idx` and `..._offering_date_idx` support the join and offering/date check. Detail additionally requires attendance.read_school or a currently eligible, date-assigned teacher. No write locks are acquired for these reads.

Session detail authorizes by scope+assignment before returning children. SCHEDULED detail shows calculated roster preview; OPEN detail reads SessionRosterEntry; SUBMITTED joins each roster row to AttendanceRecord and latest revision metadata. Never left-join absent record into ABSENT. Admin detail requires attendance.read_school/class, with correction controls only attendance.correct. Report calculations delegated to reporting read contract, never stored competing daily totals.

## Screen contract

/teacher/today cards show time, subject, section, status. /teacher/sessions/:id supports explicit Open, P/A/L/E buttons, search, unmarked count, optional late minutes, Mark all present and confirmation summary. No default saved attendance. Announce validation/status to screen readers; 44px targets. Unknown result keeps draft+key and offers Check status, not a new save. /admin/attendance/sessions schedules dated instances and inspects correction history. Cross-date, cancelled and submitted states are read-only to teacher.

All screens additionally follow Bible §8: loading, empty, validation, permission, stale/conflict, temporary failure and acknowledged success; semantic labels, focus and mobile layout. No future-module navigation.

## Application ports and transaction boundary

Each named flow below is an application use case. Inputs/outputs are plain DTOs; adapters implement owned repositories and public cross-module facades. Use SchoolCommand, ActorResolver, Clock, IdGenerator and transactional envelope writers from the shared contract. Do not pass Prisma.TransactionClient into application/domain code. Generic `save(any)` is not a replacement for named commands. Domain factories create new roots/events; rehydration restores without events.

Mutations use the account → Organization → School guard protocol in Bible §7. Read-only flows do not take write locks. Bootstrap/auth-only commands use their documented account/provisioning transaction. Scoped school uniqueness/range checks run after locks. Reauthorize before replay and commit; only a successful transaction stores a receipt. Aggregate version, audit, outbox and response commit together. Exact flow-specific reads and writes below refine this shared behavior.

## ATT-01 — Schedule sessions and show each teacher their day

**Success response contract:** `{sessionId,version,status,schoolDate,startsAt,endsAt,offering:{id,subjectName,sectionName}}`. Teacher list uses `{items,nextCursor}` and only eligible sessions.

**Transport:** POST /api/v1/sessions; GET /api/v1/teacher/sessions?date=; GET /api/v1/sessions/:id. The scheduling metadata/envelope is capped at 8 KiB; time values are offset-bearing ISO instants and the idempotency header must match the body key. The response never accepts tenant/branch IDs from request data.

**Input:** Schedule offeringId,schoolDate,startsAt,endsAt,occurrenceKey,key; instants include explicit offset/UTC. Teacher read date optional.

**Workflow:**

1. Require current class.manage, attendance release, institution entitlement and branch activation for schedule; acquire account→Organization→School locks and validate the OPEN year/current calendar teaching day for section campus. Calendar publication, year closure, timezone updates and scheduling use this same School serialization boundary.
2. Resolve an active offering and exactly one eligible, active dated primary teacher; validate explicit-offset start/end instants map to schoolDate in the school timezone, end follows start and `endsAt - 1 ms` is still on that day. schoolDate cannot be before today (an elapsed start time earlier today is allowed).
3. Create SCHEDULED with pinned calendar revision and unique occurrence key; legitimately different occurrences need distinct keys/times.
4. Enlist Attendance-owned CalendarImpact reads so calendar publication/year close and teacher-assignment end query session state inside their existing owner transactions. Existing sessions prevent calendar changes that turn their dates non-teaching, year closure while pending sessions remain, and assignment end that strands a future session. The Student-owned transfer impact port is deferred to STU-03, which defines the first transfer workflow; no current Student mutation changes an existing placement.
5. Teacher query returns only own dated assigned sessions; empty schedule and service failure are distinct.

**Database writes / atomicity:** AttendanceSession + envelopes; no attendance records/roster rows yet.

**Errors and recovery:** Duplicate occurrence→409 unless same receipt replay; nonteaching day→422; no eligible teacher→409; same-section or same-teacher time overlap→409; ambiguous, offset-free, past or mismatched date/time→422; stale scope/configuration and concurrent duplicate races→409; missing calendar→409. Unknown service failure is 503 and invites retrying the same command key. Reads distinguish an empty schedule from permission, module and service failures.

```mermaid
sequenceDiagram
  actor U as User
  participant W as Delivery adapter
  participant A as ATT-01 use case
  participant P as Owner ports
  participant D as PostgreSQL
  U->>W: Request named flow
  W->>A: Validated input and verified session
  A->>P: Resolve offering and an eligible dated primary teacher
  P->>D: Scoped reads and transaction guards
  D-->>P: Current authorized facts
  A->>P: Create SCHEDULED with pinned calendar revision and unique occurrence key
  alt Preconditions hold
    P->>D: Apply documented writes atomically
    D-->>P: Committed result
    P-->>A: Safe result DTO
    A-->>W: Acknowledged outcome
    W-->>U: Updated view and next action
  else Conflict or denied access
    P-->>A: Typed failure, no partial business writes
    A-->>W: Safe error with request ID
    W-->>U: Explain recovery, keep permitted inputs
  end
```

**Verification:** Unit — Occurrence/date/calendar eligibility and role policy. Functional PostgreSQL — Schedule-vs-calendar publication serialization; occurrence race; scope/year consistency. E2E — Admin schedules; intended teacher sees it; other teacher does not.

**Design-readiness note (4 October 2026; implementation reconciliation 5 October; TT-05 race correction 12 October):** Attendance owns scheduled occurrences and envelopes; Academics owns offering, immutable calendar revision and dated primary-teacher assignment; Students owns placement history. Schedule takes account→Organization→School guards and enlists Attendance-owned calendar/year/assignment-impact reads through the existing Academic transaction; same-offering duplicate receipt uses `UNIQUE(scope,offering_id,occurrence_key)` and the command receipt, while section occupancy and Teacher Person overlap use the School guard. Scoped offering/calendar FKs and `(scope,school_date,status,starts_at,id)` support scoped day reads. `TeacherAssignment` has both offering/date and teacher/date indexes; assignment facts are not copied into Attendance. No room allocation is modeled. `/admin/attendance/sessions` and `/teacher/today` reuse shared UI; attendance routes stay thin. Path A registers the migrated AttendanceSession as BRANCH with `(organization_id,school_id)`, owner/policy/constraints/indexes and TEN-03 closure; application authorization remains enforced and database policies/restricted roles remain deferred. Student transfer impact is deferred until STU-03 defines a placement-changing use case to consume it. The separate Bible pilot query-plan/latency profile applies to pilot evidence; TEN-03 owns its distinct larger RLS scale profile. No product decision blocks ATT-01.

**Planned query evidence:** At ATT-01 pilot verification, run `EXPLAIN (ANALYZE, BUFFERS)` for (1) active offering plus date-effective assignment by `(organization_id,school_id,offering_id,schoolDate)` and (2) the scoped session date read joined to assignment by `(organization_id,school_id,teacher_id,schoolDate)`. Record actual synthetic row counts, index names, buffers and latency in the task evidence; do not treat the TEN-03 multi-client scale profile as an initial pilot gate. Query plans do not replace TEN-03 restricted-role policy tests.

### TT-05 Attendance planning boundary — 12 October 2026

TT-05 adds nullable `source_occurrence_id uuid` to AttendanceSession. It is server-owned, scope-FK references the Academics LessonOccurrence stable identity, and is unique per branch when non-null. Browser scheduling cannot set it. Existing manual rows remain null and unchanged. The Attendance planning port is an enlisted application boundary receiving an opaque transaction plus trusted scope/actor and a server-derived occurrence. It rechecks Attendance release, institution entitlement, branch activation, current membership and `timetable.manage` before owner writes.

TT-07/F07-B retains Attendance ownership of register state while allowing Academics to resolve the effective Teacher for one trusted published occurrence. The enlisted Attendance cover port accepts only a server-resolved scoped occurrence and returns `ABSENT` or the current `SCHEDULED|OPEN|SUBMITTED|CANCELLED` state; it never accepts browser authority. Cover activation is allowed only when no Attendance session exists or the linked session is still `SCHEDULED`. The same Academics transaction rechecks the named substitute's eligibility, availability and collisions before making the exact cover ACTIVE. Attendance marking/detail authorization then resolves a source-linked session through the current ACTIVE cover: the substitute gains authority for that occurrence and the original Teacher loses current marking authority while separately authorized historical access remains unchanged. `OPEN`, `SUBMITTED` and `CANCELLED` records are never reassigned, canceled or rewritten by Timetable cover.

Before creation the adapter locks/reads the current stable occurrence context and checks every non-cancelled session on the local date. A conflict exists when intervals overlap and either the scoped Offering joins the same Section or the date-effective assignments resolve to the same Teacher Person. Matching labels, period names or browser IDs are never authority. A row already linked to the same occurrence is idempotent. An unlinked manual conflict is returned with safe review details and is never adopted, overwritten, cancelled, relinked or duplicated. Cancellation of a mistaken manual row remains the existing actor-authorized cancellation command. OPEN/SUBMITTED rows and their roster/records/revisions remain protected.

## ATT-02 — Open the exact roster and submit attendance

**Success response contract:** Open `{sessionId,version,status:"OPEN",rosterRevision,roster:[{studentId,displayName,rollNumber}]}`; submit `{sessionId,version,status:"SUBMITTED",revision,submittedAt,counts:{present,absent,late,excused}}`.

**Transport:** POST /api/v1/sessions/:id/open; POST /api/v1/sessions/:id/submit

**Input:** Open expectedVersion,key; Submit expectedVersion,rosterRevision,entries[{studentId,status,lateMinutes?}],key. Max 200 pupils per pilot session.

**Workflow:**

1. Require attendance.mark and dated assignment; lock account/School then session; recheck school-local today.
2. Open calculates eligible live roster through Student facade, refuses empty/>200, inserts frozen entries/hash and OPEN version atomically.
3. UI prepares in-memory statuses, explicitly shows Not submitted, validates all entries and confirms counts.
4. Submit reauthorizes and validates version/hash/exact roster ID set/status fields; save all current records plus immutable SUBMIT revision.
5. Set SUBMITTED/by/at/version; audit/outbox/receipt commit; on replay return original authorized receipt after scope check.

**Database writes / atomicity:** Open: SessionRosterEntry + session version/hash/status. Submit: AttendanceRecord for every pupil + AttendanceRevision + session metadata + envelopes.

**Errors and recovery:** Empty roster→409 EMPTY_ROSTER; changed version/hash→409; missing/extra/duplicate entries→422; revoked assignment→403; closed date/session→409.

**Authorization and roster query:** Every open, submit, detail and replay resolves the current account/token, active branch membership, effective `attendance` release/entitlement/activation (including its `student_core`, `academic_core` and `staff_core` dependencies), `attendance.mark`, active Employee/Teacher and assignment effective on the session's schoolDate. Only the assigned teacher may open or submit; `attendance.read_school` permits admin inspection but never marking. No tenant ID is accepted from the request. The Student-owned enlisted roster read scopes all rows to the active session's branch and offering Section, requires an ACTIVE Student, an OPEN year and Enrollment/Placement intervals containing `schoolDate`, and joins Person name and Placement roll. This read is used only after Attendance authorization; it does not mutate Student data. Read-only detail does not take write locks; mutation retries reauthorize and take the normal guards/locks before returning a receipt.

**Snapshot and submit consistency:** Open requires SCHEDULED, expected session version, school-local today equal to `schoolDate`, and server time at/after `starts_at`. Lock order is account → Organization → School → AttendanceSession, with the School lock taken before querying the live roster. Enrollment/transfer and open therefore see a single School-serialized state: the first committed state wins; once OPEN, that exact snapshot is never refreshed. Empty roster and >200 rows reject without state change. Store Student/enrollment version and display/roll snapshot, sorted by student ID; `roster_revision` is SHA-256 over canonical sorted student ID, both versions and snapshot display/roll fields. Submit requires OPEN, same school-local date, expected session version, exact stored roster hash, and exactly one valid entry for each frozen student; `late_minutes` is allowed only for LATE. It writes every record, one SUBMIT revision numbered 1, and session SUBMITTED metadata in one transaction. Same actor/scope/key and same canonical payload replays the committed result after fresh authorization; changed payload under that key conflicts. A lost response retains the exact in-memory payload/key for retry; after refresh the read model is authoritative.

**Read and query support:** The roster query uses `(organization_id,school_id,section_id,valid_from,valid_to,enrollment_id)` on SectionPlacement plus its date/year/status joins; the source Enrollment and Student scope keys are mandatory. At most 201 rows are fetched to distinguish 0, 1–200, and overflow. Frozen roster/detail joins are by `(organization_id,school_id,session_id)`; the unique session/student key supplies exact membership and AttendanceRecord joins. Revision history orders by number. Pilot query evidence will use `EXPLAIN (ANALYZE, BUFFERS)` for the live Section/date roster and frozen roster/record read at the documented representative pilot size; record actual row counts, indexes and buffers. The larger TEN-03 load profile is separate.

**Database classification and migration:** All three added tables are BRANCH-classified with `(organization_id,school_id)`, owner `attendance`, current-membership read/write intent and `WITH CHECK` scope intent registered under TEN-ADR-006 Path A. The migration must add that metadata and TEN-03 closure gate before creating any tenant table; RLS enforcement is deferred to consolidated TEN-03. Application authorization remains active. No existing Student or People row is updated by ATT-02.

**Design-readiness note (5 October 2026):** Resolved exact source Section/date/OPEN-year roster predicate; `attendance.mark` versus read-only admin permission; current assignment and module dependency checks; lock order and point-in-time freeze behavior; 200-row limit; deterministic hash/version contents; exact physical table constraints/indexes; atomic submit, immutable history and stable-key retry; typed conflict/validation/authorization/unavailable outcomes; UI draft recovery and verification. No unresolved product decision blocks implementation. ATT-01 is VERIFIED/PENDING; its task does not require human PASSED as an ATT-02 dependency.

```mermaid
sequenceDiagram
  actor U as Teacher
  participant W as Delivery adapter
  participant A as ATT-02 use case
  participant P as Owner ports
  participant D as PostgreSQL
  U->>W: Request named flow
  W->>A: Validated input and verified session
  A->>P: Open calculates eligible live roster through Student facade, refuses empty/>200, inserts frozen entries/hash and OPEN version atomically
  P->>D: Scoped reads and transaction guards
  D-->>P: Current authorized facts
  A->>P: UI prepares in-memory statuses, explicitly shows Not submitted, validates all entries and confirms counts
  alt Preconditions hold
    P->>D: Apply documented writes atomically
    D-->>P: Committed result
    P-->>A: Safe result DTO
    A-->>W: Acknowledged outcome
    W-->>U: Updated view and next action
  else Conflict or denied access
    P-->>A: Typed failure, no partial business writes
    A-->>W: Safe error with request ID
    W-->>U: Explain recovery, keep permitted inputs
  end
```

**Verification:** Unit — Exact set equality, status/late validation, lifecycle, deterministic roster hash. Functional PostgreSQL — Atomic rollback after records; submit lost-response replay once; open vs enrollment transfer; two-tab conflict. E2E — Teacher marks exceptions, confirms, refreshes read-only result; network retry and stale tab.

## ATT-03 — Review and correct submitted attendance

**Success response contract:** `{sessionId,version,revision,correctedAt,changes:[{studentId,from,to,lateMinutes}]}`; history has actor safe display name, time, reason and immutable revisions.

**Transport:** POST /api/v1/sessions/:id/corrections; GET /api/v1/sessions/:id/history

**Input:** expectedVersion,changes[{studentId,status,lateMinutes?}],reason 5–500,key. Changed subset nonempty; reject duplicate student IDs and no-op changes.

**Workflow:**

1. Require attendance.correct for command; acquire guards and submitted session.
2. Validate students belong to frozen roster, expected version and meaningful mandatory reason.
3. Calculate old/new diff; reject ordinary teacher correction despite class-read permission.
4. Update affected current AttendanceRecord rows, append CORRECT revision and increment session version.
5. Commit audit/outbox/receipt; show prior/current values and corrected badge with author/time.

**Database writes / atomicity:** AttendanceRecord statuses/revision, immutable AttendanceRevision, AttendanceSession.version and envelopes.

**Authorization and physical contract:** Recheck active account/token, Organization/School, membership, `attendance` and its `student_core`/`academic_core`/`staff_core` dependencies and current resource permission for every history read or correction. `attendance.correct` is currently granted only to School administrators; class-read teachers cannot mutate. Administrator history requires current `attendance.read_school`; TEA-14 additionally permits only the assigned Teacher with current `attendance.read_class` to read that exact submitted session history. No tenant ID comes from the request. Correction locks account → Organization → School → AttendanceSession, then reads current roster/records and derives old values server-side. Read paths use no write locks.

ATT-02 already provides the physical contract: `vs_attendance_record` has scoped `(organization_id,school_id,session_id,student_id)` membership and `current_revision >= 1`; `vs_attendance_revision` has scoped session and global actor FKs, unique `(organization_id,school_id,session_id,number)` (`vs_attendance_revision_number_key`), known-kind/reason constraints and an immutable trigger. No new table or migration is expected. A correction updates only selected current record rows to the next revision, appends one CORRECT JSON change set with student IDs and from/to status values, increments session version, and commits safe evidence atomically. Revision changes may retain student IDs/statuses in Attendance-owned history, but names, roll values, emails and raw pupil PII are excluded from audit/outbox/receipt.

History reads filter by `(organization_id,school_id,session_id)` and order by `number` on the revision unique index. Current record values join the frozen roster by scoped session/student key. After branch authorization, actor display resolves through AccountPersonBinding→Person; an unbound administrator receives the generic “School administrator” label. No email is returned. Record EXPLAIN ANALYZE/BUFFERS for history and roster/current-record join with counts, indexes and buffers; small synthetic plan evidence is separate from the Bible pilot performance gate and TEN-03's scale profile.

Failures are typed: invalid reason/status/late-minute shape→422; teacher/unauthorized→403 or resource-safe 404; no-op, duplicate/out-of-roster IDs, wrong lifecycle or stale version→409; foreign session→404; database/evidence failure→503 with record, session, revision and receipt rollback. Same actor/scope/key/canonical command replays the prior result after current authorization; changed payload conflicts. Concurrent correction writes serialize on the session, so only the command with the current expected session version can commit.

**Errors and recovery:** Teacher denial→403; missing reason→422; cancelled/non-submitted→409; stale concurrent correction→409.

```mermaid
sequenceDiagram
  actor U as School administrator
  participant W as Next hosting adapter
  participant A as Attendance use case
  participant R as Attendance repository
  participant D as PostgreSQL
  U->>W: POST correction with version, changes, reason and key
  W->>A: Verified identity and bounded input
  A->>R: correct(sessionId, command)
  R->>D: Recheck current account, branch, modules and attendance.correct
  R->>D: Lock account → organization → school → session
  R->>D: Read scoped session, frozen roster and current records
  alt Submitted session, version and change subset valid
    R->>R: Derive old/new values and next revision
    R->>D: Update selected records, append CORRECT revision, increment version and write evidence
    D-->>R: Commit all or roll back all
    R-->>A: Safe correction result
    A-->>W: Result
    W-->>U: Updated values and correction status
  else Permission, lifecycle, version or validation failure
    R-->>A: Typed failure; transaction writes nothing
    A-->>W: Safe error and request ID
    W-->>U: Explain recovery and retain editable draft
  end
  U->>W: GET scoped revision history
  W->>A: Verified identity
  A->>R: history(sessionId)
  R->>D: Recheck read permission; no write locks
  R->>D: Read ordered scoped revisions and safe actor labels
  D-->>R: History
  R-->>W: Safe revision DTOs
  W-->>U: Current values, reasons and history
```

**Verification:** Unit — Correction subset/diff/no-op; normalized reason bounds; status/late-minute pairing. Functional PostgreSQL — scoped current-row update, next revision number/session version, concurrent correction with stale loser, same-key replay and changed-payload conflict, forced evidence failure rollback of every write, immutable trigger, current permission/dependency and foreign-scope denial. E2E desktop/mobile — admin corrects absent to excused and sees history values/reason/safe actor/time; assigned teacher remains read-only and direct action is denied. Run EXPLAIN ANALYZE/BUFFERS for revision history and roster/current-record join. Keep pilot benchmark and TEN-03 load evidence distinct.

**Design-readiness note (5 October 2026):** ATT-02 is implementation-VERIFIED/PENDING and no explicit acceptance gate blocks this dependency. Reused existing revision schema and `attendance.correct` capability; resolved current admin/history permission boundaries, transaction guard order, version/revision numbering, subset/no-op/reason semantics, safe history projection, idempotency, race/rollback/errors, query indexes and browser acceptance. No unresolved product or schema decision blocks ATT-03.

## ATT-04 — Cancel sessions and recover failed submissions

**Design-readiness note (5 October 2026):** ATT-03 and STU-03 are VERIFIED/PENDING; their implementation status satisfies this task's dependencies, with no human-PASSED gate recorded. The existing `vs_attendance_session` already has `cancelled_at`, `status`, `version` and scoped day/occurrence indexes; `vs_attendance_revision` already permits immutable `CANCEL` rows keyed by `(organization_id,school_id,session_id,number)`. `vs_tenancy_tenant_command_receipt` is organization/account/command/key unique and stores a safe response JSON, but has no branch column; every found response therefore must resolve its session ID and pass current branch/resource authorization before returning it. No migration/table/index is needed for ATT-04. Path A remains in force: application authorization runs on every read/write; RLS is deferred to TEN-03, and the existing BRANCH table registry entry remains gated on TEN-03 closure.

Cancellation owner is Attendance. `AttendanceSession` owns `SessionRosterEntry`, `AttendanceRecord`, and immutable `AttendanceRevision`; cancellation changes only session status/time/version, adds one revision and standard tenancy audit/outbox/receipt evidence. It never deletes rows or reverses status. Reason is NFC-normalized/trimmed, 5–500 chars, stored only in the owned revision; audit reason stays a fixed generic label and outbox/receipt contain no student IDs, names, roll numbers or free-text reason. The command hash binds schema version, organization, school, actor, session, expected version, reason and key. Reuse by the same actor/scope/command/key with the same hash returns the safe original result after fresh authorization; a different payload is IDEMPOTENCY_CONFLICT.

For SCHEDULED/OPEN, cancel requires current `class.manage`; for SUBMITTED it requires `attendance.correct`. Recheck active account/token, active organization/school membership, current grant, active Attendance and dependency entitlements/branch activations, release manifest and the session in scope on every call. No teacher can cancel. Session detail/history remain administrator school-read operations after cancellation; show the retained submitted records and revisions read-only. The admin day list includes CANCELLED rows so history is reachable; teacher lists continue excluding them. Future metrics must predicate out `status='CANCELLED'`; no report is added in this task.

Add `GET /api/v1/commands/:command/key/:key` for the allowlisted opaque names `attendance.submit` and `attendance.cancel`. It queries receipts by current organization and actor. If the key exists only for another actor, return resource-safe 404; if the actor's matching receipt is found, resolve its `sessionId`, re-run current scoped read authorization (including current teacher assignment for a submit receipt), and return only the allowlisted safe result. A receipt from another branch or revoked authorization is 404. Only a truly absent key returns UNKNOWN. This makes a leaked/replayed URL insufficient to recover receipt data. The cancel command has no response-loss mutation in the UI; submission preserves its key and draft when transport outcome is unknown, checks status, and offers same-payload/same-key retry only after UNKNOWN. FOUND renders the committed result. Status checks are reads and acquire no write locks.

Mutation protocol preserves account → organization → school → session lock order. Submit and cancel both lock the same scoped session row before state/version checks, then write session/revision/evidence within one serializable/transactional boundary using the repository's established isolation and School configuration guard. If submit wins, a stale cancellation returns 409 and changes nothing; if cancel wins, submit returns 409 and writes no records. Exactly one transition/revision/receipt/outbox is committed. Same-key replay occurs only after current permission/scope checks. Reads remain lock-free. Existing indexes support scope/date/status list reads and session/revision lookup; receipt uniqueness supports actor command reconciliation.

**Failure/API/UI details:** cancel POST accepts `{expectedVersion,reason,key}` and returns `{sessionId,version,status:"CANCELLED",cancelledAt,revision}`. Errors: unauthenticated 401; forbidden current grant 403; foreign/revoked resource 404; malformed or short/long reason 422; stale version, already cancelled, or concurrent transition 409; DB/evidence failure 503 with full rollback. Admin detail offers a reasoned cancel confirmation only for SCHEDULED/OPEN/SUBMITTED; CANCELLED is read-only and displays retained history. The teacher sees no cancelled sessions. Use existing shared controls, accessible status/error feedback, and no optimistic status change before the response.

**Query contract and evidence:** admin day list uses `(organization_id,school_id,school_date,status,starts_at,id)` and includes all four statuses. Teacher/date reads retain current assignment join and `status <> 'CANCELLED'`. Receipt lookup uses its existing unique organization/actor/command/key index. Record EXPLAIN ANALYZE for these predicates/receipt lookup in functional evidence; do not claim the Bible pilot latency target from a tiny fixture or conflate it with TEN-03's larger scale profile.

```mermaid
sequenceDiagram
  actor U as Admin/teacher
  participant W as Attendance HTTP/UI
  participant A as Attendance facade
  participant P as Attendance repository
  participant D as PostgreSQL
  U->>W: Cancel session or check submit result
  W->>A: Verified identity, scoped command/key
  A->>P: Reauthorize membership, grant, entitlement and resource
  P->>D: account→organization→school→session guards for mutation
  alt cancel command
    P->>D: Update session + CANCEL revision + audit/outbox/receipt atomically
    D-->>P: committed safe result
  else status check
    P->>D: Own receipt lookup, then scoped current resource authorization
    D-->>P: FOUND safe result or absent
  end
  P-->>W: typed result/UNKNOWN/error
  W-->>U: canceled history, recovered result, retry or conflict
```

**Verification criteria:** unit cancellation-state and reconciliation tests; real PostgreSQL submit-vs-cancel race proving one winner, no duplicate evidence and retained rows; revoked membership/assignment and other-actor/branch receipt checks; injected evidence failure rollback; explain plans for admin/teacher day predicates and receipt lookup. Playwright simulates a committed submission whose response is dropped, recovers FOUND, then cancels a separate synthetic submitted session and verifies it remains visible to admin with history while omitted from the teacher list and any attendance denominator. Metrics denominator assertion is a direct scoped query contract until reporting ships.

**Success response contract:** Cancel `{sessionId,version,status:"CANCELLED",cancelledAt,revision}`; command status `{state:"FOUND",result}` or `{state:"UNKNOWN"}`. UNKNOWN is not proof the command failed; same-key retry is safe.

**Transport:** POST /api/v1/sessions/:id/cancel; GET /api/v1/commands/:command/key/:key (key URL opaque, no student/token content)

**Input:** Cancel expectedVersion,reason,key; status query requires current actor/scope and command allowlist, returns only own safe receipt or UNKNOWN.

**Workflow:**

1. For SCHEDULED/OPEN require class.manage; SUBMITTED requires attendance.correct, always reason.
2. Acquire guards, reauthorize resource and version; set CANCELLED without deleting snapshots/records/revisions.
3. Append CANCEL revision, audit, fact and receipt.
4. Unknown submission result: check receipt with the same actor/scope/key and read current session; FOUND reconciles success, UNKNOWN permits same-payload retry.
5. On cancellation/conflict/revocation return accurate UI state; clear drafts on denied access; cancelled sessions excluded from attendance denominator.

**Database writes / atomicity:** Session cancellation state/time/version + immutable cancellation revision + envelopes. No deleting records or mutating earlier revision.

**Errors and recovery:** Status lookup foreign/other actor→404; cancellation race→409; duplicate same command key returns receipt; no resurrection route.

```mermaid
sequenceDiagram
  actor U as User
  participant W as Delivery adapter
  participant A as ATT-04 use case
  participant P as Owner ports
  participant D as PostgreSQL
  U->>W: Request named flow
  W->>A: Validated input and verified session
  A->>P: Acquire guards, reauthorize resource and version
  P->>D: Scoped reads and transaction guards
  D-->>P: Current authorized facts
  A->>P: Append CANCEL revision, audit, fact and receipt
  alt Preconditions hold
    P->>D: Apply documented writes atomically
    D-->>P: Committed result
    P-->>A: Safe result DTO
    A-->>W: Acknowledged outcome
    W-->>U: Updated view and next action
  else Conflict or denied access
    P-->>A: Typed failure, no partial business writes
    A-->>W: Safe error with request ID
    W-->>U: Explain recovery, keep permitted inputs
  end
```

**Verification:** Unit — Cancellation capability by state; result reconciliation state machine. Functional PostgreSQL — Submit-vs-cancel serialization; no duplicate outbox; revoked actor cannot read prior receipt payload. E2E — Simulated response loss recovers; cancel submitted session retains visible history and excludes metrics.

## Administrator daily-attendance milestone contract — 11 October 2026

## TEA-14 — Teacher attendance history and correction handoff

**Design-readiness note (13 October 2026):** The approved Teacher pack resolves this Phase 1 read-only workflow. Attendance owns the directory, exact register and immutable revision projection. Academics supplies authority through the current bound Teacher and `TeacherAssignment`; Students data is read only from the Attendance-owned frozen roster. No mutation, durable support request, school-wide export, schema change or migration is introduced.

**Invariant and authorization:** Every list/detail/history read requires a live account/token, active Institution/Branch membership, `attendance.read_class`, released/entitled/active Attendance dependencies, an active AccountPersonBinding→Employee→Teacher identity, and a TeacherAssignment that is effective both now and on the session school date. Losing the current assignment makes the historical register unavailable even when the account taught it previously. A Teacher never receives `attendance.correct`; the handoff is explanatory and creates no record. Existing administrator `attendance.read_school` history remains available independently.

**Read schema and joins:** The directory reads `vs_attendance_session` by `(organization_id,school_id,status,school_date,starts_at,id)`, then its scoped `vs_academics_course_offering`→Section/Subject and current TeacherAssignment intervals. Exact detail reads the scoped Session→`vs_attendance_session_roster_entry`→`vs_attendance_record`; receipt history reads `vs_attendance_revision` ordered by its scoped session/number key plus global UserAccount→Organization AccountPersonBinding→Person for the safe actor name. Returned Teacher data is limited to session ID, offering ID, branch-local date/time, subject, class, state, frozen roster/effective marks, revision kind/time/actor and permitted reason. Raw receipt bodies, audit payloads and unrelated identities are excluded.

**Query/API contract:** `GET /api/v1/teacher/history` accepts normalized `q` (maximum 100) with `by=subject|class|date`, optional exact assigned `offeringId`, optional civil `date`, repeated `status=SCHEDULED|OPEN|SUBMITTED`, `sort=date|subject|class`, `order=asc|desc` and an opaque validated offset cursor. Results are bounded to the branch's school-local today and earlier; future commitments remain in My timetable/My teaching day rather than historical review. The repository applies all filters and deterministic tie-breakers before a bounded 25-row page; it never sorts a loaded browser page. `/teacher/history` preserves validated query state in the URL and Back/Forward history. `/teacher/sessions/:id` remains the exact read-only register; submitted state additionally reads immutable revisions. Class detail consumes the same Attendance query with its offering ID rather than joining Attendance tables from Academics.

**Transactions/concurrency:** These are lock-free `REPEATABLE READ` owner queries. Each request establishes transaction-local database scope and rechecks present authority; no write version, idempotency key or audit row applies because TEA-14 performs no mutation. Concurrent corrections are observed on the next request/reload, while one response remains internally consistent. Cancellation removes the record from Teacher history and direct Teacher detail, without deleting retained Attendance evidence.

```mermaid
sequenceDiagram
  actor T as Teacher
  participant H as Next host
  participant A as Attendance application
  participant P as Attendance PostgreSQL adapter
  participant D as PostgreSQL
  T->>H: Locate class/date/subject
  H->>A: Validated history query + verified identity
  A->>P: teacherHistory(scope, query)
  P->>D: Recheck account, modules, Teacher and current/date assignments
  D-->>P: Authorized scoped sessions only
  P-->>T: Bounded directory
  T->>H: Open exact submitted register
  H->>A: detail + history
  A->>P: Scoped read-only queries
  P->>D: Frozen roster, effective records, immutable revisions
  D-->>T: Receipt and administrator correction handoff
```

**Verification criteria:** Unit validation covers civil dates, allowlists, normalized search and cursors. Real PostgreSQL proves current-assignment list/detail/history, subject/date/offering filters, deterministic ordering, unassigned Teacher empty result, cross-branch denial, revoked-membership denial and continued Teacher correction denial. Playwright covers navigation, URL-backed search/sort/filter composition, class assigned-session link, submitted receipt/history, reload, desktop/mobile layout and keyboard focus. Existing Attendance mutation/replay evidence remains unchanged.

The bounded journey is `/sign-in` → `/admin` → `/admin/attendance/sessions/:id` for a submitted register → select one frozen-roster Student and the contextual session → select the corrected mark → record the required evidence → review and confirm → inspect the immutable revision/history → reload to prove persistence → return to Attendance. Its approved reference states are `VSchool_School_Admin_Review.html#/home`, `#/flow/SA-26` and `#/flow/SA-27`; production excludes the prototype review banner, simulated navigation and fictional values. SA-27 uses the approved `Select the record` → `Record evidence` → `Confirm` composition. Back/Continue retains the in-memory values, only final confirmation calls the correction command, and the disabled prototype draft action does not imply durable draft persistence. History and authorized cancellation remain reachable as secondary actions without reverting to the former combined register page. The page reuses the approved Administrator shell, `PageHeader`, `Card`, `SectionHeader`, status `Alert`/`Badge`, shared fields/buttons and semantic brand tokens. Current staged comparison evidence belongs in `docs/evidence/admin-attendance-correction-staged-2026-10-11/`.

No persistence or read-model extension is required. Existing scoped detail and history reads already return subject, section, branch-local date/time, frozen roster, current effective records and immutable revisions. Reporting keeps deterministic chronological session order before the bounded Today selection. Application authorization remains active: `attendance.read_school` permits inspection, `attendance.correct` permits correction of an already submitted register, and an administrator never receives `attendance.mark` through this screen.

Correction uses explicit editable, submitting, confirmed-success, confirmed-rejection, stale-version and unknown-outcome states. An unknown outcome retains and retries the exact normalized payload and idempotency key while preventing edits. A confirmed success remains successful if the independent history read fails; history offers its own refresh without repeating the mutation. A stale rejection retains the attempted change/reason, reloads authoritative detail and history, shows the comparison, and requires explicit review before creating a new command against the current version. Cancellation follows the same retained-command rule, cannot run concurrently with correction, and preserves read-only records/history after confirmation. Today distinguishes a successfully loaded empty schedule from attendance-summary failure, other-overview failure and unavailable capability/module.

Acceptance requires focused unit/browser coverage of state transitions, real-PostgreSQL replay/concurrency/authorization evidence from the existing owner tests, desktop/mobile reference comparison at 1440×1000 and 390×844, actual persistence after reload, visible focus/keyboard operation and a production build. Human visual acceptance, native assistive-technology checks and TEN-03 remain separate gates.

## ATT-05 / PAR-11–12 / SA-29 — Parent absence explanations

**Design-readiness note (15 October 2026):** The eight-hour Parent/Student programme authorizes the bounded first-release lifecycle below. Attendance owns the case because eligibility starts from one immutable submitted register outcome and school disposition must stay separate from correction. Guardians owns only the exact child-purpose authorization. This contract supersedes the older prototype options `PENDING`, `MORE_INFORMATION_REQUESTED` and `REJECTED`: the implemented states are `SUBMITTED`, `ACCEPTED`, `DECLINED` and `WITHDRAWN`. Attachments, future/planned absence, rich text, co-guardian disclosure, editing and external notification are excluded.

**Protected-text release boundary:** no applicable approved retention period exists. Portable composition therefore requires an explicitly injected `protectedExplanationStorageEnabled` switch. Production/default configuration is disabled; the local demo and dedicated tests may enable it only for fictional records. This is an implementation gate, not a retention policy. The stored `explanation` and `school_response` cannot be used with real client data until a retention/purge/legal-hold contract is approved and implemented by a forward migration.

### Domain, authorization and lifecycle

- `attendance.explanation.submit` is an optional independent `GuardianPurposeGrant`. Only the already-designated `family.access.manage` Administrator may grant/remove it through a versioned Guardian access command. It is not inferred from `attendance.read_child`, is not in the fixed bundle and is not backfilled.
- Submission requires the current account/token, exact accepted non-revoked GuardianChildAccess/account/Student, the independent purpose, active modules/scope, a session in `SUBMITTED`, an `ABSENT` record for that Student, `school_date >= access_from` and `school_date <= branch-local today`. The session ID is server-authoritative; browser date/child labels are not.
- Categories are `HEALTH_RELATED`, `FAMILY_COMMITMENT`, `SCHOOL_APPROVED_ACTIVITY`, `OTHER`. The normalized plain-text explanation is 10–1000 characters; control characters, HTML semantics and attachments are rejected. UI warns against medical/legal detail.
- The submitter alone may read and withdraw their case while the same exact child access and purpose remain live. Another Guardian receives generic unavailability and cannot learn the author identity, text or status. `SUBMITTED` may become `WITHDRAWN` by its author or `ACCEPTED`/`DECLINED` by a reviewer. No state is edited or reopened.
- A branch reviewer is an active School Administrator with an operator-provisioned `AttendanceExplanationReviewerGrant`; it is not inferred from role or Attendance read/correct. The reviewer cannot be the submitter. Review requires a 5–1000 character plain-text school response and rechecks the original Guardian link/purpose before disclosing text or deciding.
- A partial unique index allows at most one `SUBMITTED` or `ACCEPTED` case for one scoped Student/session. `DECLINED` and `WITHDRAWN` permit a later new submission under current eligibility. Disposition does not update AttendanceSession, AttendanceRecord or AttendanceRevision; any mark change uses the existing guarded correction command.

### Browser-safe operations and failure states

- Parent: `eligibleAbsences(identity, studentId)`, `listOwn`, `detailOwn`, `submit(sessionId, category, explanation, confirmed, key)`, `withdraw(id, expectedVersion, key)`.
- Reviewer: `listReviewQueue(scope)`, `detailForReview(scope,id)`, `review(id, expectedVersion, decision, schoolResponse, key)`. Operator-only `grantReviewer` provisions the resource grant.
- DTOs expose safe case reference, exact session/date/time/subject/class, category, status, version, timestamps and the permitted narrative/response. Parent list/detail never expose reviewer identity; reviewer list shows a generic submitting-family label until detail has been authorized.
- Validation, permission loss and stale version preserve safe in-flow values. Unknown command outcome retains exact normalized payload/key for retry. Duplicate competing submission returns generic conflict. Revoked access clears protected text and returns not found. No missing case or another Guardian case is enumerable.

### Physical schema and read joins

| Model / physical table | Fields | Constraints / indexes / joins |
|---|---|---|

### Physical schema contracts

| Physical table (model) | Fields | Responsibility | Constraints |
|---|---|---|---|
| `vs_attendance_explanation_reviewer_grant` (AttendanceExplanationReviewerGrant) | id/org/school/membership/account/operator uuid; granted/revoked timestamps; version | Explicit operator-provisioned branch reviewer authority for protected Parent absence explanations. | Scoped active administrator membership FK; unique scope/account; active reviewer index |
| `vs_attendance_explanation` (AttendanceExplanation) | id/org/school/session/student/access/submitter/assigned-reviewer-grant uuid; category/explanation/status/version; review/withdraw timestamps and response | Protected Parent absence explanation and immutable disposition lifecycle, separate from the Attendance mark. | Scoped roster, Guardian access and assigned reviewer-grant FKs; category/state/length checks; one active or accepted case per session/student; Parent, assigned-reviewer and session indexes |
| `vs_attendance_explanation_clarification` (AttendanceExplanationClarification) | id/org/school/explanation/student/reviewer-grant/requester/originator-access/originator-account uuid; question/answer; status/version; requested/answered timestamps | Source-bound protected clarification between one assigned explanation reviewer and the exact currently authorized original submitter. | Scoped explanation, reviewer grant and Guardian access FKs; account FKs; status/version/length/state checks; one OPEN child per explanation; history and originator indexes |

| `AttendanceExplanationReviewerGrant` / `vs_attendance_explanation_reviewer_grant` | id; organization_id; school_id; membership_id; account_id; granted_by_operator_id; granted_at; revoked_at nullable; version | Scoped SchoolMembership/account FK; unique scope/account; positive version; active reviewer lookup index |
| `AttendanceExplanation` / `vs_attendance_explanation` | id; organization_id; school_id; session_id; student_id; guardian_access_id; submitter_account_id; category; explanation varchar(1000); status; version; submitted_at; reviewed_at/by; school_response varchar(1000); withdrawn_at; updated_at | Scoped Session+Student roster FK and Guardian access+Student FK; actor/reviewer FKs; category/status/state checks; partial unique active/accepted session case; parent history, reviewer queue and session indexes |

Parent eligibility reads `Guardian access verifier → AttendanceSession(scope,id,status=SUBMITTED,school_date bounds) → SessionRosterEntry(student) → AttendanceRecord(status=ABSENT) → Offering/Subject/Section`. Reviewer queue reads the explanation queue index, then scoped Session/Offering labels and live original Guardian access/purpose. Counts and pages never start from a global Student or Person search.

### Transactions, locks, replay and evidence

All commands are `SERIALIZABLE` and use the existing Attendance write order: account `UPDATE` → Organization `UPDATE` → School `UPDATE`, followed by exact Guardian access, session and explanation locks as applicable. Eligibility is re-read after locks. Submit/withdraw/review use actor/scope/command/key receipts: same canonical payload replays, changed payload conflicts. Expected explanation version guards withdraw/review. The active-case partial index closes concurrent different-key submit races. Reviewer decision versus Parent withdrawal has one winner; the loser receives stale/current safe state.

Audit/outbox/receipt payloads contain case/session/Student IDs, category, state, version and actors only. Raw Parent explanation and school response never enter general audit, outbox, receipt, logs or analytics. The protected columns remain in the Attendance-owned case row only. Evidence failure rolls back the business transition.

```mermaid
sequenceDiagram
  actor P as Parent
  actor A as Designated reviewer
  participant H as Next host
  participant U as Attendance application
  participant G as Guardian access port
  participant D as PostgreSQL
  P->>H: Submit exact absent session + explanation + key
  H->>U: Validated command and verified identity
  U->>D: Lock account, organization and school
  U->>G: Recheck exact child access and purpose in transaction
  U->>D: Lock/recheck submitted ABSENT session; insert case + safe evidence
  D-->>P: Stable SUBMITTED receipt
  A->>H: Open authorized review queue/case
  H->>U: Review decision + expected version + key
  U->>D: Recheck reviewer grant and live Guardian link; lock case
  U->>D: ACCEPTED or DECLINED + safe transition evidence
  D-->>A: Persisted decision
  P->>H: Reload own case
  H->>U: Recheck exact current child purpose
  U-->>P: Own status and permitted response; Attendance mark unchanged
```

**Verification:** unit validation/lifecycle; real PostgreSQL exact-purpose/no-backfill, submitted-ABSENT/date bounds, duplicate and concurrent submit, other Guardian/Student/branch/tenant denial, reviewer designation/self-review denial, withdraw-vs-review race, exact replay, stale version, revoked-link denial, no Attendance mutation and no raw narrative in general evidence. Playwright covers Administrator grant → Parent exact-session staged submit → stable receipt/reload → Administrator staged review → Parent status, plus withdrawal and protected denial at desktop/mobile. Direct comparison uses approved PAR-11/PAR-12 Parent and SA-29 Administrator references; reference-less denied/unknown states use shared patterns. Human review, retention decision, font/native accessibility, TEN-03 and production readiness stay pending.

### LEA-13 clarification delta (18 October 2026)

LEA-13 keeps the ATT-05 disposition and protected-storage boundary. At submission the server binds the case to one current, operator-provisioned branch reviewer grant; browser input never selects or asserts reviewer authority. If the branch does not have exactly one eligible reviewer grant, submission fails closed until trusted configuration resolves the ambiguity. Every reviewer read and command must match that bound, still-live grant and active membership.

An Attendance-owned `AttendanceExplanationClarification` child stores one source-bound question/answer exchange. A reviewer may request clarification only for their bound `SUBMITTED` case and current expected case version. The command creates an `OPEN` child and increments the case evidence version. While an `OPEN` child exists, accept/decline is rejected. Only the original submitter account through the same current `GuardianChildAccess` and `attendance.explanation.submit` purpose may read or answer it. Another guardian never inherits the question or answer. Revocation makes the protected exchange unavailable and leaves the school-side case pending under the configured retention gate.

The Parent answer is 5–1000 normalized plain-text characters, changes the child to `ANSWERED`, increments both child and case versions and requires the reviewer to load the refreshed evidence before disposition. Reviewer disposition binds the refreshed case version. Acceptance records only the explanation outcome and never writes `AttendanceRecord`, `AttendanceRevision` or `AttendanceSession`. Same actor/scope/command/key plus the same canonical payload replays the original result; changed input conflicts. General evidence contains IDs, state and versions only, never question, answer, explanation or school response.

`vs_attendance_explanation_clarification` is tenant/branch scoped and has scoped foreign keys to the explanation, bound reviewer grant, original Guardian access and both accounts. It has status/version/timestamp/length/state checks, one partial unique `OPEN` child per explanation, an explanation history index and an originator lookup index. Reads join from the already-authorized explanation and never enumerate by a browser-supplied account or school. The forward migration also adds the nullable bound reviewer-grant reference to historical explanation rows and backfills it only where exactly one active scoped grant exists; unassigned historical rows remain undisclosed until trusted configuration assigns them.

The production composition uses the shared recipe-D review page at `/leadership/attendance/explanations/:id`, with the existing Administrator URLs retained. Reviewer actions are `requestClarification` and refreshed `review`; Parent detail exposes `respondClarification` only to the exact originator. Validation, stale evidence, unknown result, revoked originator and no-assigned-reviewer states remain distinct. Desktop/mobile browser verification covers question → exact Parent response → refreshed reviewer evidence → final disposition and proves the underlying absent mark is unchanged.

## Migration, retention and handoff

Implement tables only in the task that first uses them; migrate from empty database and the previous task checkpoint. Add scoped unique indexes before composite FKs; detect existing duplicates before adding constraints. SQL append-only/null-campus/range safeguards must appear in reviewed migrations and real-DB tests. No seed may erase prior data. Use synthetic fixtures and clean only owned test records. Preserve schema-compatible app rollback; use a reviewed forward migration when incompatible. Retention changes must preserve required immutable evidence and legal holds under the school-approved policy, not an ad hoc DELETE.

Roster completeness/exact identity set, all-excused denominator, retries lost after commit, same key/different payload, stale version, two tabs, revoked assignment, school-midnight/DST invalid/ambiguous time, open-vs-transfer, calendar changes, correction-vs-cancel, audit/outbox rollback, scope isolation and 40-pupil usability. Time entry ambiguity requires explicit offset selection; do not guess a DST instant.

See [tasks](TASKS.md), [current state](CURRENT_STATE.md), [Bible](../../VSchool_Bible.md) and [agent runbook](../../AGENT_RUNBOOK.md).

## v4.1 integration requirements

School means operational Branch and Organization means client Institution. Every protected flow checks current release availability, institution entitlement, branch activation and user/resource permission; foundational commands remain available only through their required capability projection. Apply the revised account → Organization shared guard → School guard protocol from Tenancy DESIGN. Use the shared components/tokens and current branch context; never invent a second visual system. No operational access is implied by institution administrator role.

## Portable backend integration

Follow [the backend extraction contract](../../BACKEND_EXTRACTION.md). Server module code belongs in backend/modules; UI consumes shared/contracts and a module gateway. Next delivery adapters resolve transport/session and invoke portable use cases. Future Nest controllers and provider factories reuse those use cases. Framework-specific context/ORM results never enter domain or browser DTOs.

## IAM-02 owner read seam

`ScheduledSessionQuery` remains the Attendance-owned impact seam for academic calendar, assignment and student-history operations. Access no longer queries Attendance when editing school settings because the Phase 1 branch timezone is immutable after creation; the Access guard rejects every changed timezone value before any write. Attendance scheduling continues to use the stored branch timezone and its existing School guard.
