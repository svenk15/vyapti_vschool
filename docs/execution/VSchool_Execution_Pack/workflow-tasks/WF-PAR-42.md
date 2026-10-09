# WF-PAR-42 — Read transport service updates

Source workflow: PAR-42. Workspace: VSchool_Parent_Guardian_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-42",
  "area": "services",
  "title": "Read transport service updates",
  "phase": 6,
  "purpose": "transport update audience for assigned child",
  "steps": [
    {
      "title": "Service update",
      "help": "Read only the assigned service and current freshness.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "School-issued delay notice",
            "Authorized boarding status"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next action",
      "help": "Unknown or stale status is not a safety guarantee.",
      "fields": [
        {
          "name": "next",
          "label": "Next action",
          "type": "select",
          "options": [
            "Refresh status",
            "Use the school’s official transport contact"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent sees a time-stamped, source-labelled service update.",
  "invariant": "Live vehicle location is a separate approved capability, not assumed here. No precise other-child location or full vehicle movement history.",
  "recovery": "Provider outage, stale event or missing boarding confirmation shows Unknown with a school contact.",
  "data": "Transport event/audience read model with event time, received time and retention/freshness contract.",
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
