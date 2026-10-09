# Assets & facilities — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-57 — Receive, issue or return stock and assets

**Journey:** SA-57 · **Phase:** 6 · **Depends on:** stock and custody ledger LLD

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Assets & facilities workspace in an authorized branch and select **Receive, issue or return stock and assets**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An append-only movement and current custody state are available.
- Exercise the important edge: Concurrent issue or missing custody acknowledgement leaves a reviewable exception.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** No negative stock unless explicitly approved by a versioned policy; cross-branch transfer requires both scopes.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-58 — Book a facility or request maintenance

**Journey:** SA-58 · **Phase:** 6 · **Depends on:** room overlap and maintenance design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Assets & facilities workspace in an authorized branch and select **Book a facility or request maintenance**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A conflict-free booking or owned maintenance order is recorded.
- Exercise the important edge: Concurrent booking or changed maintenance status shows alternatives instead of double-booking.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Enforce overlapping reservation constraints and clear unavailable periods.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
