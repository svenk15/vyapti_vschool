# VSchool execution policy — merge into the live root AGENTS.md

## Objective and scope
Deliver small, verified, demo-able slices. Follow the current user task; do not expand into every workflow or re-audit the repository. Preserve existing product decisions, dependencies and release gates. User-requested visual checkpoints override automatic continuation. Treat reported completion as evidence to inspect, not permission to restart completed work.

## Load only relevant context
At session start inspect Git status/HEAD, the selected task's module CURRENT_STATE entry and latest evidence, its TASKS acceptance/dependencies, and the relevant DESIGN/ADR sections. Read the execution index only to resolve selection/dependencies. Root CURRENT_STATE is navigation, not an independent status ledger. Use docs/AGENT_RUNBOOK.md for execution-state semantics.

Read Bible sections when product scope/policy is involved; docs/BACKEND_EXTRACTION.md when changing boundaries/wiring; docs/DATABASE_DESIGN.md plus the affected schema/migrations/table registry when changing persistence. For UI load the approved reference screen and relevant design-system recipe. Follow applicable installed Next.js documentation instructions; preserve the existing framework-generated AGENTS block verbatim. Do not load all design packs, all LLDs, entire evidence logs or historical source archives by default.

Use targeted rg searches and bounded reads. Expand context when imports, callers, dependencies or contradictions require it. Reuse decisions already established in the session. Reopen an accepted decision only for a concrete conflict, changed requirement or failing invariant; cite the conflicting source.

## Architecture and invariants
Keep Next.js/TypeScript/Prisma/PostgreSQL and existing Vitest/JUnit-report/Playwright tooling. Domain/application code stays framework independent in backend/modules; infrastructure implements ports; backend/composition wires explicit configuration; lib/server hosts Next adapters; shared/contracts contains browser-safe DTOs. Preserve typed facade/gateway seams. No business rules or Prisma writes in pages/HTTP adapters, no foreign-module private-table mutations, no framework decorators in portable backend. Review new dependencies; no incidental upgrades or per-client source forks.

Authorize institution, branch, membership, capability, resource relationship, entitlement, activation and release availability on the server as required by the operation. Client scope/role claims and public branding are not authority. Preserve verified identity relationships, account-wide recovery policies, module-specific lock order, isolation, idempotency, version checks and atomic audit/outbox/receipt semantics. Do not weaken these to accelerate a task.

Use real PostgreSQL for persistence invariants. New tables follow vs_<owner>_<entity>, snake_case and explicit mappings; preserve scoped constraints and forward-only migrations. Update docs/database/TABLE_REGISTRY.json when a table contract changes. No reset, fabricated backfill, secret copying or real student PII in logs/evidence. Demo seeds remain fictional, guarded and non-destructive. TEN-03 remains a production gate until actual restricted-role/RLS evidence passes; local demo permission does not authorize real client data.

## Execute a bounded slice
Before new business behavior, resolve its input/output, permission, state transition, database/transaction, failure and acceptance contract in the owning DESIGN.md. Reuse adequate existing LLDs; document only changes. Cosmetic fixes do not require a new domain design. One active slice; use approved dependency order. Record and isolate unresolved business decisions; continue only independently eligible work within the authorized batch.

For UI, inspect the exact approved original body plus enhanced sidebar. Compare equivalent reference/application states at matching desktop/mobile viewports, including meaningful interactions. Reuse components/ui and brand tokens. Do not replace visual comparison with passing browser assertions; do not fake data, remove focus visibility or silently simplify approved journeys. Record necessary deviations.

## Verification without duplication
Inspect package scripts and wrapper forwarding before the first focused command; store exact working commands with task evidence. Do not guess extra -- separators or bypass guarded DB harnesses. Check the selected test count/names. Diagnose logs/traces before repeating failures. Keep full logs in artifacts; report concise outcomes and relevant error excerpts.

During iteration run checks covering the changed behavior and risk. Shared auth/context/schema changes require affected negative/isolation/transaction tests. Shared UI changes require representative consumers, not just one screenshot. Run mandatory task gates before VERIFIED, and required integrated checks/build at the batch checkpoint. If cadence is amended, document it; never silently skip existing required gates. Commits may checkpoint partial work without marking it VERIFIED.

Reuse successful results only while tested inputs, relevant dependencies, configuration/schema and environment remain applicable; cite original tested source and reason for reuse. A changed source is not automatically covered by an old build. Avoid concurrent builds/type generation into the same output directory. Reuse healthy servers only when configuration/source/test isolation match. Never point E2E at the development DB to save startup time.

## Evidence and handover
Update DESIGN/TASKS for actual contract/scope changes; update the owning CURRENT_STATE and linked evidence at each completed slice or safe handover. Update Bible/ADRs only for cross-cutting product/architecture decisions. Do not regenerate whole registries or historical screenshots unnecessarily. Keep functional verification, visual comparison, human acceptance and production readiness separate. Human PENDING alone does not block ordinary authorized implementation; explicit user pauses, failed feedback and technical gates still apply.

At handover record task, HEAD/dirty files, exact decisions/source links, verified commands/source, remaining gate, next action and demo provenance. Never mark human PASSED yourself. Preserve unrelated changes; stage only intended changes. No automatic reset/stash, deployment, remote push, real notification or destructive operation. If an approval action is rejected, preserve work and report it; do not bypass the review.
