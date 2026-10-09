# Attendance — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-25 — Schedule attendance sessions

**Journey:** SA-25 · **Phase:** 1 · **Depends on:** SA-11, SA-19

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Attendance workspace in an authorized branch and select **Schedule attendance sessions**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The session appears in the assigned teacher’s teaching day.
- Exercise the important edge: Calendar conflict or teacher change explains the exact blocked interval.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Reject overlapping scheduled sessions for the same primary teacher; roster freezes only when the session opens.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-26 — Monitor and inspect attendance

**Journey:** SA-26 · **Phase:** 1 · **Depends on:** SA-25, teacher submission implementation

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Attendance workspace in an authorized branch and select **Monitor and inspect attendance**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The exact session and its submission evidence are shown.
- Exercise the important edge: Cancelled and unsubmitted sessions are distinct from absent pupils; missing denominator displays unavailable.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** School admin is not granted attendance.mark by default; link to assigned teacher, never impersonate them.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-27 — Correct submitted attendance

**Journey:** SA-27 · **Phase:** 1 · **Depends on:** SA-26

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Attendance workspace in an authorized branch and select **Correct submitted attendance**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A new correction revision appears with actor, reason and time.
- Exercise the important edge: Another editor’s correction shows a conflict and comparison; unknown result uses the same request receipt.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Only submitted attendance is correctable; compare the expected revision in the same authorized transaction.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-28 — Cancel or review a session change

**Journey:** SA-28 · **Phase:** 1 · **Depends on:** SA-25

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Attendance workspace in an authorized branch and select **Cancel or review a session change**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A supported cancellation records its reason and preserved history.
- Exercise the important edge: Changed session state may block cancellation; refresh the current record before retry.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Do not silently reschedule an open/submitted session; use the supported state transition contract.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-29 — Review an absence explanation

**Journey:** SA-29 · **Phase:** 2 · **Depends on:** SA-32, SA-26, SA-35

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Attendance workspace in an authorized branch and select **Review an absence explanation**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The family receives a permitted disposition; attendance changes only through correction.
- Exercise the important edge: Late submission, duplicate explanation and revoked guardian access have separate outcomes.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Recheck guardian relationship at request/read/delivery; do not expose restricted notes.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
