<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For STW-07, STW-08, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# My day & classes — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Published timetable owner and dated assignment membership; no assumption that Phase 1 manual sessions are a timetable engine.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-06 — Plan my school day
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04, STW-10; Academics owner contracts. 
**Deliverable:** Know the next class and the next deliberate action.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No engagement score, anxiety countdown, class rank or fabricated completion percentage.
4. Implement failure/recovery: Empty timetable and nothing-due states remain useful; display last successful refresh.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Published ScheduleOccurrence + student Assignment projections + returned Feedback. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show school-local date, next class and a short prioritized list of due work. Then Go directly to published class details, assignment, returned feedback or notice. Verify: Student reaches one clear next task. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-07 — Read my timetable
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Academics owner contracts. 
**Deliverable:** Understand the published week.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Manual attendance sessions do not imply a recurring timetable engine.
4. Implement failure/recovery: Cancelled, room-changed and not-yet-published are explicit states.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Academic enrollment, offering, published timetable revision and occurrence. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Browse days in school timezone and show current published version. Then Read subject, period, room and permitted teacher name. Verify: Exact occurrence details. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-08 — Respond to a changed class
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-07; Academics owner contracts. 
**Deliverable:** Notice a schedule change without confusing it with attendance.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: A cancellation never manufactures an attendance outcome.
4. Implement failure/recovery: Stale links resolve current published version or a safe cancelled state.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Schedule revision + occurrence + scoped communication update. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show old/new room or time with effective date and published notice. Then Navigate to the current occurrence; do not silently open cancelled links. Verify: Current class context with visible change. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-09 — Open an assigned class space
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-07, STW-10; Academics owner contracts. 
**Deliverable:** Find course-specific work and resources.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No class roster, classmates’ marks, guardian contacts or private teacher notes.
4. Implement failure/recovery: Ended enrollment follows explicit historical-access policy; default deny new downloads.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Offering + dated Enrollment/AssignmentAudience; minimized student projection. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show only current assigned offerings, grouped by subject. Then Open published work, permitted resources and returned feedback. Verify: Own course material only. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
