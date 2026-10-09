# WF-PAR-40 — Review transport assignment

Source workflow: PAR-40. Workspace: VSchool_Parent_Guardian_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-40",
  "area": "services",
  "title": "Review transport assignment",
  "phase": 6,
  "purpose": "transport.read_child",
  "steps": [
    {
      "title": "Route assignment",
      "help": "Only the child’s active route and stop are visible.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Assigned route and stop",
            "Service dates and school contact"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Service question",
      "help": "A request does not change the transport route.",
      "fields": [
        {
          "name": "next",
          "label": "Next action",
          "type": "select",
          "options": [
            "Read current assignment",
            "Request a stop or service change"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent knows the currently assigned route and how to request a change.",
  "invariant": "No full passenger list, unrelated stops, driver private contact or other child location.",
  "recovery": "Unassigned/suspended service, route change and service disruption are distinct.",
  "data": "TransportAssignment/effective dates → Route/Stop minimal projection; transport owner decides capacity and change.",
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
