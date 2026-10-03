# Start here — vyapti_vschool

This is a new, independent starter folder. Do not extract it over the existing project, copy its .env, or point it to an existing school database. The previous repository remains your backup. This archive has no .git directory and does not modify any earlier branch.

The running app includes a polished landing page, a genuine PostgreSQL readiness check, a working shared-component gallery, synthetic institution/branch configuration and school-branded sign-in previews. Configuration previews are temporary; login previews do not authenticate. Persistent tenant setup, school management and attendance remain implementation tasks.

This revision includes Bible v4.4, 11 module documentation packs and 29 Phase 1 tasks. It establishes institution tenants, multiple branches, independent module packaging and a consistent brandable experience. Later-phase product blueprints are in the Bible; their implementation-ready module packs are added before development begins.

## Your first step

Open this folder in VS Code and follow [START_ON_MAC.md](START_ON_MAC.md). Stop after the page shows Database connected and `pnpm check` succeeds. Then tell your agent to complete FND-01's local checkpoint and manual review. Do not start a 24-hour timer automatically.

## Reading order

1. [Bible](docs/VSchool_Bible.md): scope and global rules.
2. [Database design](docs/DATABASE_DESIGN.md): naming convention, planned schemas and join/write contracts.
3. [Execution index](docs/EXECUTION_INDEX.md): task order and dependency links.
4. Current module's DESIGN.md, TASKS.md and CURRENT_STATE.md.
5. [Agent runbook](docs/AGENT_RUNBOOK.md): checkpoint, testing and demo procedure.
6. [Verification](docs/VERIFICATION.md): what was actually tested when this starter was prepared.

There are four authorities: Bible; each module's design; each module's tasks; each module's current state. The execution index and root CURRENT_STATE.md only direct you to them. `pnpm next-task` reports the next eligible task; it does not execute an autonomous agent.

## Message to your local coding agent after setup

```text
This folder is the fresh VSchool project. Read AGENTS.md and START_HERE.md.
Do not modify my earlier repository or database. Complete FND-01: verify this
checkout and dedicated database, run the starter checks, start the server
and show me the URL and manual test steps. Update only the fresh module
CURRENT_STATE.md with real evidence. Do not start IAM-01 or a timer yet.
```

The VS naming update uses a forward migration. If updating an earlier fresh starter, stop its local server, keep its private .env and Git history, apply pnpm db:setup in that fresh project only, then restart the matching updated code. START_ON_MAC.md remains the clean-install guide.

Backend portability: read docs/BACKEND_EXTRACTION.md. Business code is physically separated under backend/, with browser-safe shared/contracts and thin Next hosting adapters in lib/server. The current app is still hosted by Next; Nest extraction is a documented future migration.

Project identity: npm package and extracted folder are named vyapti_vschool. The portal product remains VSchool. Development uses vyapti_vschool and tests use vyapti_vschool_test. An existing older database must be renamed explicitly and its private connection URL updated; setup never silently replaces it.

Local progress: FND-01, DS-01 and BRD-01 have passed owner review. IAM-01 adds restricted operator bootstrap and real administrator sign-in at `/sign-in`; its review/evidence is recorded in [access CURRENT_STATE](docs/modules/access/CURRENT_STATE.md). The branded `/sign-in/<slug>` screens remain synthetic previews until BRD-02. Use the README for local authentication configuration.
