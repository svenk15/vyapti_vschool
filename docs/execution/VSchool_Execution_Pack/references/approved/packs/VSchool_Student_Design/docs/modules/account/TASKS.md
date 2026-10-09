# Account & preferences — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Existing account reauthentication/recovery/session conventions; school required notice and accessibility/privacy support policy.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-44 — Manage my sessions
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-01; Access + Preferences owner contracts. 
**Deliverable:** Protect my school account on shared devices.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Keep sign out separate from identity block; server revocation is authoritative.
4. Implement failure/recovery: Already-revoked is idempotent; failed revoke must not say completed.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Access session + audit + revocation command. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show only own session labels/time; no secrets or raw device identifiers. Then Reauthenticate when required; clear local protected state. Verify: Selected sessions revoked or current session ended. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-45 — Set preferences or request contact change
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-44; Access + Preferences owner contracts. 
**Deliverable:** Adjust communication/accessibility choices safely.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No guardian link changes; required security notices cannot be silently disabled.
4. Implement failure/recovery: Invalid/failed save keeps prior preferences and announces failure.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Account preference + school policy; verified-change request. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Readable text, notification categories and shared-device preference; required school notices labelled. Then Preferences save directly; identity/contact changes require school/access verification. Verify: Saved preference or pending verified-change request. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-46 — Get help with privacy or accessibility
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-36; Access + Preferences owner contracts. 
**Deliverable:** Find clear help without collecting unnecessary detail.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No invented deletion promise, statutory deadline or automatic disclosure to another account.
4. Implement failure/recovery: Failed delivery remains visible; alternative contact shown when configured.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** School support configuration + minimum request metadata. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Offer accessibility issue, account help or privacy enquiry. Then Show school contact/recipient and explicit pending response. Verify: Help reference or direct contact route. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
