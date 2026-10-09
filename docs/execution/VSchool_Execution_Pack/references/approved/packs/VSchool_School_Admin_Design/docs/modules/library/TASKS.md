# Library — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-55 — Catalog and circulate library items

**Journey:** SA-55 · **Phase:** 6 · **Depends on:** SA-18, physical copy / hold policy design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Library workspace in an authorized branch and select **Catalog and circulate library items**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The loan or reservation is recorded with a clear due date.
- Exercise the important edge: Already loaned, hold queue conflict, lost item and duplicate scan have explicit outcomes.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Only one active loan per physical copy; fines are optional Finance integration.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-56 — Resolve overdue, lost or inventory discrepancies

**Journey:** SA-56 · **Phase:** 6 · **Depends on:** SA-55

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Library workspace in an authorized branch and select **Resolve overdue, lost or inventory discrepancies**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The item and borrower record show the reasoned outcome.
- Exercise the important edge: Concurrent return and loss adjustment reconcile under the copy guard.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Loss/recovery preserves circulation history; no automatic guardian billing without the Finance contract.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
