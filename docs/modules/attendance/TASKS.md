# Session attendance and accountable corrections — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## ATT-01 — Schedule sessions and show each teacher their day

Depends on: ACA-03, STU-02

Design: [flow ATT-01](DESIGN.md). Scope and API: POST /api/v1/sessions; GET /api/v1/teacher/sessions?date=; GET /api/v1/sessions/:id.

### Implementation instructions

1. Require class.manage for schedule; acquire guards and validate OPEN year/current calendar teaching day for section campus.
2. Resolve offering and an eligible dated primary teacher; validate starts/ends map to schoolDate and lie within one school day; schoolDate cannot be before today (an elapsed start time earlier today is allowed).
3. Create SCHEDULED with pinned calendar revision and unique occurrence key; legitimately different occurrences need distinct keys/times.
4. Implement CalendarImpact/PlacementImpact facades so academic publication/year close and student transfer query real session state.
5. Teacher query returns only own dated assigned sessions; empty schedule and service failure are distinct.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Occurrence/date/calendar eligibility and role policy.
- Real PostgreSQL: Schedule-vs-calendar publication serialization; occurrence race; scope/year consistency.
- Browser: Admin schedules; intended teacher sees it; other teacher does not.
- Failure contract: Duplicate occurrence→409 unless same receipt replay; nonteaching day→422; no teacher→409; ambiguous/mismatched date→422.
- Required DB effect: AttendanceSession + envelopes; no attendance records/roster rows yet.
- Persistence/security gate: preserve scoped offering/calendar composite FKs, unique occurrence receipt, teacher/date query index and School-serialized teacher-time overlap check; reauthorize current assignment on reads and writes. Under TEN-ADR-006 Path A, register session class/scope/constraints/indexes/policy intent and TEN-03 closure; defer database enforcement while keeping application authorization active.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Schedule today’s Mathematics session; sign in as assigned teacher and see it; sign in as a second teacher and verify it is absent.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ATT-02 — Open the exact roster and submit attendance

Depends on: ATT-01

Design: [flow ATT-02](DESIGN.md). Scope and API: POST /api/v1/sessions/:id/open; POST /api/v1/sessions/:id/submit.

### Implementation instructions

1. Require attendance.mark and dated assignment; lock account/School then session; recheck school-local today.
2. Open calculates eligible live roster through Student facade, refuses empty/>200, inserts frozen entries/hash and OPEN version atomically.
3. UI prepares in-memory statuses, explicitly shows Not submitted, validates all entries and confirms counts.
4. Submit reauthorizes and validates version/hash/exact roster ID set/status fields; save all current records plus immutable SUBMIT revision.
5. Set SUBMITTED/by/at/version; audit/outbox/receipt commit; on replay return original authorized receipt after scope check.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Exact set equality, status/late validation, lifecycle, deterministic roster hash.
- Real PostgreSQL: Atomic rollback after records; submit lost-response replay once; open vs enrollment transfer; two-tab conflict.
- Browser: Teacher marks exceptions, confirms, refreshes read-only result; network retry and stale tab.
- Failure contract: Empty roster→409 EMPTY_ROSTER; changed version/hash→409; missing/extra/duplicate entries→422; revoked assignment→403; closed date/session→409.
- Required DB effect: Open: SessionRosterEntry + session version/hash/status. Submit: AttendanceRecord for every pupil + AttendanceRevision + session metadata + envelopes.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Open the session; mark all present, change one absent and one late; confirm submit; refresh and see saved counts; resubmit identical intent and confirm one submission revision.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ATT-03 — Review and correct submitted attendance

Depends on: ATT-02

Design: [flow ATT-03](DESIGN.md). Scope and API: POST /api/v1/sessions/:id/corrections; GET /api/v1/sessions/:id/history.

### Implementation instructions

1. Require attendance.correct for command; acquire guards and submitted session.
2. Validate students belong to frozen roster, expected version and meaningful mandatory reason.
3. Calculate old/new diff; reject ordinary teacher correction despite class-read permission.
4. Update affected current AttendanceRecord rows, append CORRECT revision and increment session version.
5. Commit audit/outbox/receipt; show prior/current values and corrected badge with author/time.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Correction policy/diff/no-op; reason bounds.
- Real PostgreSQL: Concurrent corrections CAS; forced audit failure rolls records back; immutable revision trigger.
- Browser: Admin corrects absent to excused; teacher remains read-only; history and rate update.
- Failure contract: Teacher denial→403; missing reason→422; cancelled/non-submitted→409; stale concurrent correction→409.
- Required DB effect: AttendanceRecord statuses/revision, immutable AttendanceRevision, AttendanceSession.version and envelopes.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

As admin correct one absence to excused with a reason; inspect old/new values; as teacher confirm correction controls are unavailable and direct action is denied.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## ATT-04 — Cancel sessions and recover failed submissions

Depends on: ATT-03, STU-03

Design: [flow ATT-04](DESIGN.md). Scope and API: POST /api/v1/sessions/:id/cancel; GET /api/v1/commands/:command/key/:key (key URL opaque, no student/token content).

### Implementation instructions

1. For SCHEDULED/OPEN require class.manage; SUBMITTED requires attendance.correct, always reason.
2. Acquire guards, reauthorize resource and version; set CANCELLED without deleting snapshots/records/revisions.
3. Append CANCEL revision, audit, fact and receipt.
4. Unknown submission result: check receipt with the same actor/scope/key and read current session; FOUND reconciles success, UNKNOWN permits same-payload retry.
5. On cancellation/conflict/revocation return accurate UI state; clear drafts on denied access; cancelled sessions excluded from attendance denominator.

Files: extend `backend/modules/attendance/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/attendance`, `test/functional/attendance` and `test/e2e/attendance` as the suite grows.

### Acceptance and test strategy

- Unit / application: Cancellation capability by state; result reconciliation state machine.
- Real PostgreSQL: Submit-vs-cancel serialization; no duplicate outbox; revoked actor cannot read prior receipt payload.
- Browser: Simulated response loss recovers; cancel submitted session retains visible history and excludes metrics.
- Failure contract: Status lookup foreign/other actor→404; cancellation race→409; duplicate same command key returns receipt; no resurrection route.
- Required DB effect: Session cancellation state/time/version + immutable cancellation revision + envelopes. No deleting records or mutating earlier revision.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Simulate a lost submit response and reconcile it; cancel a submitted synthetic session with a reason; show retained history and verify it no longer contributes to rates.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
