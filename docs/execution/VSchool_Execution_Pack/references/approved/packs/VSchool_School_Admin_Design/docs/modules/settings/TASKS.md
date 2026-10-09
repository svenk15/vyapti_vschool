# School settings — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-06 — Edit branch information

**Journey:** SA-06 · **Phase:** 1 · **Depends on:** SA-01

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the School settings workspace in an authorized branch and select **Edit branch information**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: Permitted details are saved with a revision and activity entry.
- Exercise the important edge: A stale edit shows the latest saved values and a comparison; never overwrite automatically.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Time zone Asia/Kolkata is read-only after branch creation. Reject a forged change server-side.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-07 — Review branding and school sign-in

**Journey:** SA-07 · **Phase:** 1 · **Depends on:** SA-01, explicit branding delegation

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the School settings workspace in an authorized branch and select **Review branding and school sign-in**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A delegated publisher can publish; other school administrators can request a branding update.
- Exercise the important edge: Reject unsafe assets, unreadable colors and an already claimed public slug; keep the published revision unchanged.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Branding never changes authorization, status semantics, layout or external redirect destinations.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-08 — Review modules and request a capability

**Journey:** SA-08 · **Phase:** 1 · **Depends on:** SA-01, TEN entitlement contracts

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the School settings workspace in an authorized branch and select **Review modules and request a capability**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The administrator gets a clear handoff to the institution contact.
- Exercise the important edge: Disabling a module retains data and must respect open obligations; request submission alone changes nothing.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Licensed, released, branch-enabled and authorized are four separate checks. No self-service license escalation.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-62 — Review activity, privacy or support access

**Journey:** SA-62 · **Phase:** 1 · **Depends on:** existing append-only safe audit

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the School settings workspace in an authorized branch and select **Review activity, privacy or support access**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A safe branch-scoped event is available for review.
- Exercise the important edge: Restricted events show permitted metadata only; unsupported privacy requests route to the designated authority.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** The administrator cannot delete audit history, grant operator impersonation or run an unrestricted data export.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
