# Session attendance and accountable corrections — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## ATT-01 — Schedule sessions and show each teacher their day

Depends on: ACA-03, STU-02

Design: [flow ATT-01](DESIGN.md). Scope and API: POST /api/v1/sessions; GET /api/v1/teacher/sessions?date=; GET /api/v1/sessions/:id.

### Implementation instructions

1. Recheck current account/membership/class.manage, attendance release, institution entitlement and branch activation for the admin screen and every protected route; acquire account→Organization→School locks for writes and validate OPEN year/current calendar teaching day for section campus.
2. Resolve an active offering and exactly one eligible dated primary teacher; require explicit-offset instants with both endpoints in the same school-local date, end after start, and schoolDate no earlier than today (elapsed start time earlier today is allowed).
3. Create SCHEDULED with pinned calendar revision and unique occurrence key; legitimately different occurrences need distinct keys/times.
4. Implement enlisted CalendarImpact reads so academic publication/year close and teacher-assignment end query real session state in their existing owner transactions. Defer the Student transfer impact port until STU-03 defines the placement-changing workflow; current Student tasks do not mutate an existing placement.
5. Teacher query rechecks active identity/person binding, Employee/Teacher, membership, attendance.read_class and date-effective assignment; returns only own dated sessions. Date defaults to school-local today and history stays within today's open academic year. Empty schedule and service failure are distinct.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Occurrence/date/calendar eligibility and role policy.
- Real PostgreSQL: Schedule-vs-calendar publication serialization; occurrence race; scope/year consistency.
- Browser: Admin schedules; intended teacher sees it; other teacher does not.
- Failure contract: Duplicate occurrence→409 unless same receipt replay; nonteaching day→422; no eligible teacher or teacher overlap→409; missing calendar/stale scope→409; ambiguous/offset-free/past/mismatched date→422; unavailable service→503 with same-key recovery.
- Required DB effect: AttendanceSession + transactional command envelope/receipt; no attendance records/roster rows yet. ATT-01 creates no separate attendance-owned audit/outbox tables.
- Persistence/security gate: preserve scoped offering/calendar composite FKs, unique occurrence receipt, teacher/date query index and School-serialized teacher-time overlap check; reauthorize current assignment on reads and writes. Under TEN-ADR-006 Path A, register session class/scope/constraints/indexes/policy intent and TEN-03 closure; defer database enforcement while keeping application authorization active.
- Read/index evidence: record `EXPLAIN (ANALYZE, BUFFERS)` for the documented offering/date and teacher/date joins with the synthetic pilot data sizes and measured plans/latency. The larger TEN-03 RLS scale profile is a separate enforcement gate.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Schedule today’s Mathematics session; sign in as assigned teacher and see it; sign in as a second teacher and verify it is absent.

Run `pnpm demo:seed` first. It preserves existing local records, prepares one idempotent session per seeded school date, uses the development mail sink for the second synthetic teacher and stores credentials in ignored mode-0600 files. For the ATT-01 frozen demo, the administrator/assigned-teacher credentials are in `artifacts/people-02/private-demo.json`; the unassigned teacher login is in `artifacts/attendance-01/private-demo.json`.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## Experience overlay consumption

EX-10 adopts administrator schedule/detail/correction/cancellation; EX-11 adopts assigned teacher day and roll call. Current assignment/resource checks, pinned roster, UUID intent keys, tenant receipt scope and unknown-result recovery remain unchanged. Timetable planning and teacher school-wide history remain separate missing owner contracts.

## ATT-02 — Open the exact roster and submit attendance

Depends on: ATT-01

Design: [flow ATT-02](DESIGN.md). Scope and API: POST /api/v1/sessions/:id/open; POST /api/v1/sessions/:id/submit.

### Implementation instructions

