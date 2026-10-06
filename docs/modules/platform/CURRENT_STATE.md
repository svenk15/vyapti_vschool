# Development foundation and delivery — current state

Last updated: 2026-10-06. FND-01 locally verified and accepted on the owner’s Mac. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| FND-01 | VERIFIED | PASSED | [Local verification](../../evidence/fnd-01-local/verification.json); source fd1ba58f02bb60d14527595a73aca93ad4c8e0ff |
| FND-02 | VERIFIED | PENDING | [Demo verification](../../evidence/fnd-02-demo/verification.json); executable checkpoint and evidence commit recorded there |

## Current checkpoint

Foundation source fd1ba58f02bb60d14527595a73aca93ad4c8e0ff passed local checks, real PostgreSQL functional tests, desktop/mobile browser journeys, failure-state probes and production build. The FND-01 demo at http://127.0.0.1:3400 was accepted and stopped for the authorized DS-01 build. See design-system CURRENT_STATE for the current demo. Human acceptance PASSED after explicit owner feedback.

## Next action

Keep the stable FND-02 local demo available for consolidated owner review. Address any reported defect before subsequent authorized work. Native 200% zoom, VoiceOver and NVDA evidence remains outstanding. TEN-03 remains IN_PROGRESS and blocks production release and real-client data; its deferred RLS/context-proof work is still unverified.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

### FND-02 PHASE 1 DEMO READY — 6 October 2026

Implementation VERIFIED for the source checkpoint in [verification.json](../../evidence/fnd-02-demo/verification.json); human review is PENDING. Demo URL: http://127.0.0.1:3440. Local-only synthetic credentials are in ignored `artifacts/people-02/private-demo.json`; attendance credentials are also present in ignored `artifacts/attendance-01/private-demo.json`. Seed with `pnpm demo:seed`. The two guarded seed runs succeeded without replacing existing credentials or records; the development mail sink is file-only, and no real message was sent.

Checks on the candidate: `pnpm check` passed, including lint/typecheck/docs/database-design/boundary/backend checks and 104 unit tests; `pnpm test:functional` passed 106 tests across 16 suites on real PostgreSQL before the final UI-only dialog callback correction; `pnpm test:e2e` passed 78/78 on the final executable source using an isolated production build. The same final build was captured for 28 implemented routes at desktop/mobile sizes (56 renders), with no failed responses, page errors or page-width overflow. Selected screens were visually inspected. `pnpm db:setup` confirms the designated development schema is current; both local databases retain the existing 31 migrations. No FND-02 schema change or destructive database operation occurred. Focused Playwright covers keyboard/dialog behavior, responsive layouts, authorization denial and admin/teacher flows; native 200% zoom and VoiceOver/NVDA were not performed.

The stable server is a production-mode Next process from `.next-e2e`, bound to loopback port 3440 and connected to the guarded local development database. Health `/api/health` and `/api/health/live`, public school sign-in `/sign-in/vschool-demo-69a6f7fe`, protected admin entry `/admin`, and teacher workspace `/teacher/today` returned expected responses. Admin/teacher synthetic persona credentials are stored privately in the ignored People credential file above. Manual review remains PENDING; this milestone does not establish production readiness.

### PHASE 1 DEMO READY sequencing — 6 October 2026

Owner changes the immediate milestone from release to PHASE 1 DEMO READY. Pending human review never blocks the demo. Remaining TEN-03 RLS enforcement and non-forgeable context proof are deferred until after the consolidated demo/review; TEN-03 must remain IN_PROGRESS and is still a production and real-client-data gate. Preserve its partial code and migrations. Demo sequencing prerequisites are RPT-02, IMP-03, IAM-03, ATT-04 and BRD-02; the full release dependencies remain listed in the execution index. Outstanding native VoiceOver/NVDA and other accessibility tests are reported as not run. No production readiness is claimed.

## Evidence history

Append dated task records here using docs/AGENT_RUNBOOK.md. Include source commit, changed files, schema version, commands/results, demo URL, manual feedback and next action. Do not store credentials or real pupil data.

### Historical v4.0 preparation checkpoint — 3 October 2026

Fresh source prepared and verified on Linux: frozen install, lint/types/boundaries/docs, 3 unit tests, 3 real-PostgreSQL functional tests, 4 desktop/mobile E2E tests and production build passed. Reports/screenshots and environment limitations are in ../../VERIFICATION.md. No Mac demo or human acceptance is claimed. FND-01 remains IMPLEMENTED until the owner’s local checkpoint and demo verification are recorded. No feature task started.

### v4.1 experience and tenancy foundation

Updated landing page, shared component gallery, synthetic branch/module configuration and branded login previews are included. Reference domain policies model module dependencies, tenant context and safe palettes. Current executed checks and screenshots are in ../../VERIFICATION.md; these supersede the historical v4.0 counts above. Only SetupCheck is migrated. Human review and the owner’s Mac checkpoint remain pending.

