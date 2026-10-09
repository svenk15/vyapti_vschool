# WF-PAR-45 — Manage an enabled meal preference

Source workflow: PAR-45. Workspace: VSchool_Parent_Guardian_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-45",
  "area": "services",
  "title": "Manage an enabled meal preference",
  "phase": 6,
  "purpose": "meal.preference for child (proposed)",
  "steps": [
    {
      "title": "Meal service",
      "help": "This optional service appears only when offered by the school.",
      "fields": [
        {
          "name": "preference",
          "label": "School-offered choice",
          "type": "select",
          "options": [
            "Standard school meal",
            "School-approved alternative"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Confirm",
      "help": "Health-related restrictions use the verified care workflow.",
      "fields": [
        {
          "name": "confirm",
          "label": "I understand that this preference does not update medical records.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A dated service preference is submitted under the school’s cutoff policy.",
  "invariant": "This is a scope extension, not a current Bible guarantee. No diagnosis, allergen safety promise or automatic billing adjustment from a preference.",
  "recovery": "Cutoff passed, service unavailable or required care verification shows a safe next step.",
  "data": "Proposed MealPreference/version/effective date; Health and Finance own their separate approved effects.",
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
