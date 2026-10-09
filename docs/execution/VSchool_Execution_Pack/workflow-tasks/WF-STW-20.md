# WF-STW-20 — Request more time

Source workflow: STW-20. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-20",
  "area": "assignments",
  "title": "Request more time",
  "phase": 3,
  "goal": "Ask for an extension without fabricating approval.",
  "steps": [
    {
      "title": "Describe request",
      "instruction": "Choose assignment, requested deadline and brief reason; avoid compulsory sensitive detail."
    },
    {
      "title": "Submit request",
      "instruction": "Show requested, not approved; retain current deadline until an authorized decision."
    }
  ],
  "outcome": "Pending extension request and trackable reference.",
  "invariant": "Student cannot approve own extension; a support request is not an entitlement.",
  "recovery": "Duplicates link existing pending request; unavailable category routes to school help.",
  "data": "Owned request + Assignment reference; authorized extension decision.",
  "extension": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
