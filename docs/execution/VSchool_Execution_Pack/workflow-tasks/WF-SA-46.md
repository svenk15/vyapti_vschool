# WF-SA-46 — Coordinate assessment setup and marks readiness

Source workflow: SA-46. Workspace: VSchool_School_Admin_Design. Source area: assessments. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-46",
  "module": "assessments",
  "title": "Coordinate assessment setup and marks readiness",
  "phase": 4,
  "capability": "assessment.coordinate",
  "steps": [
    {
      "title": "Assessment plan",
      "help": "Choose versioned grading and rounding rules.",
      "fields": [
        {
          "name": "assessment",
          "label": "Assessment",
          "type": "select",
          "options": [
            "Term 1 · 2026–27"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "section",
          "label": "Class",
          "type": "select",
          "options": [
            "Grade 6 · A",
            "Grade 6 · B",
            "Grade 7 · A"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "scheme",
          "label": "Scheme",
          "type": "select",
          "options": [
            "Approved term scheme"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Readiness",
      "help": "Review missing marks, absent and exempt states independently.",
      "fields": [
        {
          "name": "action",
          "label": "Next action",
          "type": "select",
          "options": [
            "Open readiness list",
            "Request teacher completion",
            "Send for moderation"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The assessment moves only when its defined prerequisites are met.",
  "rule": "School coordination does not imply permission to edit teachers’ marks.",
  "edge": "Not-entered, absent and exempt are separate; no automatic numeric zero.",
  "data": "Assessment scheme/version and read model of MarkRevision/Moderation; owner use cases enforce role-specific actions."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
