# Assessments — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-46 — Coordinate assessment setup and marks readiness

**Journey:** SA-46 · **Phase:** 4 · **Depends on:** SA-11, assessment scheme LLD

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Assessments workspace in an authorized branch and select **Coordinate assessment setup and marks readiness**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The assessment moves only when its defined prerequisites are met.
- Exercise the important edge: Not-entered, absent and exempt are separate; no automatic numeric zero.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** School coordination does not imply permission to edit teachers’ marks.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-47 — Approve, publish or correct results

**Journey:** SA-47 · **Phase:** 4 · **Depends on:** SA-46, publication concurrency design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Assessments workspace in an authorized branch and select **Approve, publish or correct results**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: Published results or a linked correction are available with a timestamp.
- Exercise the important edge: Changed revision requires reapproval; partial delivery does not unpublish the valid result.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Draft edits never leak; approval and publication cannot race past changed marks.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
