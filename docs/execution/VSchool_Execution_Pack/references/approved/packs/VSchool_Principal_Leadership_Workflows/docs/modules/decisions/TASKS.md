# Decisions & approvals — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-27 — Work from a purpose-scoped decision inbox
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Source modules expose an authorized assigned-decision projection.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: None.
4. Enforce invariant: Inbox read grant never authorizes decisions across every source module.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Opening a decision calls its owner policy; unseen types cannot be acted upon.
Recovery acceptance: Source module disabled: no blind approve button. Stale list row: re-read source, do not trust cached action state.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-28 — Request information before deciding
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Current decision assignment and a permitted communication channel.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Source-owner information request and approved message.
4. Enforce invariant: Asking for information does not expand recipient or case permissions.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Waiting for information is not Rejected or Approved.
Recovery acceptance: Reply delivery fails: remains visible; no implied receipt. Request already resolved/reassigned: stale transition rejected.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-29 — Approve, reject or return an assigned item
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Owner exposes current valid actions and consequence preview.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Only the owning module changes business state; receipt/audit atomically recorded.
4. Enforce invariant: No generic approval table may become authority over all modules.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Approved but payment/delivery pending cannot display Completed.
Recovery acceptance: Concurrent decision wins first: show current result; no overwrite. Transport timeout: Check decision status before retry.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-30 — Recuse and route a conflict of interest
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Source-owner separation-of-duty policy and independent eligible escalation role.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Source-owner recusal/reassignment event.
4. Enforce invariant: No self-delegation trick or role switch to bypass separation of duties.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Requester cannot approve own prohibited item through alternate workspace.
Recovery acceptance: No eligible approver: retain pending state and route to designated steward. Complaint is about principal: confidential route avoids sending narrative back to subject.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-31 — Recover an uncertain or outdated decision
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Stable intent, expected version and authorized status use case exist.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Exact replay only; no new effect on duplicate.
4. Enforce invariant: Retry/replay/status endpoints apply the same current owner guard.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Lost response followed by status check returns one original decision.
Recovery acceptance: Stale replica absence is not proof of failure. Permission revoked: safe support reference only, no protected receipt body.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
