# WF-OP-J10 — Manage branches

Source workflow: OP-J10. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J10",
  "name": "Manage branches",
  "entry": "Institution → Branches",
  "steps": "Add or edit branch configuration. Review readiness. Deactivate/reactivate one branch with a reason.",
  "outcome": "New branch has no implicit school-record grants, requires setup and starts with Attendance inactive. Changes affect only that branch.",
  "alternate_states": "Duplicate code, inactive institution, last/only active branch notice, invalid time zone, stale update and failure.",
  "implementation_contract": "Choose a supported time zone at branch creation. Existing branch time zones are read-only; reject changed values in the application use case, even if the client is modified. A future exceptional migration requires separate impact analysis and authorization. Last-branch deactivation can leave the institution Active but with no available school workspace; show that consequence."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
