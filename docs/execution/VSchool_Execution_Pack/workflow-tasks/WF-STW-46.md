# WF-STW-46 — Get help with privacy or accessibility

Source workflow: STW-46. Workspace: VSchool_Student_Design. Source area: account. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-46",
  "area": "account",
  "title": "Get help with privacy or accessibility",
  "phase": 2,
  "goal": "Find clear help without collecting unnecessary detail.",
  "steps": [
    {
      "title": "Choose help",
      "instruction": "Offer accessibility issue, account help or privacy enquiry."
    },
    {
      "title": "Send request",
      "instruction": "Show school contact/recipient and explicit pending response."
    }
  ],
  "outcome": "Help reference or direct contact route.",
  "invariant": "No invented deletion promise, statutory deadline or automatic disclosure to another account.",
  "recovery": "Failed delivery remains visible; alternative contact shown when configured.",
  "data": "School support configuration + minimum request metadata.",
  "extension": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
