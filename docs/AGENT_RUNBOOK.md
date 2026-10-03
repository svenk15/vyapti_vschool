# Agent execution and handoff

## Task lifecycle

Implementation: NOT_STARTED → IN_PROGRESS → VERIFIED. BLOCKED is allowed with reason and safe next action. VERIFIED means the task's automated gates and stable demo passed, not that a human accepted it. Human review: NOT_REQUESTED → PENDING → PASSED or FAILED. FND-01 starts IMPLEMENTED for the prepared scaffold, with local verification/acceptance still needed; this is not a product acceptance.

At resume, read module CURRENT_STATE tables and the latest evidence. `pnpm next-task` prioritizes FAILED human reviews, then IN_PROGRESS, then dependencies satisfied by VERIFIED + PASSED/PENDING. It is a suggestion only: an explicit pause or release gate controls execution. FND-01 must be locally VERIFIED before IAM-01 starts. Never mark a design or task document as implementation evidence.

## One task loop

1. Inspect Git branch/status and latest checkpoint; no automatic stash/reset. Read task and owning design/ADRs. Identify migrations and touched modules.
2. Set current task IN_PROGRESS with branch, start time, intended acceptance and unresolved risks.
3. Implement the full user-visible slice: domain, use case/ports, adapters/schema, delivery layer and meaningful tests. Use a migration for database changes; no untracked db push.
4. Run check plus relevant functional/E2E and production build. Include two schools and forbidden identities for protected flows. Record exact outputs and limitations.
5. Review the diff; checkpoint intended source/docs only. Record the source commit under test. If a subsequent docs-only commit records evidence, identify both commits; don't invent a self-referential SHA.
6. Start a local demo on port 3400 (`pnpm dev`, or build then `pnpm start`). Inspect health and the served route. Keep a separate terminal/session alive; never claim the user's Mac server was started from a remote session.
7. Give URL, task ID, source commit, setup/credentials procedure, 3–5 manual steps and expected results. Mark review PENDING. Keep the demo stable while review is pending; use a new port/checkout if continuing would change the build under review.
8. Update the module CURRENT_STATE evidence and next task. Per the owner policy of 4 October 2026, continue immediately with the next eligible complete slice while review is PENDING; wait only for an explicit acceptance dependency or a blocking decision/access/destructive action/unresolvable verification failure. Human FAILED blocks dependent work until repair; PASSED applies only to explicit feedback on the reviewed source. Changes invalidating accepted behavior need another review. Batch independent reads/searches; do not repeat unchanged checks unless a release gate requires them.

## Evidence record to append to module CURRENT_STATE.md

Task, implementation status, human status; source commit/dirty fingerprint; changed paths; migrations applied and database label (no URL); test commands/exits/report paths; demo URL/start/health check/build identity; manual script; known limitations; exact next action. Keep historical entries; update the current status table in place.

## Timeboxes

No start/freeze/deadline is bundled. After FND-01 and scope confirmation, the user may authorize a 24-hour first implementation timebox. Record UTC start, UTC freeze at +19h, UTC stop at +24h and Asia/Kolkata display values in platform CURRENT_STATE. Pauses do not silently extend it. At freeze, finish a safe checkpoint and validate/demo; at stop, preserve state and report completed/blocked/pending. A timebox may end before the entire Phase 1 scope is finished. Do not cut integrity/security tests to claim completion.

## Adding a module

Use docs/templates. Give the module a phase, ownership and public contracts; extend the Bible module/phase index and change log; create detailed DESIGN/TASKS/CURRENT_STATE files; add dependencies to EXECUTION_INDEX; run check:docs. No empty placeholder can be READY. A later module may be planned without its schema being finalized.

## Pilot release and recovery

FND-02 requires a release checklist backed by evidence: migrations from empty and previous checkpoint DB; protected-route/tenant tests; real account provisioning and identity-verified recovery; DB snapshot before release; restore into a new isolated database and reconciliation of counts; TLS/secrets and rate controls; production health/log redaction; pilot privacy/retention decision; operator troubleshooting and rollback plan. Application rollback is permitted only if schema remains compatible. Otherwise roll forward; restore to a new target before routing traffic. Never apply a Git revert as a database rollback.

PostgreSQL backup/restore commands for the chosen deployment belong in the FND-02 evidence runbook after target/operator verification. No production backup is claimed by the starter. The pilot must define who takes backups, how often, retention, restore ownership and acceptable recovery objectives before real data is admitted.

## Portable backend gate

Before every module task, read BACKEND_EXTRACTION.md and enforce the backend/shared/Next adapter boundaries. pnpm check includes independent backend compilation. Domain/use-case tests must run without a Next server; API contract tests remain transport-specific. Future Nest host work requires preserved core/storage tests and separate controller/auth/HTTP/cutover verification, not a copied business implementation.
