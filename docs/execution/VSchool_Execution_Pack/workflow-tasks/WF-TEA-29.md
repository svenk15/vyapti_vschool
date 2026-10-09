# WF-TEA-29 — Draft feedback and return work

Source workflow: TEA-29. Workspace: VSchool_Teacher_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-29",
  "area": "learning",
  "title": "Draft feedback and return work",
  "phase": 3,
  "capability": "learning.feedback.write / return for own task",
  "entry": "learning/review/s1",
  "steps": [
    {
      "title": "Feedback",
      "help": "Give actionable guidance on the selected work.",
      "fields": [
        {
          "name": "student",
          "label": "Student in assigned class",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "strength",
          "label": "What worked well",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "nextStep",
          "label": "Next step for learning",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Return review",
      "help": "Preview exactly what the learner and permitted guardian will see.",
      "fields": [
        {
          "name": "decision",
          "label": "Action",
          "type": "select",
          "options": [
            "Save private feedback draft",
            "Return reviewed feedback"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "review",
          "label": "I have checked the audience and selected work revision.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A private draft remains private; returned feedback identifies its published revision.",
  "rule": "Saving feedback is not result publication or automatic assessment grading. Family visibility needs separate purpose and module grants.",
  "recovery": "Submission changed while grading requires comparison; missing authority stops publication.",
  "data": "Learning Feedback revision pins SubmissionRevision; explicit return manifest + safe audit/outbox; no unintended result-table writes.",
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
