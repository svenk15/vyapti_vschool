# Integrations — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-61 — Review connection status and reconcile a sync

**Journey:** SA-61 · **Phase:** 3 · **Depends on:** integration secret / replay / sync design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Integrations workspace in an authorized branch and select **Review connection status and reconcile a sync**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A scoped synchronization run has reconciled per-record outcomes.
- Exercise the important edge: Unknown provider outcome, duplicate webhook and mapping conflict stay visible.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** No unreviewed source overwrites; authenticated webhooks deduplicate and reauthorize.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
