# WF-PAR-12 — Track or withdraw an explanation

Source workflow: PAR-12. Workspace: VSchool_Parent_Guardian_Design. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-12",
  "area": "attendance",
  "title": "Track or withdraw an explanation",
  "phase": 2,
  "purpose": "own explanation read/withdraw with current child grant",
  "steps": [
    {
      "title": "Request status",
      "help": "Pending, reviewed and withdrawn have different meaning.",
      "fields": [
        {
          "name": "reference",
          "label": "Explanation reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next action",
      "help": "The school’s disposition is not automatically an attendance correction.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Read the school’s response",
            "Withdraw a pending explanation"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent sees a traceable request status or withdrawal outcome.",
  "invariant": "Only an eligible pending request can be withdrawn; use its current version. Never delete the evidence of a reviewed decision.",
  "recovery": "Concurrent school review wins by version; show the new state and safe next action.",
  "data": "Explanation version/status and owner decision reference; append safe audit event, not destructive deletion.",
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
