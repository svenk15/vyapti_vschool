# Development foundation and delivery — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## FND-01 — Run and checkpoint the fresh local foundation

Depends on: none

Design: [flow FND-01](DESIGN.md). Scope and API: GET /; GET /api/health; GET /api/health/live.

### Implementation instructions

1. Inspect independent folder, Git status, package lock and environment target.
2. Install frozen dependencies; run setup:local and db:setup.
3. Query readiness through application port and Prisma adapter.
4. Run check, real PostgreSQL functional tests, browser tests and build.
5. Start local server; record source checkpoint and request manual review.

Files: extend `backend/modules/platform/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/platform`, `test/functional/platform` and `test/e2e/platform` as the suite grows.

### Acceptance and test strategy

- Unit / application: Readiness labels; provider exception hides secret.
- Real PostgreSQL: Real persistence replay and failed transaction rollback.
- Browser: Desktop/mobile page; health and no secret response.
- Failure contract: Missing configuration → helpful setup state; unavailable database → 503; wrong database name → setup/test guard abort.
- Required DB effect: Only SetupCheck migration/seed; no account or school data.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Open localhost:3400; confirm Database connected; review the illustrative workspace; open /design-system, /configure and /sign-in/greenwood-north; refresh configuration to confirm it is a temporary preview. Confirm no real authentication or school operations are claimed.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## FND-02 — Prepare and verify the complete Phase 1 demo

Depends on: RPT-02, IMP-03, IAM-03, ATT-04, TEN-03, BRD-02, DS-02

Demo-sequence dependencies: RPT-02, IMP-03, IAM-03, ATT-04, BRD-02. Per the 6 October PHASE 1 DEMO READY decision, TEN-03 remaining RLS/context-proof work and DS-02 native accessibility evidence do not block local demo preparation. Both remain production-release gates. DS-02 shared UX and rendered route checks are part of the FND-02 demo verification.

Design: [flow FND-02](DESIGN.md). Scope and API: Full UI journey plus operator release runbook.

### Implementation instructions

1. Preserve and commit the partial TEN-03 context groundwork. Do not enable RLS or alter existing migration history/data.
2. Run `pnpm demo:seed` twice against only the guarded development database and verify no existing user data/credentials are replaced and no real email is sent.
3. Run unit, real-PostgreSQL, Playwright desktop/mobile and production-build checks needed for the local demo source.
4. Verify connected admin and assigned-teacher journeys across Access, Tenancy, Branding, Academics, People, Students, Imports, Attendance and Reporting, with realistic failures/denials.
5. Verify shared portal layout/theme propagation, theme preview/cancel/publish/rollback and school-branded sign-in.
6. Start one stable production-mode local demo and capture exact source, enabled modules, URL, seed and private credential paths. Human review remains PENDING until owner feedback.

This demo-ready checkpoint is not a production release. Keep the release evidence below outstanding for TEN-03 RLS/context proof, provider role/security review, native accessibility, backup/restore and the larger isolation benchmark. No real client data may be onboarded before those gates pass.

Files: use existing feature-owned seed scripts and current shared components. Fix integration defects in their owning module; keep FND-02 evidence in `docs/evidence/fnd-02-demo/` and update module CURRENT_STATE only with executed evidence. Do not add a generic seed framework, new platform business tables or fake feature operations.

### Acceptance and test strategy

- Unit / application: Only new risk-specific regression tests needed.
- Real PostgreSQL: Full functional authorization, tenant/branch scope, migration, concurrency and rollback suites; run seed twice and inspect idempotency. Do not reset/delete the current development or test databases.
- Browser: Full admin/teacher flow from setup and theme publication through student/import/attendance/reporting, plus access denial, partial import and attendance recovery states.
- Failure contract: failed journey or check leaves PHASE 1 DEMO READY incomplete. Missing release evidence keeps production BLOCKED; no real data is used.
- Required DB effect: Only existing idempotent synthetic seed commands; no new feature schema or destructive database operation.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Use the local candidate and synthetic admin/teacher personas to complete the documented school day, including a failed import row, attendance correction and report export. Verify published branding at the institution's school-branded sign-in URL.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## SA-COMP-05 / SA-62 — Review safe branch activity

Depends on: IAM-02, DS-02 and the installed Platform audit envelope. Their implementations must be VERIFIED; human review may remain PENDING under the current batch policy.

Implement the bounded read-only activity projection in DESIGN. Use current `school.manage` as the exact Phase 1 fixed-role authorization. Return only allowlisted commands and safe DTO fields; arbitrary audit reason/diffs, actor IDs and unknown commands never cross the owner boundary. Add the branch/time index by forward migration, signed scope-bound keyset cursor, protected list/detail APIs and the approved Activity page with filters, safe detail and support reference copy acknowledgement. Keep privacy/support authority handoff visible and non-operational.

Acceptance: unit validation and allowlist mapping; real PostgreSQL branch isolation, current authorization, unknown suppression, date bounds, pagination and plan evidence; desktop/mobile populated/empty/detail/copy/denied/error states with keyboard and overflow checks. Run the guarded seed without replacing fixtures. Record human review PENDING and continue to SA-COMP-06.
