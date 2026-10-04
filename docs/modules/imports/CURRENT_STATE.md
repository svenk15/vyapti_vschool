# Previewed, resumable student roster import — current state

Last updated: 2026-10-04. Existing task progress preserved; local owner acceptance is pending. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| IMP-01 | VERIFIED | PENDING | Focused PostgreSQL, desktop/mobile Playwright, checks and current-source local demo verified below |
| IMP-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| IMP-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

**Design readiness (4 October 2026):** IMP-01 LLD/task align on Imports-only preview storage, immutable source/hash/revision, separate 2 MiB CSV, 8 KiB metadata/envelope and 16 KiB multipart framing bounds, exact branch-scoped source/admission resolution, no student writes, current `student.manage` authorization, audit exclusions and Path A metadata. The existing Student list search remains available and identity linking is not inferred. Source hashes stay in ImportJob storage. Reads use current authorization and no write lock. Dependency snapshot: STU-02 VERIFIED/PENDING; its implementation dependency is satisfied and human PASSED is not a task gate. No product blocker remains for preview-only IMP-01; TEN-03 RLS is a release gate, not an implementation blocker.

IMP-01 implements preview-only student roster uploads with no Person, Student or Enrollment writes. The forward migration `20261004001700_import_preview` is applied to `vyapti_vschool` and `vyapti_vschool_test`; both currently report 21 migrations, with no pending migration. No earlier migration or database was reset. Path A RLS metadata remains planned for TEN-03; current application membership/resource authorization and student/academic module checks stay active.

## Next action

Human review is PENDING for the current-source demo. Address any reported defect before dependent work. `pnpm next-task` selects the next implementation task; dependency acceptance requirements in its LLD/task remain controlling. Do not mark human acceptance PASSED without owner feedback.

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
- **Demo:** `http://127.0.0.1:3414/admin/imports`, frozen production-mode snapshot for tested source `c33f2b4d8fb79f4426b2708abf64d55570d2e434`, build `Tyy8fqlNbOid7i42vkI0o`, using local `vyapti_vschool` with only Student/Academic demo releases. Health and sign-in returned 200; protected import page redirects when signed out. Browser smoke signed in using the existing synthetic account, uploaded the ignored `artifacts/imports-01/sample-roster.csv`, and observed one CREATE candidate, one invalid-section ERROR, and the “No student records were changed” feedback. All static assets returned 200. The preview-only ImportJob/rows remain in the local development database; no Student/Person/Enrollment row is written. The separate test-cluster IAM-04 demo and unrelated ports remain untouched.
- **Private files:** credentials remain in ignored mode-0600 `artifacts/imports-01/private-demo.json` (same existing synthetic IAM-01 account); fictional upload input is ignored mode-0600 `artifacts/imports-01/sample-roster.csv`. Neither file is tracked.
- **Manual review (human acceptance PENDING):** (1) Open `http://127.0.0.1:3414/sign-in` and use the existing private synthetic demo credential. (2) Open `/admin/imports`, select the open academic year, enter namespace `SEED-DEMO`, choose an included date and upload `artifacts/imports-01/sample-roster.csv`. (3) Preview; expect one CREATE candidate, one invalid-section ERROR and explicit no-student-write feedback. (4) Upload a file larger than 2 MiB; expect a safe size error and no student changes. Automated checks do not mark owner acceptance.
- **Next action:** keep port 3414 available for review and continue only to the next task selected by `pnpm next-task` when its explicit acceptance gates are met. PER-02 remains blocked on explicit IAM-03 acceptance.
