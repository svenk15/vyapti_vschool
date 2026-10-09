# My attendance — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Existing attendance granularity, record-version visibility and school query category. STW-26 is an explicit scope extension.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-25 — View my recorded attendance
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Attendance + Requests owner contracts. 
**Deliverable:** See what the school actually recorded.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No parent/staff data; unsubmitted attendance is never absence; avoid unsupported daily aggregates.
4. Implement failure/recovery: Permission change clears records; corrected outcome has traceable published details.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** AttendanceSession + roster member + current authorized mark/revision. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show exact subject/time and Present/Absent/Late/Excused or Awaiting submission. Then Show recorded revision and school-local date. Verify: Accurate self-only record. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-26 — Query an attendance discrepancy
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-25, STW-36; Attendance + Requests owner contracts. Explicit scope allocation required.
**Deliverable:** Ask the school to review an apparent mistake.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Student cannot directly edit attendance or approve absence.
4. Implement failure/recovery: Duplicate open query links existing request; final decision remains school-owned.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Student request + exact AttendanceRecord reference; optional authorized correction link. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Reference a submitted session and give a bounded explanation. Then Show Pending school review and tracking reference. Verify: Owned review request, original record unchanged. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
