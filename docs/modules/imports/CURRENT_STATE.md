# Previewed, resumable student roster import — current state

Last updated: 2026-10-04. Existing task progress preserved; local owner acceptance is pending. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| IMP-01 | IN_PROGRESS | NOT_REQUESTED | Source, schema, static/unit/real PostgreSQL and desktop/mobile Playwright checks pass; stable production-mode demo handoff remains |
| IMP-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| IMP-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

**Design readiness (4 October 2026):** IMP-01 LLD/task align on Imports-only preview storage, immutable source/hash/revision, separate 2 MiB CSV, 8 KiB metadata/envelope and 16 KiB multipart framing bounds, exact branch-scoped source/admission resolution, no student writes, current `student.manage` authorization, audit exclusions and Path A metadata. The existing Student list search remains available and identity linking is not inferred. Source hashes stay in ImportJob storage. Reads use current authorization and no write lock. Dependency snapshot: STU-02 VERIFIED/PENDING; its implementation dependency is satisfied and human PASSED is not a task gate. No product blocker remains for preview-only IMP-01; TEN-03 RLS is a release gate, not an implementation blocker.

IMP-01 implementation is in the working tree and incomplete pending a stable required browser run and demo verification. The forward migration `20261004001700_import_preview` is applied to `vyapti_vschool` and `vyapti_vschool_test`; no earlier migration or database was reset. Path A RLS metadata remains planned for TEN-03; application authorization is implemented and active.

## Next action

Desktop/mobile Playwright now passes with a self-starting isolated test server. Verify the production-mode development demo at port 3414, then commit only IMP-01 files and record human review as PENDING. Keep import processing, confirmation and resumability in later tasks.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

## Evidence history

Append dated task records here using docs/AGENT_RUNBOOK.md. Include source commit, changed files, schema version, commands/results, demo URL, manual feedback and next action. Do not store credentials or real pupil data.

### 4 October 2026 — IMP-01 implementation checkpoint (IN_PROGRESS / human NOT_REQUESTED)

- **Source:** current `work/stu-01-after-per02-wip` working tree; no IMP-01 commit yet. Unrelated `.puku-cli/` and `readiness-review.diff` remain untouched and unstaged.
- **Implemented:** strict bounded CSV preview; scope/module/current-permission guards; immutable ImportJob/ImportRow writes and source hash storage; branch-scoped source/admission resolution; exact NO_CHANGE comparison; idempotent replay; safe audit/outbox/receipt; authorized signed row pagination; admin UI and failure states. No Person, Student or Enrollment writes.
- **Schema:** additive migration `20261004001700_import_preview` applied to local `vyapti_vschool` and dedicated `vyapti_vschool_test` (both at 21 migrations). Tables are BRANCH scope under Path A with policy metadata; database RLS remains deferred to TEN-03. No reset or history rewrite.
- **Checks:** `pnpm typecheck` pass; `pnpm lint` pass; `pnpm check:db-design` pass (50 tables); `pnpm check:docs` pass (30 tasks); `pnpm check:backend` pass; `pnpm check:boundaries` pass; `pnpm test:unit` pass (84/84); focused real PostgreSQL `test/functional/import-preview.test.ts` pass (3/3). Full functional suite ran; an earlier execution passed existing security cases but its focused imports cases were being fixed. `pnpm build` pass after first complete implementation; rebuild after last UI-only error-state change also completed successfully.
- **Playwright:** `node scripts/database.mjs e2e --config playwright.import.config.ts test/e2e/import-preview.spec.ts` passed 2/2 (Chromium desktop and mobile) against `vyapti_vschool_test`. The config starts a fresh port-3416 server in `.next-e2e`, sets the matching `NEXTAUTH_URL`, and enables only the controlled Student/Academic test manifest. The journey signs in, previews one synthetic CREATE row and one invalid-section row, confirms the no-student-write message, and verifies oversized upload returns 413. JUnit: `artifacts/e2e-import.junit.xml`. An earlier attempt failed because a different Next server held the shared `.next` lock; another failed because the isolated server was missing the test release manifest. Both setup defects are resolved; only the final passing run is accepted as evidence.
- **Build:** `VSCHOOL_E2E=1 pnpm build` passed on Next.js 16.3.8 into `.next-e2e`, preserving the existing port-3410 server and its separate `.next` directory.
- **Seed:** `pnpm demo:seed` now writes the fictional upload file `artifacts/imports-01/sample-roster.csv` once (mode 0600, ignored); the CSV contains one valid CREATE candidate and one invalid-section example. It creates no ImportJob or student rows. `pnpm demo:seed` leaves an existing file intact.
- **Demo:** private synthetic fixture `artifacts/imports-01/private-demo.json` (ignored, mode 0600), based on the existing IAM demo branch and exact active academic references. The earlier snapshot at `artifacts/demos/IMP-01/7858c89b73a09f85b033cea21075e5226ec9631a/demo.json` is an older source and remains unverified. A new snapshot for the tested source will be started on port 3414 before this task is handed over.
- **Next action:** commit intended IMP-01 source/docs/seed changes, start and verify the current-source development snapshot, then mark human review PENDING. PER-02 remains blocked on explicit IAM-03 acceptance.
