# Admissions — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-38 — Capture inquiry and start an application

**Journey:** SA-38 · **Phase:** 3 · **Depends on:** admission cycle and application LLD

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Admissions workspace in an authorized branch and select **Capture inquiry and start an application**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An application has a reference, checklist and next action.
- Exercise the important edge: Duplicate candidate suggests deliberate review; do not auto-merge applicants or existing pupils.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Admission must work without Fees; collect only information needed for the current stage.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-39 — Review application and make a decision

**Journey:** SA-39 · **Phase:** 3 · **Depends on:** SA-38, capacity / decision authority

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Admissions workspace in an authorized branch and select **Review application and make a decision**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The decision revision and next action are recorded.
- Exercise the important edge: Last-seat conflicts and expired decision authority require refreshed capacity and delegation.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Seat reservation and offer expiry must be atomic; subjective notes remain restricted.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-40 — Accept an offer and enroll once

**Journey:** SA-40 · **Phase:** 3 · **Depends on:** SA-39, SA-19

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Admissions workspace in an authorized branch and select **Accept an offer and enroll once**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: One student conversion receipt links the application to enrollment.
- Exercise the important edge: Invalid capacity, changed acceptance or incomplete identity evidence pauses conversion safely.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** A repeated request returns the same conversion; do not create duplicate students or automatic guardian grants.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
