# Messages & notices — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Student notice audiences and direct staff conversations approved; message retention/reporting/delivery-failure contract.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-27 — Read a school notice
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Communication owner contracts. 
**Deliverable:** Read updates intended for my enrollment.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Read does not mean acknowledged or consented.
4. Implement failure/recovery: Retracted notice becomes unavailable with safe context.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Published notice version + audience membership + file asset. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show title, sender, audience-safe description and publication time. Then Reauthorize attachments; show deadlines/actions explicitly. Verify: Published notice read. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-28 — Acknowledge a notice
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-27; Communication owner contracts. 
**Deliverable:** Explicitly confirm the exact notice version was read.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Acknowledgement never supplies guardian consent or event permission.
4. Implement failure/recovery: Revised notice may need fresh acknowledgement; stale version prompts review.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** NoticeAcknowledgement unique recipient/notice_version. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show what acknowledgement means. Then Commit one response per student and notice version. Verify: Timestamped acknowledgement. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-29 — Message a permitted teacher
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Communication owner contracts. 
**Deliverable:** Communicate within the school-approved channel.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No open peer messaging or access to classmates; block/report route is school-owned.
4. Implement failure/recovery: Participant revocation clears thread; unresolved sends are checked before retry.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** ConversationGrant + participant + Message + DeliveryAttempt. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Use explicit assignment/enrollment-specific participant grant. Then Review bounded text and safe attachments; clear pending/sent state. Verify: Accepted message reference. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-30 — Recover a message delivery problem
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-29; Communication owner contracts. 
**Deliverable:** Know whether a message was accepted or failed.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Browser success is not staff read confirmation.
4. Implement failure/recovery: Show contact/help for persistent failure without exposing provider details.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Message command receipt + delivery attempt safe status. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Distinguish accepted by school, pending and definitive failure. Then Check same intent first; resend only after known failure under current grant. Verify: Single traceable message. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
