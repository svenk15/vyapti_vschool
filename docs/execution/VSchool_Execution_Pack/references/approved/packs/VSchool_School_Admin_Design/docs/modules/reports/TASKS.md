# Reports — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-30 — Review and export attendance

**Journey:** SA-30 · **Phase:** 1 · **Depends on:** SA-26

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Reports workspace in an authorized branch and select **Review and export attendance**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A scoped report and bounded export match the underlying session records.
- Exercise the important edge: Unsubmitted data remains missing; revoked access is rechecked at export generation/download.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Rate = (Present + Late) / (Present + Late + Absent); Excused excluded. Zero denominator is unavailable.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-31 — Compare trends and assign follow-up

**Journey:** SA-31 · **Phase:** 2 · **Depends on:** SA-30, new follow-up LLD

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Reports workspace in an authorized branch and select **Compare trends and assign follow-up**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The concern has an owner, due date and source evidence.
- Exercise the important edge: Low sample sizes, partial data and changed permissions limit drilldowns.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Structured follow-up is a proposed extension, not claimed Phase 2 implementation; no punitive automated scoring.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