### Historical v4.2 database naming checkpoint

Vora mapping, a data-preserving forward migration and the database naming/catalog gate are included. Current execution evidence is in ../../VERIFICATION.md. No new business module or human acceptance is inferred. Every Phase 1 LLD now lists physical names and schemas; only the setup table is installed.

### v4.3 prefix revision

Physical names now use the requested vs_ prefix. Original migration files remain unchanged and a forward migration renames the marker and PK in place. Current checks and migration evidence are recorded in ../../VERIFICATION.md.

### v4.4 backend extraction foundation

Backend modules/factories are physically separate; shared public contracts are browser-safe; Next environment/server-only wrapping remains in lib/server. Independent backend compile and stronger dependency checks are implemented. Nest host/runtime is not installed; future controller/auth/deployment work is specified in ../../BACKEND_EXTRACTION.md. See current verification for executed evidence.

### FND-01 local checkpoint — 3 October 2026 (in progress)

Branch: main. Source under test: fd1ba58f02bb60d14527595a73aca93ad4c8e0ff. Initial Git status clean. Intended outcome: genuine development PostgreSQL readiness plus explicitly synthetic UI/configuration/sign-in previews. Both private environment targets match the dedicated local database names; setup commands preserved .env. No new dependencies, migrations or business tables are needed. Full checks, real-DB tests, browser journeys, production build and demo verification are required before VERIFIED. Human acceptance remains unrequested until the stable demo is ready.

### FND-01 local verification and demo — 3 October 2026, 21:58 IST

Implementation VERIFIED; human review PENDING. Tested executable source: `fd1ba58f02bb60d14527595a73aca93ad4c8e0ff` on main. This checkpoint changes documentation/evidence only; executable source, dependencies and migration files are unchanged. The evidence commit can be identified with `git log -- docs/modules/platform/CURRENT_STATE.md` rather than a self-referential SHA.

Environment: macOS, Node 24.20.0, pnpm 11.25.0, PostgreSQL 16.15 (Homebrew), Next 16.3.8. Both dedicated databases were inspected: development `vyapti_vschool`, test `vyapti_vschool_test`. All three migrations are applied with no rollback: `20261003000100_foundation`, `20261003000200_vora_naming`, `20261003000300_vs_prefix`. Deploy reported no pending migrations. Existing marker timestamps are recorded in the safe JSON evidence. Only `vs_platform_setup_check` is installed as a business-owned table; no schema changes, database reset, row-copy rename or user data provisioning occurred. Setup preserved the private .env; no secrets were added to the checkpoint.

Executed commands and results:

- `pnpm next-task`: exit 0, suggested FND-01.
- `pnpm install --frozen-lockfile`: exit 0, already up to date; optional pnpm update metadata lookup could not reach the registry. No dependency or lockfile change.
- `pnpm setup:local` and `pnpm setup:local --test`: exit 0, existing URLs preserved.
- `pnpm db:setup`: first sandbox attempt exit 1 (schema-engine connection failure); approved retry outside the sandbox exit 0, no pending migrations, idempotent marker insert.
- `pnpm check`: exit 0; lint, TypeScript, documentation, database design, boundaries, independent backend compilation and 26 unit tests passed. [JUnit](../../evidence/fnd-01-local/unit.junit.xml).
- `pnpm test:functional`: exit 0, 4 tests passed against real test PostgreSQL: marker replay, transaction rollback, readiness marker and actual physical table/column/PK mappings. [JUnit](../../evidence/fnd-01-local/functional.junit.xml).
- `pnpm test:e2e`: exit 0, 12 tests passed (6 desktop + 6 mobile), covering readiness, safe health, scoped non-authenticating login preview, branch configuration, table interactions and keyboard controls. [JUnit](../../evidence/fnd-01-local/e2e.junit.xml). Screenshots and traces remain in ignored local artifacts; human visual acceptance is pending.
- `pnpm build`: exit 0, production build and TypeScript passed.
- A Node spawn/assert probe invoked `scripts/database.mjs` in dev, functional and e2e modes with a synthetic incorrect database target: all exited 1 with the safe guard message before database access.
- `node /private/tmp/vschool-fnd-probe.mjs`: initial sandbox probes failed on restricted local sockets (including EPERM); approved corrected probe exited 0. Read-only database inspection plus HTTP probes verified production routes and separate temporary missing-config/unavailable servers. Both failure cases returned health 503, safe state, no URL disclosure, and landing HTTP 200 with the appropriate recovery label. Temporary servers stopped; development database was never disabled or changed to simulate failure. [Safe observed results](../../evidence/fnd-01-local/verification.json).
- `pnpm start`: stable production server at port 3400, session 5524; all demo routes returned 200, health ready=true, liveness release fresh-0.3.0. Production build was created from the tested source above; subsequent changes are docs/evidence only.

