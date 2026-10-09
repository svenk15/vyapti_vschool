# Timetable LLD — proposed implementation contract

This is a concrete **candidate schema** for reconciliation with the live PostgreSQL/Prisma registry, not a migration asserted to exist. Reuse an equivalent existing owner table/use case rather than adding another one. All physical tables use `vs_`. Java/JUnit is not introduced into a TypeScript product; see TEST_STRATEGY.md.

## Shared columns and constraints
Unless identified as a child, each table has `id uuid primary key`, `organization_id uuid not null`, `school_id uuid not null`, `created_at timestamptz not null`, `created_by_account_id uuid not null`, and `row_version bigint not null default 1`. Scope comes from authenticated application context. Child foreign keys include `(organization_id, school_id, parent_id)` and target matching composite unique keys, preventing forged cross-branch references even with valid UUIDs. Reuse global UserAccount only through authorized owner ports. Do not cascade-delete academic history.

All ten timetable-owned candidate tables below are **branch-scoped**. The global identity table remains Access-owned; institution licensing remains Tenancy-owned and institution-scoped. Extend the table registry with table class, scope columns, indexes and intended policy. Attach policies/grants/FORCE according to the live TEN-ADR-006 decision and production gate; do not infer enforcement from metadata.

## Tables
| Candidate table | Additional columns / payload | Responsibility and key constraints |
|---|---|---|
| `vs_academic_day_pattern` | `academic_year_id uuid`, `version_no int`, `name varchar(80)`, `teaching_days smallint[]`, `state varchar(16)` | Versioned school-day template. Days 0–6, unique and nonempty. Unique branch/year/version. Published snapshots immutable. |
| `vs_academic_day_period` | `day_pattern_id uuid`, `period_key uuid`, `label varchar(60)`, `kind varchar(12)`, `start_local time`, `end_local time`, `position smallint` | Lesson/break intervals. Positive duration, no overlaps within pattern. Unique pattern/period_key; period_key stays stable across revisions when logically the same period. |
| `vs_academic_timetable_revision` | `academic_year_id uuid`, `day_pattern_id uuid`, `revision_no int`, `state varchar(16)`, `effective_from date`, `effective_until date null`, `published_at timestamptz null`, `published_by_account_id uuid null`, `based_on_revision_id uuid null`, `source_command_id uuid null` | Draft and published snapshots. One live draft per branch/year in this first cut. Unique branch/year/revision. Published applicability intervals do not overlap; content immutable. Closing a predecessor’s applicability is controlled publication metadata, not rewriting slots. |
| `vs_academic_timetable_slot` | `revision_id uuid`, `slot_key uuid`, `class_section_id uuid`, `subject_offering_id uuid`, `teacher_assignment_id uuid`, `room_id uuid null`, `day_of_week smallint`, `period_key uuid`, `start_minute smallint`, `end_minute smallint` | Recurring lesson and effective local interval snapshot. Unique revision/slot_key. Scope-inclusive offering/teacher/room references. Class, teacher and non-null room interval conflicts checked across the entire revision. |
| `vs_academic_lesson_occurrence` | `academic_year_id uuid`, `class_section_id uuid`, `local_date date`, `period_key uuid`, `source_revision_id uuid`, `source_slot_key uuid`, `start_at timestamptz`, `end_at timestamptz`, `subject_offering_id uuid`, `effective_teacher_assignment_id uuid`, `effective_room_id uuid null`, `state varchar(20)`, `attendance_session_id uuid null`, `pinned_at timestamptz null`, `generation_revision bigint` | Stable dated lesson, materialized in a bounded horizon. Unique branch/year/class/date/period_key, including cancelled rows. Generation uses upsert/reconciliation, not delete/reinsert. Opened/submitted attendance pins the plan, time and assignment. |
| `vs_academic_schedule_change` | `occurrence_id uuid`, `change_no int`, `kind varchar(16)`, `state varchar(16)`, `before_snapshot jsonb`, `after_snapshot jsonb`, `operational_reason varchar(1000)`, `source_command_id uuid`, `supersedes_change_id uuid null` | Append-only dated change evidence. JSON schema is whitelisted: assignment/ref, room/ref, times, status; no pupil rows or HR-private content. Unique occurrence/change_no and command ID. Restore is an explicit new change, not deletion. |
| `vs_academic_cover_assignment` | `occurrence_id uuid`, `schedule_change_id uuid`, `teacher_membership_id uuid`, `teacher_person_id uuid`, `valid_from timestamptz`, `valid_until timestamptz`, `state varchar(20)`, `response varchar(24)`, `responded_at timestamptz null` | Dated substitute scope. Unique active occurrence assignment. Acceptance records acknowledgement; it is not the authorization source. Superseded/declined/revoked scopes are immediately unusable for new attendance actions. |
| `vs_academic_schedule_request` | `occurrence_id uuid`, `requester_teacher_person_id uuid`, `message varchar(1000)`, `state varchar(16)`, `response_note varchar(1000) null`, `resolved_by_command_id uuid null`, `resolved_at timestamptz null` | Teacher operational handoff/request. Partial unique active `(occurrence_id, requester_teacher_person_id)` while Pending. Resolution cites the successful owner change receipt. |
| `vs_academic_teacher_availability` | `teacher_person_id uuid`, `unavailable_from timestamptz`, `unavailable_until timestamptz`, `source_owner varchar(40)`, `source_ref uuid`, `source_revision bigint`, `state varchar(16)` | Minimal availability projection only if no existing port/table suffices. No reason/diagnosis or HR documents. Unique owner/ref/revision; stale projection flags force recheck before assigning. |
| `vs_academic_generation_checkpoint` | `academic_year_id uuid`, `source_revision_id uuid`, `horizon_from date`, `horizon_until date`, `cursor_date date`, `state varchar(16)`, `last_error_code varchar(80) null`, `source_command_id uuid` | Bounded, resumable reconciliation evidence. Scope/revision/horizon unique. Tracks queued/running/completed/failed separately from publication. Never claims attendance marking succeeded. |

