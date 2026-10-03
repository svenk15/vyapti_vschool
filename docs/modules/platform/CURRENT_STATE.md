# Development foundation and delivery — current state

Last updated: 2026-10-03. Fresh baseline; no imported task completion. Design revision 1 is present; local owner acceptance is pending. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| FND-01 | IMPLEMENTED | NOT_REQUESTED | [Starter verification](../../VERIFICATION.md); Mac checkpoint pending |
| FND-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

Foundation source is included. See verification for actually executed preparation tests. Local machine database, Git checkpoint and human acceptance are not verified here.

## Next action

Complete FND-01 on the owner’s Mac, show the running starter, and request review. Do not start a timer or IAM-01 until authorized.

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
