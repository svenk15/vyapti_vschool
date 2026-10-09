# Calendar & events — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Calendar publication; STW-32 event-interest extension approved; capacity and consent policy.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-31 — Review published events and assessments
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-07; Calendar + Event owner owner contracts. 
**Deliverable:** Plan around the school schedule.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Draft assessment schedules remain hidden; published changes are visible.
4. Implement failure/recovery: Cancelled events are labelled and no longer accept interest actions.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** CalendarEvent publication + audience + assessment schedule projection. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show school-local dates, permitted event details and assessment schedule. Then Read changes, venue, participation requirements and contact. Verify: Clear upcoming event context. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-32 — Express event interest
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-31; Calendar + Event owner owner contracts. Explicit scope allocation required.
**Deliverable:** Tell school about interest without bypassing consent.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Student interest is not guardian consent, fee payment or confirmed allocation.
4. Implement failure/recovery: Capacity and eligibility are rechecked; waitlist never says confirmed.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** EventInterest + eligibility rule; service-owned allocation and separate ConsentRequest. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show capacity/age/class rules and whether guardian permission is required. Then Record student interest and explicitly show Pending guardian/school approval where required. Verify: Interest/withdrawal receipt. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
