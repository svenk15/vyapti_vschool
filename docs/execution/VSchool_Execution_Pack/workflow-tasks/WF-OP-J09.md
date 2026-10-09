# WF-OP-J09 — Reactivate an institution

Source workflow: OP-J09. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J09",
  "name": "Reactivate an institution",
  "entry": "Inactive institution → Review reactivation",
  "steps": "Review remaining restrictions, provide a reason and confirm.",
  "outcome": "Institution becomes Active. Individually inactive branches, revoked memberships, setup requirements and license restrictions remain.",
  "alternate_states": "Changed prerequisites, conflicting operator action and failed save.",
  "implementation_contract": "Do not mass-enable branches, users or modules. Re-evaluate effective availability; no data restoration is needed because deactivation did not delete it."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
