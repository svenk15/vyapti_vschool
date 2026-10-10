# Agent execution and handoff

## Task lifecycle

Implementation: NOT_STARTED → IN_PROGRESS → VERIFIED. BLOCKED is allowed with reason and safe next action. VERIFIED means the task's automated gates and stable demo passed, not that a human accepted it. Human review: NOT_REQUESTED → PENDING → PASSED or FAILED. FND-01 starts IMPLEMENTED for the prepared scaffold, with local verification/acceptance still needed; this is not a product acceptance.

At resume, inspect Git status/HEAD, then read the selected module CURRENT_STATE entry, its latest evidence and only the task-specific acceptance, dependency and design sections needed for the active slice. Expand context under the root AGENTS.md routing rules. `pnpm next-task` prioritizes FAILED human feedback for defect resolution, then IN_PROGRESS, then tasks whose dependencies are implementation-VERIFIED. Human review status (including PENDING or NOT_REQUESTED) never blocks dependent implementation under the current owner policy; never invent acceptance. A technical/security prerequisite or failed required verification still blocks dependent work. The task's CURRENT_STATE table is authoritative; dated dependency snapshots in design/checkpoint notes are historical context only. The suggestion is advisory. FND-01 must be locally VERIFIED before IAM-01 starts. Never mark a design or task document as implementation evidence.

## One task loop

1. Inspect Git branch/status and the selected task checkpoint; no automatic stash/reset. Read its acceptance/dependencies and relevant owner design/ADR sections. Identify migrations and touched modules only when the slice involves persistence.
2. Set current task IN_PROGRESS with branch, start time, intended acceptance and unresolved risks.
3. Implement the full user-visible slice: domain, use case/ports, adapters/schema, delivery layer and meaningful tests. Use a migration for database changes; no untracked db push.
4. During iteration run focused checks for the changed behavior and risk. Before VERIFIED, run every task-mandated gate; protected flows include relevant forbidden and cross-school identities. Run repository-wide checks and the production build at the documented batch checkpoint, or earlier when the task gate or blast radius requires them. Record exact outputs and limitations.
5. Review the diff; checkpoint intended source/docs only. Record the source commit under test. If a subsequent docs-only commit records evidence, identify both commits; don't invent a self-referential SHA.
6. Start a local demo on port 3400 (`pnpm dev`, or build then `pnpm start`). Inspect health and the served route. Keep a separate terminal/session alive; never claim the user's Mac server was started from a remote session.
7. Give URL, task ID, source commit, setup/credentials procedure, 3–5 manual steps and expected results. Mark review PENDING. Keep the demo stable while review is pending; use a new port/checkout if continuing would change the build under review.
8. Update the module CURRENT_STATE evidence and next task. Continue immediately with the next implementation-eligible slice while reviews are PENDING or NOT_REQUESTED; no human acceptance dependency blocks implementation in this authorized Phase 1 batch. Human FAILED feedback takes priority for defect repair; PASSED applies only to explicit feedback on the reviewed source. Changes invalidating accepted behavior need another review. Required technical verification remains mandatory. Batch independent reads/searches; do not repeat unchanged checks unless a release gate requires them.

## Evidence record to append to module CURRENT_STATE.md

Task, implementation status, human status; source commit/dirty fingerprint; changed paths; migrations applied and database label (no URL); test commands/exits/report paths; demo URL/start/health check/build identity; manual script; known limitations; exact next action. Keep historical entries; update the current status table in place.

## Timeboxes

No start/freeze/deadline is bundled. After FND-01 and scope confirmation, the user may authorize a 24-hour first implementation timebox. Record UTC start, UTC freeze at +19h, UTC stop at +24h and Asia/Kolkata display values in platform CURRENT_STATE. Pauses do not silently extend it. At freeze, finish a safe checkpoint and validate/demo; at stop, preserve state and report completed/blocked/pending. A timebox may end before the entire Phase 1 scope is finished. Do not cut integrity/security tests to claim completion.

## Adding a module

Use docs/templates. Give the module a phase, ownership and public contracts; extend the Bible module/phase index and change log; create detailed DESIGN/TASKS/CURRENT_STATE files; add dependencies to EXECUTION_INDEX; run check:docs. No empty placeholder can be READY. A later module may be planned without its schema being finalized.

## Pilot release and recovery

PHASE 1 DEMO READY is a local synthetic-data milestone: record the exact source/build, guarded idempotent seed, protected admin/teacher browser journeys, module checks, and demo limitations. The owner’s 6 October decision defers TEN-03 enforcement/context proof until after consolidated review; this does not permit real-client data or production release. FND-02 production release still requires a separate checklist backed by evidence: migrations from empty and previous checkpoint DB; protected-route/tenant tests; real account provisioning and identity-verified recovery; DB snapshot before release; restore into a new isolated database and reconciliation of counts; TLS/secrets and rate controls; production health/log redaction; pilot privacy/retention decision; operator troubleshooting and rollback plan. Do not reset/delete existing databases to rehearse these steps. Application rollback is permitted only if schema remains compatible. Otherwise roll forward; restore to a new target before routing traffic. Never apply a Git revert as a database rollback.

PostgreSQL backup/restore commands for the chosen deployment belong in the FND-02 evidence runbook after target/operator verification. No production backup is claimed by the starter. The pilot must define who takes backups, how often, retention, restore ownership and acceptable recovery objectives before real data is admitted.

## Portable backend gate

Enforce the backend/shared/Next adapter boundaries on every module task. Read BACKEND_EXTRACTION.md when the slice changes portable boundaries, composition, hosting adapters or shared contracts; otherwise use the established boundary contract and expand only if a concrete conflict appears. pnpm check includes independent backend compilation. Domain/use-case tests must run without a Next server; API contract tests remain transport-specific. Future Nest host work requires preserved core/storage tests and separate controller/auth/HTTP/cutover verification, not a copied business implementation.

Current owner policy (6 October 2026): implement every eligible task in the Phase 1 execution index consecutively without per-task approval. Historical IAM-03 and ATT-04 human acceptance gates no longer block dependent implementation; PER-02 still requires IAM-03 implementation VERIFIED. Record unperformed reviews as PENDING and never infer acceptance. Implementation-VERIFIED dependencies, technical prerequisites, required test evidence, security decisions and genuinely unavailable access remain gates. Release readiness additionally requires all documented technical gates, including native VoiceOver and NVDA evidence. Do not expand into later phases or report release-ready until all release evidence is complete.
