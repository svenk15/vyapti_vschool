# Students, enrollment and placement history — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## STU-01 — Register and inspect students

Depends on: PER-01, ACA-01

Design: [flow STU-01](DESIGN.md). Scope and API: POST /api/v1/students; GET /api/v1/students; GET /api/v1/students/:id.

### Implementation instructions

1. Require student.manage for create, student.read with resource policy for list/detail.
2. Acquire guards; validate admission number and deliberate Person identity.
3. Invoke People enlisted facade then Student factory; no guardian/account invented.
4. Persist Person+Student+envelopes in one transaction.
5. Read joined detail and show Not enrolled until enrollment exists.

Files: extend `backend/modules/students/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/students`, `test/functional/students` and `test/e2e/students` as the suite grows.

### Acceptance and test strategy

- Unit / application: Admission identifier preserves zeros; names not identifiers.
- Real PostgreSQL: Rollback Person on Student failure; concurrent admission number uniqueness.
- Browser: Create student, search, refresh detail and denied foreign profile.
- Failure contract: Duplicate admission→409; foreign Person→404; malformed name→422.
- Required DB effect: Person via People owner and Student; audit/outbox/receipt.
- Persistence/security gate: retain scoped admission/person uniqueness and Person/School FKs; authorized same-institution Person lookup only; never infer identity from names/email. Under TEN-ADR-006 Path A, record class/scope/constraints/indexes/policy intent and TEN-03 closure; defer database enforcement to TEN-03 while application authorization stays active.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Add student 0007, refresh and search by admission number; see Not enrolled; attempt duplicate 0007 and verify no second Person is left behind.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## STU-02 — Enroll students into a dated section

Depends on: STU-01, ACA-02

Design: [flow STU-02](DESIGN.md). Scope and API: POST /api/v1/enrollments.

### Implementation instructions

1. Authorize student.manage; lock actor/School then scoped references.
2. Require active student, OPEN year, active same-year section and dates within year.
3. Check unique yearly enrollment; reject overlap or a second root instead of silently moving.
4. Create Enrollment and first Placement with envelope in one transaction.
5. Return joined student/year/section DTO and refresh roster count.

Files: extend `backend/modules/students/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/students`, `test/functional/students` and `test/e2e/students` as the suite grows.

### Acceptance and test strategy

- Unit / application: Bounds and half-open membership; roll remains text.
- Real PostgreSQL: Two enrollments racing yield one root; scoped FKs and complete rollback.
- Browser: Enroll, refresh class roster, reject wrong-year section.
- Failure contract: Already enrolled→409 ENROLLMENT_EXISTS; cross-year/dates→422; closed year→409.
- Required DB effect: Enrollment, SectionPlacement; audit/outbox/receipt.
- Persistence/security gate: preserve one enrollment per scoped student/year, half-open dates, scoped section/year FK and School-guarded placement nonoverlap. Under TEN-ADR-006 Path A, register classification/scope/constraints/indexes/policy intent and TEN-03 closure; database enforcement is deferred to TEN-03.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Enroll student into Grade 8 A; inspect dates/history; try a duplicate yearly enrollment and see a clear conflict.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## STU-03 — Transfer or archive with historical protection

Depends on: STU-02, ATT-01

Design: [flow STU-03](DESIGN.md). Scope and API: POST /api/v1/enrollments/:id/transfer; POST /api/v1/students/:id/archive.

### Implementation instructions

1. Authorize student.manage and acquire guard protocol; validate date not before school-local today.
2. Load full placement timeline; disallow overlapping queued transfers and no-op same-section move.
3. Ask attendance impact facade about every OPEN/SUBMITTED session affected by changed eligibility, including future-opened sessions.
4. If safe, close prior placement at D and create new [D,oldEnd); archive only when no current/future enrollment/impact remains.
5. Commit versions and envelopes; detail preserves the old interval and audit.

Files: extend `backend/modules/students/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/students`, `test/functional/students` and `test/e2e/students` as the suite grows.

### Acceptance and test strategy

- Unit / application: Date boundary D belongs only to new placement; no backdate.
- Real PostgreSQL: Transfer vs OpenSession serializes; no duplicate overlapping placement; failure preserves old history.
- Browser: Future transfer detail; impact explanation on unsafe move; archive inactive eligible synthetic profile.
- Failure contract: Historical/open-roster impact→409 ROSTER_IN_USE; invalid effective date→422; archive enrolled→409 STUDENT_IN_USE.
- Required DB effect: SectionPlacement interval/new row and Enrollment.version; Student.status/version only for permitted archive; envelopes.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Schedule a safe future transfer from A to B and inspect both intervals; attempt a move affecting an open session and confirm rejection without changing history.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
