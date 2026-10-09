# Access & leadership context — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-01 — Enter the correct leadership workspace
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: Active account, leadership assignment and at least one explicit branch grant; required foundations released.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Existing session/context selection only; no role creation.
4. Enforce invariant: Principal role is not a wildcard. Protected reads and mutations reauthorize independently.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Unrelated branch, school-slug forgery and revoked role cannot open the workspace.
Recovery acceptance: No leadership grant: show permitted workspace choices, not a broken dashboard. Session expiry: clear protected content and return through sign-in.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-02 — Switch branches without losing context
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: Destination branch grant exists; any pending command has been reconciled.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Existing context-selection/session state only.
4. Enforce invariant: Cross-branch aggregate authority is separate from branch switching.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: A stale selection is rejected; no old branch record flashes or leaks.
Recovery acceptance: Destination grant revoked while chooser is open: remain in old authorized context. Different timezone: date is recalculated in destination school timezone.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-03 — Work under a temporary leadership delegation
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Scope extension must be allocated before coding.
Prerequisites: School-approved delegation policy, eligible delegate and bounded grant management authority.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Delegation through Access owner, safe audit, approved recipient notification if enabled.
4. Enforce invariant: Grant issuance and delegated operation are different capabilities; originator identity remains visible.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Delegate cannot approve outside scope or after expiry; existing receipts remain attributable.
Recovery acceptance: Self-delegation or privilege expansion: deny. Pending work outlives delegation: route to currently authorized owner.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-04 — Handle access changes during a leadership action
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: All protected operations and receipt lookups use current server authorization.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Only safe audit of denial; no protected record mutation.
4. Enforce invariant: Apply to reads, downloads, exports, retries and exact replay, not only navigation.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: A command checked after revocation is denied; denied page does not disclose private details.
Recovery acceptance: Outcome of a previous command is unknown: keep a non-sensitive reference, not the hidden item details. Disabled module does not erase owner records or obligations.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
