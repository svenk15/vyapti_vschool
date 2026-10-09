# Families — implementation slices

Edition 02. These are **proposed subtasks under existing SA journeys**, not a replacement release queue. Actual repository status is NOT_ASSESSED. Reconcile with the live task index before assigning work; never duplicate completed work or bypass IAM/TEN-03 gates. Parent handoff tasks map to the existing Parent owner.

Each task must update DESIGN before TASKS before code, add relevant fictional seed data, and leave a checkpoint in CURRENT_STATE. No teardown scope is added. Use TypeScript’s existing unit runner (not JUnit) and the existing PostgreSQL functional database (not HBase).

## SA-IMPL-32.A — Reconcile the family owner contracts

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** Existing Access/Students/Tenancy and actual acceptance gates.

**Build:** Map physical vs_ schema, verified Person/Account binding, branch scope, purpose rules, recovery-policy coverage and current table/RLS obligations. Freeze DTOs/transactions before code.

**Demo:** Authorized verifier sees the exact branch student; unrelated school scope fails.

**Verify:** Capability/domain tests, real-DB scoped joins and constraints; retain actual gate evidence.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

## SA-IMPL-32.B — Approve a verified relationship and inactive grant

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** SA-IMPL-32.A.

**Build:** Build shared three-step form, explicit purpose, inclusive-date conversion, draft/resume, duplicate intent and safe receipt. Approval does not send or activate.

**Demo:** Approve Diya / Priya; review Ready to invite; parent access is still absent.

**Verify:** Dates, duplicate/version, branch draft isolation; atomic real-PostgreSQL relationship/grant/audit/receipt tests.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

## SA-IMPL-33.A — Issue and recover an invitation

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** SA-IMPL-32.B and Access invitation support.

**Build:** Respect current trust modes; reviewed recipient; commit issuance before send; persist delivery failure; explicit resend replaces old token.

**Demo:** Send → delivery failed → resend; old invite cannot be consumed.

**Verify:** Adapter result tests, token hash/expiry/intent real-DB tests, focused admin browser journey.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

## SA-IMPL-33.B — Complete the intended-parent handoff

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** SA-IMPL-33.A; reconcile PAR-01/04.

**Build:** Reuse Access authentication and atomic acceptance. Recheck identity, trust, purpose, versions, restrictions and dates under the shared lock order.

**Demo:** Intended parent accepts once; wrong account, expired, failed, replaced and revoked invites fail.

**Verify:** Real-DB accept/revoke/policy/version races; browser handoff and generic public errors.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

## SA-IMPL-33.C — Show exact-child attendance

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** SA-IMPL-33.B and existing Attendance read contract; PAR-05/06.

**Build:** Compose My children from current grants. Join exact frozen roster and permitted attendance revision/date window. Server rechecks on all reads/downloads.

**Demo:** Parent sees only accepted children; Awaiting teacher submission is never Absent.

**Verify:** Cross-child/branch/org tests, direct URL, cache clearing, attendance correction reflected on refresh.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

## SA-IMPL-34.A — Revise or end child-specific access

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** SA-IMPL-33.B/C.

**Build:** Build distinct date revision, portal removal and school relationship end. Preserve sibling grants/history; require reason/reference, expected version and fresh acceptance where dates change. Include verified renewal for expired/future grants.

**Demo:** Revise dates → invite again; remove one child → old URL denied; other child stays; relationship end is separate.

**Verify:** Date boundary tests, accept-vs-change races, token invalidation and delivery suppression; desktop/mobile consequences.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

## SA-IMPL-37.A — Review a missing-access request

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** SA-IMPL-32.A and existing SA-37 Requests owner.

**Build:** Reuse the access-help category of SA-37. Authenticated minimal issue/ref, generic receipt, dedup/rate limits, scoped review. Start school verification separately with no inferred child.

**Demo:** Parent requests help; school queue shows claim; Start verification opens blank adult/child fields.

**Verify:** Originator/reviewer privacy, duplicate request, help→review E2E.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

## SA-FAMILY-VERIFY — Join the demo and evidence

**Status:** PROPOSED; production implementation NOT_ASSESSED.

**Dependencies:** All slices above and real repository gates.

**Build:** Extend pnpm demo:seed incrementally with fictional independent grants and invite states. Use owner adapters, not production bypasses. Run selected integration gate and record exact source evidence.

**Demo:** One command prepares demo. Verify → invite → accept → attendance → date change/revoke, while other admin workflows continue.

**Verify:** Unit + real PostgreSQL + focused E2E + visual/keyboard; native assistive technology and human review kept explicit.

**Checkpoint:** source commit, actual routes/use cases, migration names, seed command/account reference, tests/results, desktop/mobile evidence, pending limits, human review and next eligible task. Bring up the real demo only after its source is built and verified.

<!-- EDITION03 -->
## Edition 03 — coordinated prerequisite for Communication
Map SA-IMPL-35.A to the existing family purpose/acceptance task. Implement explicit notice-purpose approval, acceptance and independent revocation; preserve existing attendance grants and active sessions. No broad migration may add notice access simply because a family has attendance. Extend fictional seeds deliberately; test attendance-only exclusion and same-child distinct purpose revocation.