Existing tables/ports to map before coding: organization, school, academic year/calendar/holiday, class section, subject offering, teacher-person link/assignment, room/facility, student enrollment, family relationship + per-purpose grant, school membership/role grant, AttendanceSession/roster/receipt, scoped command receipt, configuration evidence and durable outbox. Physical names not observed in the current live repository must not be invented as already implemented.

## Indexes and integrity
- Revision lookup: `(organization_id, school_id, academic_year_id, state, effective_from DESC)`; published range exclusion or serialized no-overlap validation under School guard. Use a consistent half-open applicability range.
- Weekly class view: slots `(organization_id, school_id, revision_id, class_section_id, day_of_week, start_minute)`.
- Teacher and room conflict candidate lookup: slots `(organization_id, school_id, revision_id, teacher_assignment_id, day_of_week, start_minute, end_minute)` and analogous room index. Identity-level teacher conflicts must resolve assignment IDs to the same teacher person, including multiple subject assignments.
- Occurrence class/date and teacher/date: `(organization_id, school_id, class_section_id, local_date, start_at)` and `(organization_id, school_id, effective_teacher_assignment_id, local_date, start_at)`; include state/source_revision only after EXPLAIN evidence supports it.
- Live occurrence interval conflicts: use teacher-person and class/room interval checks under the School guard; optionally add `btree_gist` exclusion constraints on scoped `tstzrange` where deployment permits. Do not depend on an unavailable extension. Avoid double-lock protocols inconsistent with the current guard.
- Changes: `(organization_id, school_id, occurrence_id, change_no DESC)`; cover partial indexes for active occurrence and teacher/date; requests `(organization_id, school_id, state, created_at, id)` for cursor paging.
- No unscoped teacher/student search. No email joins to establish identity. Resolve active membership and verified Person link once through the owner port.

