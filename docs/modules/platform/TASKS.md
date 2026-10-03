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

## FND-02 — Demonstrate and release the complete pilot

Depends on: RPT-02, IMP-03, IAM-03, ATT-04, TEN-03, BRD-02, DS-02

Design: [flow FND-02](DESIGN.md). Scope and API: Full UI journey plus operator release runbook.

### Implementation instructions

1. Run all module acceptance suites and production build from a recorded source commit.
2. Rehearse clean install and upgrade migrations against separate disposable databases.
3. Take a synthetic DB backup, restore to a fresh isolated target and reconcile keys, row counts and attendance rates.
4. Verify identity recovery, TLS/secrets, rate controls, redacted logging and operator permissions.
5. Start final release candidate and request owner acceptance of the complete school day.

Files: extend `backend/modules/platform/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/platform`, `test/functional/platform` and `test/e2e/platform` as the suite grows.

### Acceptance and test strategy

- Unit / application: Only new risk-specific regression tests needed.
- Real PostgreSQL: Backup/restore, migration upgrade and full scope/transaction regression.
- Browser: Admin setup → import → assignment → teacher submit → admin correction/export.
- Failure contract: Restore mismatch or failed security gate → BLOCKED release; never route real data into an unverified candidate.
- Required DB effect: No new feature schema unless a reviewed release defect requires a forward migration; evidence includes restore verification.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Use the final candidate to complete the entire school day, including a failed import row and attendance correction; open the restored isolated copy and compare report totals.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
