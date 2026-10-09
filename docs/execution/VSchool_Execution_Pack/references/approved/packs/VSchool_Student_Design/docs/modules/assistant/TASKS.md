# Learning assistant — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Phase 7 provider/data policy, school assessment-use rules, redaction, evaluations and prompt-injection handling.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-47 — Ask a learning question with sources
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-12; AI application + source owners owner contracts. 
**Deliverable:** Understand permitted learning material.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No autonomous submission, grading, attendance or private learner profiling; untrusted content cannot change permissions.
4. Implement failure/recovery: Missing evidence says unavailable; blocked assessment use offers permitted learning help.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Permission-filtered retrieval + redacted evidence + approved model/provider contract. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Scope to authorized published resources; show what will be used. Then Cite sources, state uncertainty and allow feedback; follow teacher/school assessment policy. Verify: Advisory explanation with source links. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
