# VSchool agent instructions

## Objective and scope

Deliver small, verified, demo-able slices. Follow the current user task and stop boundary; a user-requested visual checkpoint overrides automatic task selection or continuation. Preserve completed work, product decisions, dependencies, acceptance gates and unrelated changes. Treat reported completion as evidence to inspect, not permission to restart work. This is an independent project: do not edit another checkout, import its secrets/data or mark another project's tasks complete here. No timer, deployment, push or external messaging is pre-authorized.

## Load only relevant context

At session start inspect Git status/HEAD, the selected module CURRENT_STATE entry and latest evidence, its TASKS acceptance/dependencies, and the relevant DESIGN/ADR sections. Read docs/EXECUTION_INDEX.md only to resolve task selection or dependencies. Root CURRENT_STATE is navigation, not an independent status ledger. Use docs/AGENT_RUNBOOK.md for execution-state semantics.

Read relevant docs/VSchool_Bible.md sections when product scope or policy is involved; docs/BACKEND_EXTRACTION.md when changing boundaries or wiring; docs/DATABASE_DESIGN.md plus affected schema, migrations and table registry when changing persistence. For UI, load the exact approved reference state and relevant docs/modules/design-system/DESIGN.md recipe. Read START_HERE.md when repository orientation is actually needed. Do not load every design pack, LLD, evidence log or historical archive by default.

Use targeted `rg` searches and bounded reads. Expand context when imports, callers, dependencies or contradictions require it. Reuse decisions already established in the session. Reopen an accepted decision only for a concrete conflict, changed requirement or failing invariant, and cite that source.

## Architecture and security invariants

Retain Next.js/TypeScript/Prisma/PostgreSQL, Vitest JUnit XML and Playwright. Domain/application code stays framework independent in backend/modules; infrastructure implements ports; backend/composition wires explicit configuration; lib/server hosts Next adapters; shared/contracts contains browser-safe DTOs. Preserve typed facade/gateway seams. Never place business rules or Prisma writes in pages, route handlers or server actions, mutate another module's private tables, or add Next/React/server-only/Nest decorators to portable backend. Each business module keeps a typed transport-neutral facade and frontend gateway seam. `pnpm check:backend` and `pnpm check:boundaries` must pass when a slice affects these boundaries. Review and pin new dependencies; avoid incidental upgrades, generic speculative abstractions and per-school source forks.

Resolve institution, branch, live membership, capability, resource relationship, entitlement, activation and release availability on the server as required by each operation. Client scope/role claims, hidden navigation and public branding are not authority. Preserve verified identity relationships, account-wide recovery policy, module lock order, transaction isolation, idempotency, version checks and atomic audit/outbox/receipt semantics. Never weaken these to accelerate a task.

Use real PostgreSQL for persistence invariants. New tables use `vs_<owner>_<entity>`, snake_case columns and explicit Prisma mappings; preserve scoped composite foreign keys, documented owner boundaries and forward-only migrations. Update docs/database/TABLE_REGISTRY.json when a table contract changes and run `pnpm check:db-design`. Never edit applied migrations, reset/delete databases, copy rows to perform a rename, fabricate a backfill, copy secrets or place real student PII in logs, fixtures, receipts, source control or analytics. Demo seeds stay fictional, guarded, idempotent and non-destructive. TEN-03 remains a production gate until restricted-role/RLS evidence passes; a local synthetic demo never authorizes real-client data.

Reuse components/ui and approved brand tokens. Do not accept arbitrary branding CSS. For visual implementation, use `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/START_HERE.md` and the selected screen/component contract. For UI, inspect the exact approved original body plus enhanced sidebar and compare equivalent reference/application states at matching desktop/mobile viewports, including meaningful interactions. Do not replace visual inspection with browser assertions, fake data, remove visible focus or silently simplify an approved journey. Record necessary deviations.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Execute a bounded slice

Before new business behavior, ensure the owning DESIGN resolves input/output, permissions, reads/writes, state transitions, transaction/concurrency behavior, failures and acceptance tests. Reuse adequate LLDs and document only changes; cosmetic fixes do not require a new domain design. Work on one ready vertical slice at a time in approved dependency order. Record and isolate unresolved decisions, then continue only independent work within the authorized batch.

During iteration run focused checks covering the changed behavior and risk. Shared authorization/context/schema changes require affected negative, isolation and transaction tests. Shared UI changes require representative consumers and visual evidence. Run every mandatory task gate before VERIFIED and the required integrated checks/build at the documented batch checkpoint. Inspect wrapper forwarding before the first focused test command, record working commands, diagnose logs/traces before retrying, and do not repeat an unchanged successful check without a concrete reason. Never bypass guarded database harnesses or point E2E at the development database.

After each completed task, update the owning CURRENT_STATE with actual evidence, create a focused commit, start or verify a compatible local demo, and give the URL, tested commit and concrete manual steps. Keep functional verification, visual comparison, human acceptance and production readiness separate. Record human review PENDING and continue only as allowed by the user's current stop boundary; never mark human PASSED without explicit feedback. Failed feedback takes priority. Pause only for a requested stop, blocking decision, missing access, destructive action or failed verification that cannot be resolved safely. Never reset/reseed merely to make a test pass or claim an always-running autonomous loop.

At handover record the task, HEAD/dirty files, decisions and source links, exact verified commands/source, remaining gates, next action and demo provenance. Preserve historical evidence and stage only intended files. No automatic reset/stash, deployment, remote push, real notification or destructive operation. If approval is rejected, preserve work and report it rather than bypassing review.