## Queries powering the UI
| Screen | Read path and joins |
|---|---|
| Admin weekly draft | Scoped year → current draft revision → day pattern/periods → slots → class/offering labels → current eligible teacher-person names → room labels. Read all candidate conflict scopes server-side; expose only authorized branch data. |
| Published class week | Each local date → applicable published revision + calendar teaching-day exclusions → slot/occurrence → latest effective dated-change projection. Preserve pinned attendance snapshot when applicable. Mixed-revision weeks identify the revision per lesson. |
| Teacher week | Account → active membership → verified teacher-person link → primary teaching assignments UNION valid active dated cover → scoped occurrences. Deduplicate by occurrence ID, not class label. Past original-assignment change notices are separate from current marking authority. |
| Student week | Account → verified student-person → active scoped enrollment → class-section/year → published occurrences. Select only schedule-safe DTO fields. |
| Guardian child week | Account → verified active relationship → dated `timetable.read` purpose grant → active child enrollment → class/year → published occurrences. All grant/membership dates apply at read; other children never enter the response. |
| Daily changes | Scoped occurrence → latest effective change plus immutable history → safe teacher/room labels; cursor/filter queries use allowlisted attributes. Reasons are manager-only. |
| Principal exception list | Authorized branch/date occurrences → effective cover status + outstanding request counts → coordinator ownership reference. Distinguish Needs cover from Awaiting acknowledgement. No broad pupil roster join. |
| Operator config | Institution → entitlement record → authorized branch activation/prerequisites. No join to operational timetable tables. |

## API / use-case contract
Framework-neutral DTOs are used by Next.js adapters now and a future Nest.js adapter later. Example endpoint names are proposals, not a claim of existing routes:

| Operation | Input | Result / failure |
|---|---|---|
| `getTimetableWeek` | local week start; allowed class or self/child reference | safe published DTO with revision/as-of; denied/empty/stale source distinctly |
| `saveTimetableDraft` | draft ID, expected version, selected scope, slots/day pattern | persisted draft version; field/conflict summary; no publication |
| `previewPublication` | draft ID + expected version | validation token/reference, changed/removed/pinned counts, generated horizon impact |
| `publishTimetable` | draft ID, expected version, original command ID | receipt + publication/generation status; 409 if changed; unknown uses receipt lookup |
| `createScheduleChange` | occurrence ID + expected version, kind, typed payload, reason, command ID | exact dated change receipt; rejects eligibility/clash/started/pinned |
| `restorePublishedLesson` | occurrence ID + expected version, reason, command ID | new restoration record, retained history, notice intent |
| `respondToCover` | cover ID + expected version, acknowledgement/decline, command ID | response receipt; stale/superseded assignment rejected |
| `createScheduleRequest` | occurrence ID, bounded message, command ID | Pending receipt; existing active request returned or conflict |
| `resolveScheduleRequest` | request version + successful source command reference, or return note | linked resolution; never a universal approval flag |
| `getCommandResult` | command ID | current authorized result only; cannot bypass revocation |

Every command authenticates current actor and scope; validates CSRF/origin under the existing adapter contract; rejects caller-forged tenant/actor IDs; enforces body size and rate limits. Use bounded pages (default 50, maximum 100) and a 7-local-day timetable view. Draft upload limits are derived from configured classes/periods with a hard request bound documented in TT-00; do not accept an unbounded term payload. The browser prototype is not a server enforcement test.

## Publication transaction and owner handoff
1. Authenticate account; acquire existing Organization/School guard in repository-defined order. Authorize module + branch + publication capability.
2. Look up scoped command receipt and payload digest. Same key/same payload returns original result; changed payload is a conflict. Persist no raw private form payload in audit.
3. Lock draft/branch year publication state. Validate expected version; recheck calendar, eligible teacher assignments and all interval conflicts.
4. Compare affected already-materialized occurrences, pending overrides and frozen AttendanceSession states through the Attendance port. Freeze flags and publication are serialized under the shared guard. If an active dated change conflicts with the proposed pattern, return a reconciliation conflict; never silently overwrite it.
5. Insert immutable published content, close predecessor applicability metadata, write command receipt, minimal audit and outbox within the owner transaction. Commit.
6. Dispatcher reconciles a bounded horizon in batches using source revision/cursor. Attendance planning commands use stable occurrence IDs and deduplication receipts. Open/submitted sessions stay pinned; removed future scheduled occurrences are cancelled, not deleted. New period identities require explicit impact review.
7. Communication consumes a publication/change event after current purpose/assignment rechecks, resolving recipients through its owner. In-app change view is authoritative immediately; queue/provider accepted/read/acknowledged remain distinct.