1. Require current `attendance.mark`, effective attendance and dependency modules, active assigned Teacher/Employee and date-effective assignment. Lock account → Organization → School → session; recheck school-local today and session start time.
2. Through the enlisted Students roster read, query only ACTIVE students with an OPEN-year Enrollment and SectionPlacement for this offering Section/date. Open refuses 0 or >200 pupils, creates immutable name/roll and version snapshots, stores a deterministic sorted roster hash, and changes SCHEDULED→OPEN atomically. School serialization defines the point-in-time roster; do not refresh it after OPEN.
3. UI prepares a memory-only draft, shows “Not submitted”, permits Present/Absent/Late/Excused (1–480 minutes only for Late), and confirms the exact roster/count summary. Validation and stale errors preserve permitted draft state.
4. Submit reauthorizes assigned teacher and validates current session version, stored hash, exact student-ID set with no duplicates, statuses and late minutes. Save every AttendanceRecord and immutable SUBMIT revision 1 plus session state in one transaction.
5. Write safe audit/outbox/receipt evidence without names or roll values. Same-key identical payload replays only after fresh authorization; changed payload conflicts. A lost response keeps the exact payload/key retryable; refreshing reads the committed snapshot/state.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Exact set equality; status and late-minute policy; SCHEDULED→OPEN→SUBMITTED lifecycle; deterministic roster hash; no record before complete submit.
- Real PostgreSQL: Open roster snapshot/order/hash; max 200 and empty roster refusal; transaction rollback after any record/revision failure; one same-key replay; open racing enrollment/transfer yields a School-serialized point-in-time snapshot; duplicate submission/two-tab version conflict; cross-branch and revoked-assignment isolation.
- Browser: Assigned teacher opens current-day session, marks all present then changes one absent and one late, confirms, submits, refreshes read-only result; retry the identical key after response loss and reject a stale tab.
- Failure contract: Empty roster→409 `EMPTY_ROSTER`; >200→409 `ROSTER_TOO_LARGE`; stale version/hash or invalid lifecycle/date→409; missing/extra/duplicate roster entries, invalid status/late minutes→422; revoked membership/assignment/current permission→403/404; foreign scoped session→404; unavailable DB/evidence→503 with transaction rollback and same-key recovery.
- Required DB effect: Open: immutable SessionRosterEntry snapshots + session version/hash/status. Submit: AttendanceRecord for every frozen pupil + immutable AttendanceRevision + session metadata + safe audit/outbox/receipt. Forward migration only; no edit to ATT-01 history and no RLS enforcement before TEN-03.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Run `pnpm demo:seed`; the existing current-day SCHEDULED session must have at least three enrolled synthetic students. Sign in as assigned teacher; open the session; mark all present, change one absent and one late; confirm submit; refresh and see saved counts; retry the identical command key and confirm one submission revision. Keep STU-03/CURRENT_STATE review PENDING; ATT-01 human review is not an ATT-02 gate.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ATT-03 — Review and correct submitted attendance

Depends on: ATT-02

Design: [flow ATT-03](DESIGN.md). Scope and API: POST /api/v1/sessions/:id/corrections; GET /api/v1/sessions/:id/history.

### Implementation instructions

