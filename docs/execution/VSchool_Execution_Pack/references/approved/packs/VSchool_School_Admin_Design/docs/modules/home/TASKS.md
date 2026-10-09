# Today — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-01 — Sign in and choose a branch

**Journey:** SA-01 · **Phase:** 1 · **Depends on:** existing verified Access + Tenancy context

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Today workspace in an authorized branch and select **Sign in and choose a branch**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The administrator lands on Today in the chosen branch.
- Exercise the important edge: Invalid credentials use a generic message; suspended access shows a support route, never another branch’s data.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Recheck institution, branch, membership and module state; return URLs must be allowlisted.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-02 — Activate or recover an account

**Journey:** SA-02 · **Phase:** 1 · **Depends on:** existing IAM-02/03/04 contracts

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Today workspace in an authorized branch and select **Activate or recover an account**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A generic acknowledgement and permitted recovery instructions are shown.
- Exercise the important edge: Expired, revoked, failed-delivery and previously consumed tokens cannot be accepted; resend rotates the token.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Email resets must satisfy every active institution membership at issue and consume time; operator recovery remains supported.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-03 — Switch branch or sign out

**Journey:** SA-03 · **Phase:** 1 · **Depends on:** SA-01

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Today workspace in an authorized branch and select **Switch branch or sign out**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: New context is resolved on the server, or the session is signed out.
- Exercise the important edge: If the target grant was revoked, keep the old context if still authorized and show a safe explanation.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Clear scoped caches and protected drafts; reauthorize the destination and never reuse the previous branch’s data.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-04 — Complete first-use setup

**Journey:** SA-04 · **Phase:** 1 · **Depends on:** SA-01, module readiness contracts

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Today workspace in an authorized branch and select **Complete first-use setup**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The next incomplete dependency opens in its owning module.
- Exercise the important edge: Show blocked dependencies with a route to the responsible role; a hidden module is never a missing step.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Setup completion is derived from authoritative data; adding Fees later must not invalidate Attendance readiness.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-05 — Resolve a daily exception

**Journey:** SA-05 · **Phase:** 1 · **Depends on:** SA-26, SA-24, SA-15

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Today workspace in an authorized branch and select **Resolve a daily exception**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The source record opens with its branch and status intact.
- Exercise the important edge: An already resolved or revoked item refreshes safely and explains why it is no longer actionable.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Never turn a pending register into an absence; the dashboard is a read model.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
