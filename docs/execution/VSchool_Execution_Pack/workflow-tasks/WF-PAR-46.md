# WF-PAR-46 — Submit a care or emergency-contact update

Source workflow: PAR-46. Workspace: VSchool_Parent_Guardian_Design. Source area: wellbeing. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-46",
  "area": "wellbeing",
  "title": "Submit a care or emergency-contact update",
  "phase": 6,
  "purpose": "restricted care.update_request for authorized guardian",
  "steps": [
    {
      "title": "Update category",
      "help": "Send sensitive details only through the school’s restricted process.",
      "fields": [
        {
          "name": "category",
          "label": "Category",
          "type": "select",
          "options": [
            "Emergency contact needs review",
            "Care information needs updating"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reference",
          "label": "Private school verification reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Handoff",
      "help": "A general portal request does not confirm that staff have reviewed urgent information.",
      "fields": [
        {
          "name": "ack",
          "label": "I will use the school’s official urgent-contact process if immediate action is needed.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A restricted update request reaches the designated school team.",
  "invariant": "No clinical/custody narrative in general audit, notification or teacher views. Updating a contact does not grant pickup or portal access.",
  "recovery": "Unavailable restricted channel provides official contact instructions; never promise emergency monitoring.",
  "data": "RestrictedCareRequest pointer and private owner record; safe receipt and narrow recipient ACL.",
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
