# Results & reports — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Assessment moderation/publication/revocation; scale/zero/exempt representation; export authorization.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-33 — View my published report
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Assessments + Documents owner contracts. 
**Deliverable:** Read official released results.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No unreleased marks, moderation, peer ranks or misleading zero for Exempt.
4. Implement failure/recovery: Publication withdrawal and access change reauthorize on every open.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** AssessmentReport publication + student results + scale version. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** List permitted academic year/term versions. Then Show subject, score/outcome, scale and teacher comments released to students. Verify: Own published report view. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-34 — Download a published report
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-33; Assessments + Documents owner contracts. 
**Deliverable:** Keep an authorized report copy.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: A UI link is not file authorization; never export another student.
4. Implement failure/recovery: Unavailable/expired document offers recheck, not permanent public URL.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Document render reference + publication version + authorized asset. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show school, term, version and issued date. Then Reauthorize at file request; expire download link. Verify: Exact released report version. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-35 — Ask about a result
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-33, STW-36; Assessments + Documents owner contracts. 
**Deliverable:** Request clarification within school policy.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Student cannot edit a grade or reopen moderation.
4. Implement failure/recovery: If formal review window closed, show policy and school-help path.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Owned request + report item version + owner decision. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Carry term, subject and report version. Then Explain issue; route to authorized assessment owner. Verify: Query reference with school response state. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
