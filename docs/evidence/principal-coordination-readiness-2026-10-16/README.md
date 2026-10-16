# Principal Coordination owner readiness — 16 October 2026

This checkpoint reconciles LEA-09, LEA-11 and LEA-15 after completing every currently supported Principal aggregate export. It is design evidence, not implementation or human acceptance.

## Established contract

- The Principal can read the exact branch-scoped Attendance session through the already verified `attendance.read_leadership` owner boundary.
- Leadership may create or route a Coordination request only after that owner and its capabilities exist.
- Attendance remains the sole owner of session correction/cancellation and rechecks its own live authority and lifecycle invariants.
- A submitted/frozen record cannot be deleted or rewritten to clear a Leadership exception. Historical report snapshots and exports retain their recorded definition/as-of semantics.

## Blocking decisions

1. Shared Coordination owner versus an Attendance-specific setup-review request. Recommendation: one shared Coordination owner with typed source references, while source owners retain all operational mutations.
2. Separate create, assign, verify, reject and reopen capabilities and their explicit branch-role mappings.
3. Eligible assignee source and reassignment authority.
4. Active-request uniqueness, bounded concern/note and due-time rules.
5. Evidence rules for verified resolution of missing-register and setup-review requests.

No source, schema, migration, permission or seed changed. `pnpm check:docs` is the only required validation for this documentation-only checkpoint. Human review is PENDING.