1. Recheck current account/token, membership, active branch, attendance and dependency module availability, scoped session and `attendance.correct`; this currently resolves to an active School administrator. For correction mutations lock account → Organization → School → AttendanceSession. Keep history reads lock-free and require current `attendance.read_school`.
2. Require a SUBMITTED session and expected session version. Validate a nonempty subset of unique IDs in the frozen roster, reject duplicate/no-op changes, validate status/late-minute pairing and a normalized 5–500 character reason.
3. Compute from/to values from locked AttendanceRecord rows; never trust caller-supplied prior values. Update only selected current records and set their `current_revision` to the next number. Append one immutable CORRECT revision at the next session revision number and increment session version.
4. Write safe audit/outbox/receipt in the same transaction. Identical same-key retry returns its original result only after fresh authorization; changed payload conflicts. Concurrent writes serialize on the session and stale versions fail atomically.
5. Add authorized scoped history read, ordered by revision number with safe actor display name/time/reason. Admin UI shows old/new values and corrected state; teacher remains read-only and direct correction is denied.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Correction subset/diff/no-op; reason normalization/bounds; status/late-minute pairing.
- Real PostgreSQL: Exact scoped record and revision update; concurrent corrections produce one success and one stale-version failure; forced evidence failure rolls back records/session/revision/receipt; immutable revision trigger; same-key replay and changed-payload conflict; current permission, foreign scope and teacher denial.
- Browser desktop/mobile: Admin corrects absent to excused; sees prior/current values, reason, safe author and timestamp; teacher remains read-only and direct action is denied.
- Failure contract: Teacher/unauthorized→403 or resource-safe 404; invalid input/reason→422; no-op/duplicate/out-of-roster/non-submitted/cancelled→409; stale concurrent correction→409; foreign session→404; unavailable database/evidence→503 with full rollback.
- Required DB effect: Update selected AttendanceRecord statuses/current_revision; append immutable AttendanceRevision; increment AttendanceSession.version; append transactional envelopes. No new table or migration is expected because ATT-02 schema already contains these fields/constraints.
- Read support: scoped session key; `(organization_id,school_id,session_id,number)` revision unique index; scoped roster-record composite key. Capture EXPLAIN ANALYZE/BUFFERS for scoped revision history and roster/current-record join; keep this small-plan evidence distinct from Bible pilot and TEN-03 scale gates.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Run `pnpm demo:seed`; it preserves a synthetic current-day submitted session with Present/Absent/Late records (new seed records mark Avery absent and Morgan late). Sign in at the frozen ATT-03 URL as admin using `artifacts/people-02/private-demo.json`; open `/admin/attendance/sessions`, choose “Review or correct”, find the student currently marked Absent, change that student to Excused with reason `Approved office correction`, then save. Expect a new correction revision, refreshed current status and visible old/new values, reason, author and time. Refresh and confirm history persists. Sign in as the assigned teacher from the same private file and confirm the submitted result is read-only and correction controls are unavailable; automated checks exercise direct-action denial.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ATT-04 — Cancel sessions and recover failed submissions

Depends on: ATT-03, STU-03

Design: [flow ATT-04](DESIGN.md). Scope and API: POST /api/v1/sessions/:id/cancel; GET /api/v1/commands/:command/key/:key (allowlisted `attendance.submit`/`attendance.cancel`, opaque key URL). No schema/migration change is expected; existing cancellation columns, immutable revision type and receipt uniqueness are sufficient. If implementation proves otherwise, update this design and table registry before adding a forward migration.

### Implementation instructions

1. For SCHEDULED/OPEN require class.manage; SUBMITTED requires attendance.correct, always reason.
2. Acquire guards, reauthorize resource and version; set CANCELLED without deleting snapshots/records/revisions.
3. Append CANCEL revision, audit, fact and receipt.
4. Unknown submission result: check receipt for the current organization/account/command/key; resolve its session ID and repeat scoped current-resource authorization before returning FOUND. Another actor, branch or revoked resource returns 404; only an absent key is UNKNOWN. FOUND reconciles success; UNKNOWN permits same-payload/same-key retry.
5. On cancellation/conflict/revocation return accurate UI state; clear drafts on denied access; canceled sessions stay visible with retained read-only history to school admins, are omitted from teacher lists and excluded from attendance denominator.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Cancellation capability by state; result reconciliation state machine.
- Real PostgreSQL: Submit-vs-cancel serialization has one winner; losing transition writes no partial records/revisions; exactly one receipt/outbox; retained frozen roster/records; revoked actor/assignment and other actor/branch cannot read receipt payload; evidence failure rolls back. Capture EXPLAIN ANALYZE for admin/teacher date predicates and receipt lookup.
- Browser: Drop a committed submit response, recover FOUND through status lookup, and verify retry behavior; cancel a separate submitted synthetic session, confirm admin history remains visible/read-only, teacher list excludes it, and canceled status is excluded by the denominator predicate.
- Failure contract: status lookup foreign/other actor/revoked resource→404; absent receipt→UNKNOWN; cancellation race/stale/already canceled→409; duplicate same command key and payload returns receipt; changed payload conflicts; no resurrection route.
- Required DB effect: Session cancellation state/time/version + immutable cancellation revision + envelopes. No deleting records or mutating earlier revision.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Simulate a lost submit response and reconcile it; cancel a submitted synthetic session with a reason; show retained history and verify it no longer contributes to rates.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
