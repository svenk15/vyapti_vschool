# Staff coordination — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-23 — Review staffing availability without private reasons
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 3. Owner release and exact capability contract must exist.
Prerequisites: People/timetable availability projection; purpose-specific leadership grant.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Optional cover request only.
4. Enforce invariant: Availability oversight is not full HR-record access.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Private leave reason cannot appear in a list, export or notification.
Recovery acceptance: Missing availability data shown Unknown. A staff member working another branch is not presumed free.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-24 — Approve temporary cover when delegated
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 3. Owner release and exact capability contract must exist.
Prerequisites: Delegated cover approval; verified teacher eligibility and time overlap checks.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Timetable owner command and audit.
4. Enforce invariant: Approver cannot create teacher identity or bypass eligibility.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Expired cover grants no continued marking authority.
Recovery acceptance: Teacher becomes ineligible before commit: deny. Teacher/date overlap: reject rather than double-book.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-25 — Decide an assigned staff request
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 6. Owner release and exact capability contract must exist.
Prerequisites: Request type is released; principal explicitly assigned and permitted.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: People/service request decision only.
4. Enforce invariant: No blanket HR, salary or medical authority.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Same inbox cannot approve a type the principal is not delegated for.
Recovery acceptance: Principal is requester or has a prohibited conflict: route to independent approver. Approval does not automatically update payroll or timetable.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-26 — Hand over open work when leadership changes
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Scope extension must be allocated before coding.
Prerequisites: Authorized handover coordinator; recipient grants verified independently.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Versioned ownership events; separate Access delegation revoke.
4. Enforce invariant: Reassignment cannot transfer private source access by implication.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Old owner cannot act after revocation; new owner cannot read unrelated confidential material.
Recovery acceptance: New owner lacks authority: item fails/awaits qualified owner. Unknown transfer result: reconcile, do not duplicate.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
