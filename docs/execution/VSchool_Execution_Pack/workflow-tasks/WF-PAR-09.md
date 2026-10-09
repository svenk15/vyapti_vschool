# WF-PAR-09 — Manage school notification preferences

Source workflow: PAR-09. Workspace: VSchool_Parent_Guardian_Design. Source area: home. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-09",
  "area": "home",
  "title": "Manage school notification preferences",
  "phase": 2,
  "purpose": "self preferences by child/purpose",
  "steps": [
    {
      "title": "Choose updates",
      "help": "Preferences do not change the underlying access grant.",
      "fields": [
        {
          "name": "category",
          "label": "Update category",
          "type": "select",
          "options": [
            "School notices",
            "Attendance updates",
            "Learning updates",
            "Payment updates"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Choose channel",
      "help": "Show any school-required service notices separately.",
      "fields": [
        {
          "name": "channel",
          "label": "Preferred channel",
          "type": "select",
          "options": [
            "In-app only",
            "In-app and verified email"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "review",
          "label": "I have reviewed which service notices remain required.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Preferences are saved for the selected permitted category and verified channel.",
  "invariant": "An opt-in is not a guardian grant; an opt-out cannot erase an outstanding request or legal/service notice. No sensitive content in push previews.",
  "recovery": "Unverified contact details cannot receive private updates. Record a delivery failure without marking a notice read.",
  "data": "Preferences keyed by actor, child/purpose/category; Communication resolves verified channels and current recipient grants.",
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
