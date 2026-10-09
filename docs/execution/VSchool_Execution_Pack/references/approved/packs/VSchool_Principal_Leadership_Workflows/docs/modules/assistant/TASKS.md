# Reviewed leadership assistance — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-45 — Review a source-linked leadership draft
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 7. Owner release and exact capability contract must exist.
Prerequisites: Approved AI provider/data policy, source access and evaluation gates.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Approved draft/evaluation metadata; no consequential automatic write.
4. Enforce invariant: Principal role does not widen AI retrieval; output is not a new authority source.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: A model-generated suggested approval cannot call the owner approval command.
Recovery acceptance: Missing/contradictory evidence: say uncertain, do not invent a policy or causal explanation. Untrusted source text cannot alter permissions or tool instructions.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
