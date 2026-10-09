# Imports — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-23 — Preview a roster import

**Journey:** SA-23 · **Phase:** 1 · **Depends on:** SA-19, import schema and upload contract

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Imports workspace in an authorized branch and select **Preview a roster import**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A preview is available; no student records are written.
- Exercise the important edge: Invalid encoding/header/size fails clearly; schema error gives the correct template; no silent truncation.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** No guardian columns in the Phase 1 roster contract; no raw rows, file bytes or hashes in audit.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-24 — Confirm, resume and reconcile an import

**Journey:** SA-24 · **Phase:** 1 · **Depends on:** SA-23

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Imports workspace in an authorized branch and select **Confirm, resume and reconcile an import**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: Each row reports created, unchanged, failed or remaining with durable receipts.
- Exercise the important edge: Stale previews require re-preview; lost responses query receipts before retry; avoid replaying successes.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Create-only plus exact no-change re-import in Phase 1; corrections and transfers use explicit workflows.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
