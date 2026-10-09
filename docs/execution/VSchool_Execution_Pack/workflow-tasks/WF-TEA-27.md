# WF-TEA-27 — Create and publish an assignment

Source workflow: TEA-27. Workspace: VSchool_Teacher_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-27",
  "area": "learning",
  "title": "Create and publish an assignment",
  "phase": 3,
  "capability": "learning.assignment.write / publish for own class",
  "entry": "learning/new",
  "steps": [
    {
      "title": "Task",
      "help": "State what the learner should do and how it will be reviewed.",
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
          "name": "title",
          "label": "Assignment title",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "instructions",
          "label": "Instructions",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Submission",
      "help": "Use explicit deadline and accepted mode.",
      "fields": [
        {
          "name": "due",
          "label": "Due date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "mode",
          "label": "Submission type",
          "type": "select",
          "options": [
            "Text response",
            "File upload",
            "In-class work"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "late",
          "label": "Late work",
          "type": "select",
          "options": [
            "Accept and label late",
            "Require teacher review"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Publication review",
      "help": "Check audience, resources, accessibility and due date before publishing.",
      "fields": [
        {
          "name": "publish",
          "label": "I have reviewed the class-facing task.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The exact published assignment version is visible to the eligible class.",
  "rule": "Publication requires current assignment and enrollment grants. Do not confuse Save draft with Publish.",
  "recovery": "Changed deadline publishes a reviewed revision and notice; unknown publish outcome uses a receipt.",
  "data": "Learning Assignment/Version and audience criteria; durable publication manifest/event; Communication notice is separate from published content.",
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
