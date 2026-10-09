# People operations — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-53 — Review leave and staffing coverage

**Journey:** SA-53 · **Phase:** 6 · **Depends on:** SA-13, leave ledger / coverage design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the People operations workspace in an authorized branch and select **Review leave and staffing coverage**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The leave balance and coverage decisions are recorded separately.
- Exercise the important edge: Insufficient balance or changed approver authority blocks approval.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Pupil attendance and staff attendance are different domains; serialize concurrent leave debits.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-54 — Review payroll inputs and hand off

**Journey:** SA-54 · **Phase:** 6 · **Depends on:** SA-53, restricted payroll rules and review

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the People operations workspace in an authorized branch and select **Review payroll inputs and hand off**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: Authorized payroll review proceeds with immutable approved run history.
- Exercise the important edge: Rule change, missing input or revoked approval stops the run; corrections create a new linked revision.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** A School Administrator role grants no salary access; no payroll formula is assumed in this design.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
