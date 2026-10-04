# Development foundation and delivery — current state

Last updated: 2026-10-03. FND-01 locally verified and accepted on the owner’s Mac. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| FND-01 | VERIFIED | PASSED | [Local verification](../../evidence/fnd-01-local/verification.json); source fd1ba58f02bb60d14527595a73aca93ad4c8e0ff |
| FND-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

Foundation source fd1ba58f02bb60d14527595a73aca93ad4c8e0ff passed local checks, real PostgreSQL functional tests, desktop/mobile browser journeys, failure-state probes and production build. The FND-01 demo at http://127.0.0.1:3400 was accepted and stopped for the authorized DS-01 build. See design-system CURRENT_STATE for the current demo. Human acceptance PASSED after explicit owner feedback.

## Next action

Owner accepted FND-01 and authorized the next task. DS-01 selected using pnpm next-task. No timer is started.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

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