Changed paths: platform CURRENT_STATE.md, platform DESIGN.md, Bible changelog and docs/evidence/fnd-01-local. Reconciled stale platform wording with existing Bible preview policy and current release identifier; no new product rule was invented.

Manual review script:

1. Open http://127.0.0.1:3400. Expect Database connected and an explicitly illustrative workspace with no live school records.
2. Open /api/health and /api/health/live. Expect ready=true/state=ready, alive=true/release=fresh-0.3.0 and no database URL or credentials.
3. Open /design-system. Search/sort/page the sample table, open a confirmation and press Escape, then use arrow keys on tabs. Expect working controls, restored dialog trigger focus and clear sample states.
4. Open /configure. Switch branches/institutions, change palette/welcome text and review. Expect independent sample selections and Nothing was persisted. Refresh; expect initial preview defaults.
5. Open /sign-in/greenwood-north. Try synthetic values only. Expect Greenwood identity and a notice that no credentials were sent/stored; password clears and no authentication occurs. Narrow the browser to inspect mobile layout.

Limitations: foundation and previews only; no real authentication, persisted tenant configuration, operational authorization or attendance. No production deployment, migration upgrade rehearsal from an older schema in this run, VoiceOver/NVDA certification, Safari/Firefox or load testing is claimed. Existing migration history is verified applied; historical upgrade proofs remain separate. Human acceptance stays PENDING until explicit feedback for this source. Next action: keep this demo stable and pause before DS-01 or any other task.

### FND-01 owner acceptance — 3 October 2026

Owner feedback: “Pass. Please go ahead and implement with the next task”. Human review PASSED for tested source fd1ba58f02bb60d14527595a73aca93ad4c8e0ff and evidence checkpoint 6fa8158. Permission covers DS-01 next; pause again at its review checkpoint.

### IAM-01 shared schema observation — 4 October 2026

Access IAM-01 adds the forward access-bootstrap migration plus Platform-owned audit/outbox/receipt envelopes. Both dedicated databases preserve the prior foundation marker IDs/timestamps and all four migration records. The enlisted Platform writer appends provisioning audit/outbox in the Access transaction; real-DB tests prove rollback after append and immutable history guards. See [Access verification](../access/CURRENT_STATE.md) and [safe evidence](../../evidence/iam-01-local/verification.json). This does not implement FND-02 or external event delivery.

### 5 October 2026 — shared operator audit contract (IMP-03)

A new global `vs_platform_operator_audit` table was added by the Imports retention task because tenant `AuditEntry` requires an account FK and would misattribute a platform operator. It stores aggregate retention counts only, has an append-only trigger and operator/time index, and is applied in both local databases at migration 22. No tenant scope or public/runtime route is provided. Database catalog checks pass; implementation evidence and IMP-03 acceptance remain tracked in [Imports current state](../imports/CURRENT_STATE.md).

### Public-entry correction — 6 October 2026

The consolidated live-browser check found that teacher authentication correctly landed at `/account`, but the account page had no link to the assigned-teacher workspace. Added a `My teaching day` link only when server-resolved account capabilities include `attendance.mark`; the teaching route and every resource permission check remain unchanged. Verified the updated demo on source `dd6c863` (build `zqWBs7C8HCt8KfqT1iZjB`) at http://127.0.0.1:3440: administrator reaches `/admin`; teacher reaches `/account`, follows the link to `/teacher/today`, and sees three assigned sessions; branded sign-in remains available. Desktop/mobile screenshots are in ignored `artifacts/fnd-02-demo/routes/teacher-account-*.png`.

The link also checks the current Attendance module permission, so it remains hidden when branch/module access is unavailable. On the same live server, the authorized IAM-01 institution administrator switched to the seeded second TEN-01 branch and back to the original branch; the `selectable:false` synthetic branch was not offered. Credential/persona locations: `artifacts/iam-01/private-demo.json` (institution administrator and branded branch), `artifacts/people-02/private-demo.json` (operational administrator and assigned teacher), and `artifacts/attendance-01/private-demo.json` (secondary teacher and attendance data). Verification on the final corrected source: `pnpm check` passed (104 unit tests and repository lint/type/docs/database/boundary/backend gates); `pnpm test:e2e test/e2e/attendance-sessions.spec.ts test/e2e/access.spec.ts test/e2e/starter.spec.ts` passed 26/26 desktop/mobile, including public sign-in, protected redirects, invalid credentials, CSRF, token-version revocation and membership suspension. The focused E2E run built the isolated production candidate. The previous full 78/78 suite was on the immediately preceding source; it was not rerun after this navigation-only correction. Human review remains PENDING.
