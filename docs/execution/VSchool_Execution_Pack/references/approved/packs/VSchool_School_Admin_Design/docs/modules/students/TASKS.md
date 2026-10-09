# Students — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-18 — Register a student manually

**Journey:** SA-18 · **Phase:** 1 · **Depends on:** SA-01, exact identity selection contract

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Students workspace in an authorized branch and select **Register a student manually**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A Student profile references the deliberately selected organization Person.
- Exercise the important edge: Duplicate/racing admission numbers show the existing permitted record or a conflict; no automatic merge.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Same-institution identity lookup is exact admission number or person ID only; no broad person discovery.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-19 — Enroll and place a student

**Journey:** SA-19 · **Phase:** 1 · **Depends on:** SA-18, SA-10

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Students workspace in an authorized branch and select **Enroll and place a student**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The enrollment and effective placement are saved.
- Exercise the important edge: A conflicting placement or open session is shown with a recovery link.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** One enrollment per student/year and non-overlapping placement intervals; no rewriting frozen rosters.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-20 — Review or update a student record

**Journey:** SA-20 · **Phase:** 1 · **Depends on:** SA-18

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Students workspace in an authorized branch and select **Review or update a student record**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The permitted correction is saved with a reason and revision.
- Exercise the important edge: Concurrent edits show a comparison; a restricted panel is omitted rather than partially leaking its data.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Student 360 panels are separately entitled and authorized; a student view is not authority to edit Fees or Health.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-21 — Move a student to another section

**Journey:** SA-21 · **Phase:** 1 · **Depends on:** SA-19, attendance impact contract

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Students workspace in an authorized branch and select **Move a student to another section**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: Current and new placement intervals remain contiguous and explainable.
- Exercise the important edge: Offer a future valid date when historical attendance conflicts; do not delete and recreate enrollment.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Reject unsupported backdated changes; already frozen/submitted rosters remain unchanged.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-22 — Promote, transfer or leave school

**Journey:** SA-22 · **Phase:** 3 · **Depends on:** SA-19, destination / obligation contracts

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Students workspace in an authorized branch and select **Promote, transfer or leave school**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A dated lifecycle case records the outcome and preserves source history.
- Exercise the important edge: Partial results, destination rejection, changed capacity and duplicate confirmation require recoverable receipts.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Bulk promotion requires preview and per-student results; financial balances do not transfer by moving a student row.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