```mermaid
sequenceDiagram
  participant UI as Admin screen
  participant App as Timetable use case
  participant DB as PostgreSQL
  participant Jobs as Owner dispatcher
  participant Att as Attendance owner
  UI->>App: Publish draft, version, command ID
  App->>DB: Begin; scope guard and receipt lookup
  App->>Att: Validate pinned session impact
  App->>DB: Validate; version + receipt + outbox
  DB-->>App: Commit receipt
  App-->>UI: Published; generation queued
  Jobs->>DB: Read committed generation intent
  Jobs->>Att: Reconcile stable dated occurrences
  Att-->>Jobs: Idempotent planning receipts
  Jobs->>DB: Record cursor and completion
```

## Cover / attendance concurrency
The same School mutation guard serializes cover changes and opening an attendance session. A cover command reads the current occurrence/version, verifies effective time, availability and overlap across all affected classes, then appends change + scoped assignment + audit/outbox atomically. Attendance opening rechecks the **current** assignment and pins occurrence/source. If attendance wins the race, cover fails with a clear review path; if cover wins, the old teacher cannot open that roster. Session revocation/grant changes are rechecked at submit, not inferred from a previously opened screen. A currently open session whose actor loses eligibility follows the Attendance recovery procedure rather than silently switching the author.

```mermaid
sequenceDiagram
  participant Admin as Coordinator
  participant App as Academic application
  participant DB as Scoped transaction
  participant Teacher as Assigned teacher
  participant Att as Attendance use case
  Admin->>App: Assign dated cover + version
  App->>DB: Guard; eligibility, clash, frozen check
  App->>DB: Change + scoped cover + receipt + outbox
  DB-->>Admin: Saved reference
  Teacher->>App: Acknowledge own assignment
  App->>DB: Recheck assignment; record response
  Teacher->>Att: Open exact occurrence
  Att->>DB: Same guard; current eligibility; pin roster
  DB-->>Teacher: Authorized attendance session
```

## Poor network, data retention and failure
- Draft save errors retain entered fields. Conflict responses preserve local input, show current stored version and require deliberate reapplication. Drafts are not published.
- Unknown mutation outcome keeps command ID + payload and blocks duplicate intent until status lookup resolves. Status lookup itself reauthorizes current scope.
- Do not cache child schedule/roster data persistently in browser storage by default. Clear persona/context buffers on revocation, sign-out and child/branch switch. Offline screens identify the last successful retrieval time; they cannot claim new changes saved.
- Occurrence generation failure exposes retryable owner status and current coverage, not false Ready. Retry uses the same occurrence key/source revision. Export and print reauthorize current scope.
- Notification bodies exclude operational staff reasons and hidden recipient lists. Only current authorized recipients receive the minimum safe schedule change.
- Published schedules, overrides, responses and receipts retain audit history under the school retention policy. No cascade hard delete or automatic teardown is introduced.

## Prototype simplifications to replace in production
In-memory arrays, fixed illustrative roster, client-side context, simplified local-time conversion for fictional Asia/Kolkata, synchronous bounded generation, queued-notice simulation, and the small fixed period template are **design demonstrations only**. Production must implement real transaction boundaries, UTC/timezone conversion, durable receipts/outbox, scoped SQL/permissions, provider delivery and the existing owner Attendance APIs. Do not ship the JavaScript fixture model as a security or persistence layer.
