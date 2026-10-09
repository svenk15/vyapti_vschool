# WF-PAR-41 — Request an authorized pickup change

Source workflow: PAR-41. Workspace: VSchool_Parent_Guardian_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-41",
  "area": "services",
  "title": "Request an authorized pickup change",
  "phase": 6,
  "purpose": "pickup.request + child-specific authority (proposed)",
  "steps": [
    {
      "title": "Pickup request",
      "help": "The school verifies temporary collection authority.",
      "fields": [
        {
          "name": "date",
          "label": "Pickup date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "collector",
          "label": "Proposed collector name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "reference",
          "label": "School-approved verification reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Confirm request",
      "help": "This is not an immediate gate pass.",
      "fields": [
        {
          "name": "confirm",
          "label": "I understand that school verification and approval are required.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A pending pickup request has a dated approval/decline outcome.",
  "invariant": "No reusable public QR credential or unverified household delegation. Emergency contacts are not automatically authorized collectors.",
  "recovery": "Cutoff, revocation, conflicting requests and identity failure require school resolution; follow local emergency procedures.",
  "data": "Proposed PickupRequest/dated authorization with restricted evidence; operational handover logs actual authorized collection.",
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
