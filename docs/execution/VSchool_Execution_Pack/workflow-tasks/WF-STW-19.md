# WF-STW-19 — Withdraw a submission when allowed

Source workflow: STW-19. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-19",
  "area": "assignments",
  "title": "Withdraw a submission when allowed",
  "phase": 3,
  "goal": "Correct an accidental submission through a controlled transition.",
  "steps": [
    {
      "title": "Review eligibility",
      "instruction": "Show withdraw only when policy permits and review has not locked it."
    },
    {
      "title": "Confirm withdrawal",
      "instruction": "Recheck expected attempt version; retain evidence and explicitly offer a new draft."
    }
  ],
  "outcome": "Withdrawn attempt with audit trail.",
  "invariant": "Withdrawal does not delete evidence, reset original accepted time or silently reopen a deadline.",
  "recovery": "If teacher review began concurrently, deny withdrawal and offer a teacher query.",
  "data": "Attempt lifecycle/version + teacher review lock + withdrawal event.",
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
