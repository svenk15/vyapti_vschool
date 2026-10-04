# Previewed, resumable student roster import — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## IMP-01 — Upload and preview a roster without changing students

Depends on: STU-02

Design: [flow IMP-01](DESIGN.md). Scope and API: POST /api/v1/imports/preview; GET /api/v1/imports/:id/rows.

### Implementation instructions

1. Resolve current branch and require student.manage plus active student_core and academic_core release/entitlement/activation before body consumption; bound request and rate-limit by account.
2. Require Idempotency-Key; enforce separately 2 MiB CSV, 8 KiB metadata and 16 KiB multipart framing, then parse strict UTF-8 CSV with exact supported headers, 1,000-row and 4 KiB-cell limits.
3. Resolve exact OPEN year/date/campus/grade/section, branch source maps and admission ownership in a consistent snapshot; exact mapped Student/enrollment match is NO_CHANGE, mismatch is CONFLICT, and unmapped admission collision requires mapping.
4. Under account → Organization → School lock, store immutable source/hash, preview revision, canonical rows/reference versions, decisions and safe audit/outbox/receipt atomically; create no Person/Student/Enrollment.
5. Same-key/same-source/context replay returns the original job; changed source/context conflicts. Return safe preview summary and paginated row decisions.

Files: extend `backend/modules/imports/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/imports`, `test/functional/imports` and `test/e2e/imports` as the suite grows.

### Acceptance and test strategy

- Unit / application: strict UTF-8/CSV syntax, headers, blank semantics, file/metadata/framing/row/cell limits, duplicate keys, exact NO_CHANGE projection and hash canonicalization.
- Real PostgreSQL: Preview leaves Person/Student/Enrollment counts unchanged; scoped references/source maps; authorization/module checks; replay and concurrent same-key conflict; audit/outbox/source-hash exclusion.
- Browser: Upload matching/invalid samples and inspect row-specific errors; exercise bounds/replay; verify students remain unchanged before confirm.
- Failure contract: Malformed file→422 with row/column; oversize→413; wrong references→preview ERROR; existing unmapped admission→CONFLICT.
- Required DB effect: ImportJob and ImportRow writes; install SourceStudentMap for read-only preview resolution but do not write it until IMP-02. Preview does not emit student-created events. Platform evidence contains only opaque job ID and aggregate counts.
- Persistence/security gate: authorize and bound request before body parsing, scope every job/row/source map, keep raw rows/tokens out of audit logs, and preserve immutable preview/source hashes. Under TEN-ADR-006 Path A, register class/scope/constraints/indexes/policy intent and TEN-03 closure; defer database enforcement while keeping application authorization active.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Upload the provided CSV after creating matching academic references; inspect row preview; upload invalid.csv and see row-specific errors; verify no student was created.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## IMP-02 — Confirm and process complete student rows

Depends on: IMP-01

Design: [flow IMP-02](DESIGN.md). Scope and API: POST /api/v1/imports/:id/confirm; POST /api/v1/imports/:id/process.

### Implementation instructions

1. Confirm under account/School guards: current student.manage, file/context/revision hash and referenced versions; pin approved row set.
2. Process chooses lowest pending row, locks guards and job/row, reauthorizes initiating actor/current caller and rechecks target refs.
3. For CREATE, enlist People.Register + Students.Register/Enroll in one transaction; for exact NO_CHANGE validate current approved fields and return original IDs.
4. Commit SourceStudentMap, ImportRow result/status, row audit/outbox and receipt with business writes. No half-created person on failure.
5. On validation conflict rollback row business work, record FAILED in a separate authorized transaction; advance safely and derive final state from durable outcomes.

Files: extend `backend/modules/imports/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/imports`, `test/functional/imports` and `test/e2e/imports` as the suite grows.

### Acceptance and test strategy

- Unit / application: Preview binding and permitted row transitions.
- Real PostgreSQL: Failure after Person creation rolls full row back; concurrent jobs same external/admission yield one identity; two process calls never apply a row twice.
- Browser: Confirm, process, refresh result; retry process without duplicates.
- Failure contract: Stale confirmation→409; changed references during process→row CONFLICT; current permission lost→403 and stop; crash leaves current row pending; exact retry returns committed result.
- Required DB effect: Per row: Person + Student + Enrollment + Placement + SourceStudentMap + row SUCCEEDED result + envelopes, or no business writes for NO_CHANGE. Job state transitions separately, never claim all-file rollback.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Confirm valid rows; process them; refresh to see durable counts; press Resume/process again and confirm student/enrollment counts do not grow.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## IMP-03 — Resume, cancel and explain partial imports

Depends on: IMP-02

Design: [flow IMP-03](DESIGN.md). Scope and API: POST /api/v1/imports/:id/cancel; GET /api/v1/imports/:id; GET /api/v1/imports/:id/errors.csv; operator purge-import-sources.

### Implementation instructions

1. Read durable row counts; distinguish failed, skipped, pending and succeeded.
2. Resume invokes same bounded process command; no client-local progress authority.
3. Cancel under School guard after current row commits/rolls back, mark pending rows SKIPPED with cancellation reason.
4. Authorize error CSV; quote/escape dangerous spreadsheet prefixes, stream no private unrestricted file URL.
5. Retention command purges expired sourceBytes and later row PII while preserving minimal job/result/key evidence per policy; refuse resume if unprocessed source is expired.

Files: extend `backend/modules/imports/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/imports`, `test/functional/imports` and `test/e2e/imports` as the suite grows.

### Acceptance and test strategy

- Unit / application: Terminal state totals and formula-safe cells.
- Real PostgreSQL: Crash/resume idempotency; revoke actor mid-job; cancellation preserves successes; retention does not erase source mappings.
- Browser: Reload while work pending; resume; cancel remaining; download errors.
- Failure contract: Cancel terminal→safe existing response; expired unprocessed source→409 SOURCE_EXPIRED; permission lost→403 with no sensitive download.
- Required DB effect: Job CANCELLED and pending rows SKIPPED; previously committed student rows remain; expiry purge writes audited technical retention outcome.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Process part of a multirow job, refresh and resume; cancel another partially processed job; verify successes remain and skipped rows are counted explicitly.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
