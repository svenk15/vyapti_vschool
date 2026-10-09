# Feedback & progress — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Teacher return/revoke/version lifecycle; resubmission policy separate from feedback publication.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-22 — Read returned teacher feedback
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-15; Learning owner contracts. 
**Deliverable:** Understand feedback tied to my work.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Private notes, draft marks and unreleased comments never enter student DTOs.
4. Implement failure/recovery: Feedback withdrawn/revised is reauthorized; show latest published revision and prior release policy.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Returned FeedbackPublication + attempt + student-visible rubric. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show attempt number and returned time, student-facing comments and released rubric. Then Revise if allowed or ask a permitted clarification. Verify: Actionable feedback with appropriate next action. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-23 — Understand criteria and subject progress
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-22; Learning owner contracts. 
**Deliverable:** See evidence of learning without misleading averages.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Zero, Not assessed, Absent and Exempt remain different; no denominator inventing.
4. Implement failure/recovery: No released evidence gets a useful empty state.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Published criteria + released outcome projections; no private gradebook. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Explain score/outcome, maximum and published assessment scale. Then Link to returned tasks and published report items. Verify: Transparent evidence, not a synthetic rank. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-24 — Ask about feedback
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-22, STW-29; Learning owner contracts. 
**Deliverable:** Ask the responsible teacher a focused question.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No arbitrary staff/peer recipient search or guardian impersonation.
4. Implement failure/recovery: If messaging is unavailable, route to a school-owned request.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Conversation grant + feedback reference + message receipt. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Carry exact task/attempt reference into a permitted conversation. Then Review recipient and text; only accepted delivery state is reported. Verify: Scoped question receipt. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
