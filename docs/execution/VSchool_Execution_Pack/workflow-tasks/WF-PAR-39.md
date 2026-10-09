# WF-PAR-39 — Respond to an admission offer

Source workflow: PAR-39. Workspace: VSchool_Parent_Guardian_Design. Source area: admissions. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-39",
  "area": "admissions",
  "title": "Respond to an admission offer",
  "phase": 3,
  "purpose": "intended offer recipient + current version",
  "steps": [
    {
      "title": "Offer",
      "help": "Review the school, intake, conditions and response deadline.",
      "fields": [
        {
          "name": "offer",
          "label": "Offer reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Decision",
      "help": "Acceptance is distinct from enrollment completion.",
      "fields": [
        {
          "name": "decision",
          "label": "Response",
          "type": "select",
          "options": [
            "Accept offer",
            "Decline offer"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "terms",
          "label": "I have reviewed the offer conditions.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The response is recorded and remaining enrollment steps are visible.",
  "invariant": "Offer acceptance cannot independently create a verified guardian relationship, settle a fee or assign a class.",
  "recovery": "Expired/superseded offer, pending payment or missing evidence leads to a precise incomplete state.",
  "data": "Offer/version → response; admission completion orchestrates separate approved enrollment and guardian commands.",
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
