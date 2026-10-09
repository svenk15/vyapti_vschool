# WF-OP-J17 — Recover from failure or a stale edit

Source workflow: OP-J17. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J17",
  "name": "Recover from failure or a stale edit",
  "entry": "Any protected change",
  "steps": "Keep entered values after failure. Retry transient saves. For conflicts, review current stored values; explicitly reload and reapply edits.",
  "outcome": "No silent overwrite or false success. Unknown onboarding outcome uses the original request reference.",
  "alternate_states": "Save failure, load failure, conflict, record missing, unknown submission and status-check failure.",
  "implementation_contract": "Retry create only with the same idempotency key and payload contract. Expected versions must be checked server-side; UI disabling is not a concurrency control."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
