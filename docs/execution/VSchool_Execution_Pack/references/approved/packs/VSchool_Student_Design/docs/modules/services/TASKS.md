# School services — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Each service independently released and entitled; STW-41/43 approved separately. Specialist physical schema and LLD required before coding those commands.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-39 — Review my library loans
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Library / Activities / Transport / Support owner contracts. 
**Deliverable:** Know what is borrowed and when it is due.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No other borrower history; fines if shown are read-only service data, not payer authority.
4. Implement failure/recovery: Unreturned/corrected records use library-help path.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** LibraryLoan + item catalogue + own borrower mapping. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show own current loans, due dates and service policy. Then View return instructions and permitted renewal action. Verify: Own circulation record. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-40 — Request a library renewal
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-39; Library / Activities / Transport / Support owner contracts. 
**Deliverable:** Ask for more borrowing time.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Student cannot set loan due date.
4. Implement failure/recovery: Concurrent return/hold blocks stale renewal and preserves history.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** LibraryLoan version + hold policy + renewal decision. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show eligibility, hold/renewal limits and proposed due date from library. Then Recheck current loan/holds; show approved only if owner confirms. Verify: Confirmed renewal or pending/denied response. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-41 — Join an enabled activity
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-31; Library / Activities / Transport / Support owner contracts. Explicit scope allocation required.
**Deliverable:** Explore eligible activities and request a place.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Interest is separate from guardian consent, payment and attendance.
4. Implement failure/recovery: Full activity offers waitlist only if enabled; changed schedule requires new review.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** ActivityOffer + registration + allocation + Consent reference. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show schedule, eligibility, places and any required guardian consent. Then Record interest; confirm only after allocation and required approvals. Verify: Requested/waitlisted/confirmed state from owner. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-42 — Read my transport assignment
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Library / Activities / Transport / Support owner contracts. 
**Deliverable:** Know my assigned service and published updates.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No driver private data, other pupils, live location promise or self-changing pickup authority.
4. Implement failure/recovery: Unassigned/unavailable service routes to school; urgent change uses official contact.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** TransportAssignment + published service update; no location stream. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show assigned route/stop and school contact. Then Show published delay/cancellation text with time and source. Verify: Current assigned service guidance. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-43 — Request student wellbeing support
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-36; Library / Activities / Transport / Support owner contracts. Explicit scope allocation required.
**Deliverable:** Ask the authorized school team for support.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No automated diagnosis, risk score, covert parent disclosure or full health-record access.
4. Implement failure/recovery: Unavailable channel clearly routes to school contact; do not imply 24/7 monitoring.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Restricted support request + purpose grants + student-safe timeline. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show who receives the request and school contact for urgent help. Then Allow a brief description without compulsory health details; no confidentiality guarantee. Verify: Restricted request receipt. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
