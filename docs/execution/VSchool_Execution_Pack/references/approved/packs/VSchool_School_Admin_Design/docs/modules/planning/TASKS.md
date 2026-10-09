<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For SA-41, SA-42, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Timetable & learning — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-41 — Build and publish a timetable

**Journey:** SA-41 · **Phase:** 3 · **Depends on:** SA-11, room / recurrence design

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Timetable & learning workspace in an authorized branch and select **Build and publish a timetable**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A published timetable version drives idempotent future session generation.
- Exercise the important edge: Clash races and repeated generation cannot produce double sessions.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Existing open/submitted attendance stays pinned; recurring plan is not the Phase 1 manual-session contract.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-42 — Arrange cover or a timetable exception

**Journey:** SA-42 · **Phase:** 3 · **Depends on:** SA-41

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Timetable & learning workspace in an authorized branch and select **Arrange cover or a timetable exception**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The supported substitution is visible to the affected staff.
- Exercise the important edge: Unavailable cover or an already opened session invokes the defined review path.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Never use shared logins; do not replace historical assignment attribution.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-43 — Review learning readiness and follow-up

**Journey:** SA-43 · **Phase:** 3 · **Depends on:** learning module LLD

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Timetable & learning workspace in an authorized branch and select **Review learning readiness and follow-up**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An authorized follow-up points to the owning learning record.
- Exercise the important edge: Revoked enrollment or assignment restricts content; attachments remain private and scanned.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Do not reveal draft feedback to guardians or auto-score missing work as zero.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
