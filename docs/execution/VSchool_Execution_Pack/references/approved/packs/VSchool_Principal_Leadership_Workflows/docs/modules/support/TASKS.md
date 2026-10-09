# Restricted student support — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-37 — Refer a concern to an authorized specialist
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 6. Owner release and exact capability contract must exist.
Prerequisites: School-defined referral channel and purpose grant; designated specialist service enabled.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Specialist referral and safe status evidence.
4. Enforce invariant: Referral capability does not grant case-read or health-record access.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: No detailed health/support narrative appears in school-wide dashboard or analytics.
Recovery acceptance: Specialist channel unavailable: school-approved contact route shown. Principal lacks case access after referral: status-only projection if permitted.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-38 — Follow the school’s urgent safety escalation procedure
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 6. Scope extension must be allocated before coding.
Prerequisites: Approved school procedure, authorized emergency roles and actual contact configuration.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Restricted handoff/event only under incident owner.
4. Enforce invariant: No default break-glass, diagnosis or confidential case visibility.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: The portal never claims it has provided emergency assistance merely because a form was saved.
Recovery acceptance: No configured procedure: show school contact gap, do not invent emergency policy. Complaint implicates a leader: use designated independent channel.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
