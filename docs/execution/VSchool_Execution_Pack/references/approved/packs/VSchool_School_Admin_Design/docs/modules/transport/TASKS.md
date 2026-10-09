# Transport — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-51 — Prepare routes and allocate students

**Journey:** SA-51 · **Phase:** 6 · **Depends on:** SA-18, transport qualification / capacity design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Transport workspace in an authorized branch and select **Prepare routes and allocate students**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A dated allocation contributes to the next trip manifest.
- Exercise the important edge: Full vehicle, expired qualification or unavailable stop blocks the allocation.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Transport consent, pickup authority and guardian portal grant are separate.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-52 — Resolve a trip or handoff exception

**Journey:** SA-52 · **Phase:** 6 · **Depends on:** SA-51, handoff / offline contingency design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Transport workspace in an authorized branch and select **Resolve a trip or handoff exception**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An accountable trip exception is recorded and escalated where needed.
- Exercise the important edge: Disconnected device or uncertain event preserves pending status and uses the approved human fallback.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Never confirm an unverified handoff; minimize live location exposure.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
