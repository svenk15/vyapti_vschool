# Documents & forms — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-44 — Collect and review a document

**Journey:** SA-44 · **Phase:** 3 · **Depends on:** document storage / scan / grant LLD

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Documents & forms workspace in an authorized branch and select **Collect and review a document**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The document version and review state are visible to authorized users.
- Exercise the important edge: Interrupted upload resumes or retries safely; expired access links reauthorize.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** No public object URLs; scan failure never becomes a successful upload; expiry and retention follow approved policy.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-45 — Issue a certificate or publish a form

**Journey:** SA-45 · **Phase:** 3 · **Depends on:** SA-44, approved template design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Documents & forms workspace in an authorized branch and select **Issue a certificate or publish a form**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An issued revision has a reference and controlled download.
- Exercise the important edge: Unavailable source data and revoked recipient grants prevent issue/download.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Do not overwrite issued documents; corrections issue a new linked version.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
