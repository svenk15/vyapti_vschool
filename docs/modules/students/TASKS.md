# Students, enrollment and placement history — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## STU-01 — Register and inspect students

Depends on: PER-01, ACA-01

Design: [flow STU-01](DESIGN.md). Scope and API: POST /api/v1/students; GET /api/v1/students; GET /api/v1/students/:id.

### Implementation instructions

1. Require `student.manage` for create, exact Person selection and the school-wide list/detail endpoints. Keep teacher `student.read` limited to the Attendance-owned assigned-roster flow; deny generic directory/detail access to a teacher.
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

## SA-COMP-04 / SA-20 — Correct an exclusive student identity

Depends on: STU-01

1. Reuse the scoped Student detail selection and require current `student.manage` plus active `student_core` availability.
2. Lock through the existing mutation guard and selected Person; reject if another institution Student or any Employee references that Person.
3. Invoke the People-owned correction port in the same transaction. CAS Person.version and append immutable PersonNameRevision; preserve Student/enrollment/attendance rows.
4. Persist PII-free receipt/audit/outbox evidence and show bounded People history on Student detail.
5. On stale write, refetch the authorized detail and compare attempted/current names; on shared identity, explain identity-steward recovery without leaking another profile.

Acceptance: unit name/version/reason validation; real PostgreSQL success, rollback, replay, shared/cross-scope denial and registration race; desktop/mobile correction, reload history, validation and stale recovery. Add only the People history migration and its Path A registry contract.

## SA-COMP-07 / SA-18 — Resolve an exact existing identity

Depends on: STU-01

Outcome: an administrator can resolve one exact institution Person ID for deliberate reuse, or one exact current-branch admission number to open its existing Student. Names and email never act as identity selectors; ordinary Student directory search remains available.

Contract delta: replace exact display-name selection with the discriminated `PERSON_ID | ADMISSION_NUMBER` query in [SA-18 corrective implementation contract](DESIGN.md#sa-18-corrective-implementation-contract). Keep registration, guards, transaction, evidence and uniqueness behavior unchanged. No schema/migration change.

Acceptance: strict unit validation; real PostgreSQL Person/admission resolution, missing/foreign/cross-scope denial and registration readback; desktop/mobile explicit selection and existing-Student recovery. Extend no seed tables; the existing fictional Person and Student fixtures provide both cases. Evidence: `docs/evidence/sa-comp-07/README.md`. Human review remains PENDING.

## Experience overlay consumption

EX-08 adopts directory, detail, registration, enrollment, transfer and archive. BE-04 must first verify the live teacher read policy. SA-COMP-07 reconciles existing-Person selection to exact authorized Person-ID/current-branch-admission paths; ordinary Student list search remains separate.

## STU-02 — Enroll students into a dated section

Depends on: STU-01, ACA-02

Design: [flow STU-02](DESIGN.md). Scope and API: GET /api/v1/enrollments/options; POST /api/v1/enrollments.

### Implementation instructions

1. Require released/licensed/active student_core and academic_core, current student.manage and verified active membership for options and writes.
2. For mutation lock account → Organization → School, then reload active Student, OPEN AcademicYear and active same-year Section in the transaction.
3. Validate civil dates and year bounds, store the inclusive UI last day as exclusive valid_to, and preserve optional roll text.
4. Enforce one Student/year root; create Enrollment, first SectionPlacement, School revision and safe evidence atomically. Identical key replay returns the scoped current result; changed replay conflicts.
5. Return joined student/year/section labels and refresh detail/list history.

Files: extend `backend/modules/students/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/students`, `test/functional/students` and `test/e2e/students` as the suite grows.

### Acceptance and test strategy

- Unit / application: Bounds and half-open membership; roll remains text.
- Real PostgreSQL: Two enrollments racing yield one root; scoped FKs and complete rollback.
- Browser: Enroll, refresh list/detail history and class roster count, reject wrong-year section.
- Failure contract: Already enrolled→409; foreign Student/year/section→404; archived Student or draft/closed year/inactive Section→409; Section from a different year or invalid/out-of-year dates→422; revoked permission→403.
- Required DB effect: Students-owned Enrollment and SectionPlacement; read-only Academics-owned year/section references; audit/outbox/receipt.
- Persistence/security gate: preserve one enrollment per scoped student/year, half-open dates, scoped section/year FK and School-guarded placement nonoverlap. Under TEN-ADR-006 Path A, register classification/scope/constraints/indexes/policy intent and TEN-03 closure; database enforcement is deferred to TEN-03.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Enroll student into Grade 8 A; inspect dates/history; try a duplicate yearly enrollment and see a clear conflict.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## STU-03 — Transfer or archive with historical protection

Depends on: STU-02, ATT-01

Design: [flow STU-03](DESIGN.md). Scope and API: POST /api/v1/enrollments/:id/transfer; POST /api/v1/students/:id/archive.

### Implementation instructions

1. Recheck current identity, membership, `student.manage`, `student_core` and `academic_core` release/entitlement/activation; lock account→Organization→School for either mutation.
2. Transfer only the current placement in its OPEN year; require D >= school-local today, D > old.validFrom and D < old.validTo, active same-year destination Section, no queued future placement, non-no-op destination and expected Enrollment.version.
3. In the enlisted transaction, ask Attendance whether a scoped OPEN/SUBMITTED session exists in either affected section on `[D,old.validTo)`; reject it as `ROSTER_IN_USE`. SCHEDULED unopened sessions remain eligible for later roster calculation. This check and ATT-02 opening serialize on the School guard.
4. If safe, close prior placement at D and create new `[D,oldEnd)`; carry old roll number unless a new one is supplied. Archive only with no current/future placement/enrollment or Attendance impact; preserve all historical rows.
5. Require a 5–500-character reason and stable key; commit versions, audit/outbox/receipt atomically and return the updated full timeline or archived status.

Files: extend `backend/modules/students/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/students`, `test/functional/students` and `test/e2e/students` as the suite grows.

### Acceptance and test strategy

- Unit / application: Date boundary D belongs only to new placement; no backdate.
- Real PostgreSQL: Transfer vs OpenSession serializes; no duplicate overlapping placement; failure preserves old history.
- Browser: Future transfer detail; impact explanation on unsafe move; archive inactive eligible synthetic profile.
- Failure contract: Open/submitted roster impact→409 ROSTER_IN_USE; active/future enrollment or placement on archive→409 STUDENT_IN_USE; stale versions, queued transfer, same-section move or overlap→409; invalid date, reason or destination year→422; foreign scoped references→404; revoked permission→403; service/evidence failure→503 with same-key recovery.
- Required DB effect: SectionPlacement interval/new row and Enrollment.version; Student.status/version only for permitted archive; envelopes.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Transfer the seeded Casey Learner from Section A to Section B effective today; inspect both intervals and carried roll `0007`. Attempt to archive the still-enrolled student and confirm rejection without changing history; archive the separate unused Riley Learner and retrieve it with the ARCHIVED filter. The PostgreSQL test covers the open-session rejection and unchanged history.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
