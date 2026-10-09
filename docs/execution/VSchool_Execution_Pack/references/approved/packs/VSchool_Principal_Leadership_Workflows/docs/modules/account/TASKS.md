# Account & preferences — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-46 — Manage sessions, preferences and school support
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: Existing Access/session policy and own-account identity.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Access owner revocation/preference/verified-change workflow.
4. Enforce invariant: Own-account management grants no staff-user administration.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Sign out is visually separate from name/role and protects shared-device data.
Recovery acceptance: Unsaved draft: save/discard before leaving; unknown command: preserve safe reference and reconcile. Failed revoke cannot say session ended.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
