# Academics — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-09 — Create an academic year and calendar

**Journey:** SA-09 · **Phase:** 1 · **Depends on:** SA-06

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Academics workspace in an authorized branch and select **Create an academic year and calendar**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A valid year and immutable calendar revision are available.
- Exercise the important edge: A concurrent calendar update requires reload and impact review.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Reject invalid/reversed ranges and incompatible scheduled dates; existing sessions keep their pinned calendar revision.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-10 — Configure grades, sections and subjects

**Journey:** SA-10 · **Phase:** 1 · **Depends on:** SA-09

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Academics workspace in an authorized branch and select **Configure grades, sections and subjects**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The class and subject are available for offering setup.
- Exercise the important edge: An in-use record shows dependency counts and a supported retirement path.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Do not silently merge duplicate names; enforce scoped code constraints.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-11 — Create an offering and assign a teacher

**Journey:** SA-11 · **Phase:** 1 · **Depends on:** SA-10, SA-16

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Academics workspace in an authorized branch and select **Create an offering and assign a teacher**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A dated teaching assignment is saved.
- Exercise the important edge: A teacher becoming ineligible before save rejects the command and retains safe form input.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Identity binding and teacher eligibility are separate from account activation; enforce non-overlap under the documented guard.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-12 — Change calendar or teaching assignment

**Journey:** SA-12 · **Phase:** 1 · **Depends on:** SA-11, SA-25

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Academics workspace in an authorized branch and select **Change calendar or teaching assignment**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A supported future-dated change preserves historical references.
- Exercise the important edge: List conflicting sessions and let the administrator resolve them before retrying.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Block changes affecting frozen/submitted roster history in the first release; substitutions are a later explicit workflow.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
