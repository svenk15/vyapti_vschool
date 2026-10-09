# WF-TEA-32 — Prepare an assessment within an approved scheme

Source workflow: TEA-32. Workspace: VSchool_Teacher_Design. Source area: assessments. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-32",
  "area": "assessments",
  "title": "Prepare an assessment within an approved scheme",
  "phase": 4,
  "capability": "assessment.plan.write for assigned subject",
  "entry": "assessments",
  "steps": [
    {
      "title": "Assessment context",
      "help": "Use the approved scheme version, boundaries and rounding rules.",
      "fields": [
        {
          "name": "class",
          "label": "Assigned class",
          "type": "select",
          "options": [
            "Grade 6 · A · Mathematics",
            "Grade 6 · B · Mathematics",
            "Grade 7 · A · Science"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "name",
          "label": "Assessment name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "scheme",
          "label": "Scheme",
          "type": "select",
          "options": [
            "Approved term scheme · v1"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Assessment details",
      "help": "Make expectations clear before marks entry.",
      "fields": [
        {
          "name": "date",
          "label": "Assessment date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "max",
          "label": "Maximum score",
          "type": "number",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "instructions",
          "label": "Assessment instructions",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A scoped assessment is prepared under a pinned scheme.",
  "rule": "Teachers do not change the institution’s grading policy by editing a screen. Approved publication authority remains separate.",
  "recovery": "Scheme revision, invalid max score, conflicting dates and lost subject assignment require review.",
  "data": "Assessment with SchemeVersion reference; no marks or published result created at plan save.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
