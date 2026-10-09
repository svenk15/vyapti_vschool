# Financial & service oversight — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-43 — Review financial exceptions under a separate grant
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 5. Owner release and exact capability contract must exist.
Prerequisites: Finance module released; explicit aggregate/detail/approval grants; finance policies independently designed.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Finance owner decision only if explicitly delegated.
4. Enforce invariant: No automatic refunds, fee editing, payroll access or financial hardship disclosure.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: A principal cannot approve a refund merely because it appears in an inbox.
Recovery acceptance: Unreconciled data is labelled; no false collection total. Requester/self-approver conflict routes independently.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-44 — Coordinate a school service interruption
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 6. Owner release and exact capability contract must exist.
Prerequisites: Specific service released, operational oversight grant and current incident owner.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Service-owner coordination action and approved notice.
4. Enforce invariant: Operational service summary does not expose passenger addresses, driver private data or full case records.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Restored service does not automatically mark all recipients informed.
Recovery acceptance: No telemetry: do not invent live vehicle location. Restricted safety/health content routes separately.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
