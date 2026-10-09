# Health & safeguarding — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-59 — Refer a health or safeguarding concern

**Journey:** SA-59 · **Phase:** 6 · **Depends on:** restricted referral and escalation design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Health & safeguarding workspace in an authorized branch and select **Refer a health or safeguarding concern**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An authorized specialist receives a minimal referral; general admins see only permitted handoff status.
- Exercise the important edge: If the recipient lacks authority, route privately to the approved escalation contact; never broadcast.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** No diagnosis or clinical advice in the general school workspace; emergency action follows the approved local protocol.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-60 — Review emergency access and restricted case handling

**Journey:** SA-60 · **Phase:** 6 · **Depends on:** SA-59, emergency authority and independent review

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Health & safeguarding workspace in an authorized branch and select **Review emergency access and restricted case handling**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: Authorized emergency access has an expiry, audit and independent review.
- Exercise the important edge: Denied or expired emergency authority must not reveal case contents.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** No blanket administrator access; this workflow requires a separate sensitive-data design and deployment approval.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
