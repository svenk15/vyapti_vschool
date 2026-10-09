# WF-PAR-11 — Submit an absence explanation

Source workflow: PAR-11. Workspace: VSchool_Parent_Guardian_Design. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-11",
  "area": "attendance",
  "title": "Submit an absence explanation",
  "phase": 2,
  "purpose": "attendance.explanation.submit for selected child",
  "steps": [
    {
      "title": "Absence details",
      "help": "This is an explanation for school review, not an attendance mark.",
      "fields": [
        {
          "name": "from",
          "label": "From date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "Until date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Reason category",
          "type": "select",
          "options": [
            "Health-related absence",
            "Family commitment",
            "School-approved activity",
            "Other"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "School note",
      "help": "Share only what the office needs; use restricted channels for sensitive evidence.",
      "fields": [
        {
          "name": "note",
          "label": "Brief explanation",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "confirm",
          "label": "I understand that the school reviews this explanation separately from attendance.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The explanation receives a reference and Pending review status; attendance remains unchanged.",
  "invariant": "Same-day date ranges are valid. Live grant and date/policy bounds apply at submit; duplicate intent is idempotent. No automatic Excused status.",
  "recovery": "Failed save preserves draft. Lost response checks the same request reference. Sensitive documents need the separately approved upload route.",
  "data": "FamilyRequest/AbsenceExplanation references child and dates; Attendance is read-only here. School disposition/correction is a separate owner command.",
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
