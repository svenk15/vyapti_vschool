# Staff & access — proposed vertical slices

No task is automatically eligible solely because its UX appears here. Reconcile current repository evidence and dependencies first. Preserve existing task IDs; SA-IMPL labels below are cross-reference candidates.

## SA-IMPL-13 — Create a staff profile

**Journey:** SA-13 · **Phase:** 1 · **Depends on:** SA-01

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Staff & access workspace in an authorized branch and select **Create a staff profile**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: An organization Person and branch Employee profile are linked deliberately.
- Exercise the important edge: Exact identity candidates need an explicit review; duplicate employee codes are rejected.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Email/name matches are not proof of identity or authority to merge people.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-14 — Grant staff sign-in access

**Journey:** SA-14 · **Phase:** 1 · **Depends on:** SA-13, existing identity acceptance gates

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Staff & access workspace in an authorized branch and select **Grant staff sign-in access**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: A pending membership/grant is created and the permitted activation path is shown.
- Exercise the important edge: A failed delivery is visible to the authorized manager; resend revokes the old token.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Preserve operator-issued IAM paths; invite email does not prove employee identity. Last-admin safeguards remain.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-15 — Review invitation or resend access

**Journey:** SA-15 · **Phase:** 1 · **Depends on:** SA-14

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Staff & access workspace in an authorized branch and select **Review invitation or resend access**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The new invitation attempt has an expiry and an honest delivery outcome.
- Exercise the important edge: Policy tightened, account blocked or expired grant explains why resend is unavailable.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Do not activate on send, silently retry in a worker, expose tokens or reuse a failed token.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-16 — Verify a staff identity and teacher eligibility

**Journey:** SA-16 · **Phase:** 1 · **Depends on:** SA-14, explicit IAM-03 acceptance where documented

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Staff & access workspace in an authorized branch and select **Verify a staff identity and teacher eligibility**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The teacher can be selected for dated assignments when all requirements are met.
- Exercise the important edge: Changing eligibility lists affected assignments; a conflicting effective date is blocked.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** No auto-binding by email equality; explicit IAM-03 acceptance gates in the actual repository must be preserved.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.

## SA-IMPL-17 — Change or revoke staff access

**Journey:** SA-17 · **Phase:** 1 · **Depends on:** SA-14

1. Reconcile current route/use case/permission/database/test coverage. Reuse verified behavior; record missing contracts before coding.
2. Update the owning DESIGN.md with actual schema/joins, request/response, sequence, transaction and the journey-specific invariants. Then update TASKS.md.
3. Implement the complete user slice with shared shell/components and owner use cases; include empty/error/stale/denied paths.
4. Extend existing synthetic seed data incrementally and idempotently. No teardown scope is added.
5. Run focused unit/PostgreSQL/Playwright checks proportional to the change. Compare real desktop/mobile page output with the reference.
6. Record evidence and bring up the demo; keep human review pending and continue only eligible work.

**Demo script**

- Open the Staff & access workspace in an authorized branch and select **Change or revoke staff access**.
- Complete the defined steps, inspect the confirmation, then perform the action once.
- Verify: The next protected request rechecks the changed grant.
- Exercise the important edge: Concurrent revocations serialize; insufficient replacement/admin coverage blocks the action.
- Repeat with a denied/changed scope and confirm no other branch or confidential data is exposed.

**Acceptance invariant:** Do not disable a global identity for a local branch action; prevent removal of the last active administrator.

**Evidence:** build/commit, exact seed command, tests and result, screenshots at desktop/mobile, server URL, demo accounts reference, remaining limits.
