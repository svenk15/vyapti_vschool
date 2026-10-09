# Daily & weekly review — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-05 — Review my school today
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: Branch-scoped source projections are authorized; school date/time and data freshness known.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: None.
4. Enforce invariant: Home projection inherits each source capability; aggregated cards do not create drill-down authority.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Every number has a definition and opens the same scoped record set.
Recovery acceptance: No items: show No action required for this scope, plus data cutoff. Missing module: omit its widget; do not show zero or an upsell.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-06 — Recognize stale, incomplete or unavailable information
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: Freshness and completeness are available as separate metadata.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: None apart from bounded refresh telemetry.
4. Enforce invariant: Do not expose withheld cases through error counts or hidden-widget totals.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Unavailable source does not appear as 0; approval cannot consume stale expected version.
Recovery acceptance: Partial source failure: show available sections with explicit gaps. Stale evidence for mutation: block and re-review before decision.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-07 — Run the weekly leadership review
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Scope extension must be allocated before coding.
Prerequisites: Approved meeting purpose and source access; follow-up coordination enabled for actions.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Internal follow-up records and approved meeting action references only.
4. Enforce invariant: A meeting participant does not gain the principal’s source privileges.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Next review distinguishes open, overdue, evidence-ready and verified closed actions.
Recovery acceptance: No reliable comparison period: omit trend claim. Action falls outside participants’ authority: hand off instead of exposing private records.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
