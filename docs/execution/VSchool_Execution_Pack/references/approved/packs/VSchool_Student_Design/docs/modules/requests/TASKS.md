# Requests & support — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Allowed categories and recipient teams; response expectations, retention and support contact supplied by school.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-36 — Create a school support request
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Requests + Students owner contracts. 
**Deliverable:** Ask school for non-emergency help.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No claim of continuous emergency monitoring; show school emergency contact when configured.
4. Implement failure/recovery: Unknown submission checks same intent; validation preserves input.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Owned request + category routing + command receipt. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show only student-allowed categories and expected school response window if configured. Then State visible recipient team and submit bounded text. Verify: Pending request reference. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-37 — Track or withdraw my request
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-36; Requests + Students owner contracts. 
**Deliverable:** Know what happens next.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Internal staff notes and other requesters remain private.
4. Implement failure/recovery: Concurrent resolution blocks outdated withdrawal; reload current version.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Request + public timeline projection + optimistic version. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** View student-visible status history and requested follow-up. Then Reply or withdraw only in permitted state with expected version. Verify: Current status and next action. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-38 — Request a profile correction
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-36; Requests + Students owner contracts. 
**Deliverable:** Correct an official record through school review.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No student self-edit of identity, guardian links, enrollment, roles or grants.
4. Implement failure/recovery: Duplicate/stale source values require current review.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Student profile projection + proposed change request; owner-only update. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Display existing permitted field and proposed correction. Then Explain school approval is required; contact verification follows Access policy. Verify: Pending correction, official data unchanged. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
