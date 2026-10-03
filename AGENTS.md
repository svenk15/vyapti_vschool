# VSchool agent instructions

Read START_HERE.md, docs/VSchool_Bible.md, docs/EXECUTION_INDEX.md and the next module's DESIGN.md, TASKS.md and CURRENT_STATE.md before coding. Use docs/AGENT_RUNBOOK.md. User pause overrides all task-selection rules.

This is a fresh independent project. Do not edit another checkout, import its secrets/data or mark its completed tasks as completed here. No timer, deployment or external messaging is pre-authorized by this archive. Work on one ready vertical slice at a time and preserve unrelated local changes.

Retain Next.js/TypeScript/Prisma/PostgreSQL, Vitest JUnit XML and Playwright. Keep domain/application code framework-independent; concrete adapters belong in infrastructure and composition. Read the installed Next.js docs under node_modules/next/dist/docs before using new framework APIs. Pin and review any new dependencies and lockfile changes.

Reuse components/ui and approved brand tokens; use docs/modules/design-system/DESIGN.md for screen recipes. Do not create per-school source forks or accept arbitrary branding CSS. Resolve institution entitlement, branch activation, release availability and current resource permissions on the server; a hidden navigation item is not authorization. Public login branding never grants tenant access.

Enforce current membership/resource authorization in application use cases and transactional guards. Never trust a client school ID or mutate foreign-module tables directly. Use real PostgreSQL for persistence invariants. No raw student PII in logs, fixtures, receipts, source-control or analytics.

Before implementing a task, make sure its design resolves the database, reads, writes, errors, permissions and acceptance tests. Update design and Bible changelog if you find a contradiction; do not silently invent a new rule. State must reflect actual evidence and user acceptance separately.

After each task, run required checks, update CURRENT_STATE.md, create a focused commit and provide a running demo with manual steps and tested commit. Record human review PENDING and continue to the next eligible task without waiting, unless a documented dependency explicitly requires human acceptance. Only mark PASSED after explicit feedback. Prioritize reported defects before dependent work. Pause only for a blocking decision, missing access, destructive action or failed verification that cannot be resolved safely. Work on one complete vertical slice at a time; batch independent reads/searches and avoid repeating unchanged checks unless a release gate requires them. Keep pending demos tied to stable builds. Never claim an always-running autonomous loop exists; no timer/deployment/external messaging is authorized. Do not reset/reseed a database merely to make a test pass.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Physical database design: read docs/DATABASE_DESIGN.md and the current module LLD before schema changes. Use vs_<owner>_<entity> names, snake_case columns and explicit Prisma mappings. Update docs/database/TABLE_REGISTRY.json when changing a table contract; pnpm check:db-design must pass. Add forward migrations, never edit applied migrations, reset databases or copy rows to perform a rename. Preserve scoped composite FKs and the documented owner boundary.

Backend extraction is a required constraint. Read docs/BACKEND_EXTRACTION.md. Write domain/application/infrastructure in backend/modules and factories in backend/composition; Next hosting wrappers go in lib/server, browser-safe DTOs in shared/contracts. Never place business rules or Prisma writes in pages, route handlers or server actions. No Next/React/server-only/Nest decorators in portable backend. Each business module uses a typed transport-neutral facade and a frontend gateway seam. pnpm check:backend and check:boundaries must pass.
