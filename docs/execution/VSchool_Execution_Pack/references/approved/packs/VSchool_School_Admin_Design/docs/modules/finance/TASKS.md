# Fees & payments — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-48 — Configure fees and concessions

**Journey:** SA-48 · **Phase:** 5 · **Depends on:** finance LLD + explicit approval authority

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Fees & payments workspace in an authorized branch and select **Configure fees and concessions**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An approved plan revision can be used to generate invoice snapshots.
- Exercise the important edge: In-use fee plans version forward; negative/invalid money and unsupported currency are rejected.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** General school administrators have coordination access only unless explicitly granted finance authority.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-49 — Generate invoices and collect payment

**Journey:** SA-49 · **Phase:** 5 · **Depends on:** SA-48, payment verification / idempotency design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Fees & payments workspace in an authorized branch and select **Generate invoices and collect payment**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: Posted invoice, verified payment and receipt retain separate states.
- Exercise the important edge: Unknown outcomes are reconciled before retrying; partial payment leaves an explicit balance.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** A browser success return is not proof of payment; callbacks authenticate and deduplicate.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-50 — Resolve reconciliation, adjustment or refund

**Journey:** SA-50 · **Phase:** 5 · **Depends on:** SA-49, refund reservation and reconciliation design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Fees & payments workspace in an authorized branch and select **Resolve reconciliation, adjustment or refund**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An authorized adjustment or reconciled outcome appends to the ledger.
- Exercise the important edge: Timeout, duplicate callback, insufficient refundable balance and rejected approval have explicit outcomes.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Do not edit posted amounts or double-refund an uncertain provider request.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
