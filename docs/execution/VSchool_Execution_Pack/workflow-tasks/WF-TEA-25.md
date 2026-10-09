# WF-TEA-25 — Plan a lesson

Source workflow: TEA-25. Workspace: VSchool_Teacher_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-25",
  "area": "learning",
  "title": "Plan a lesson",
  "phase": 3,
  "capability": "learning.plan.write for assigned offering",
  "entry": "learning",
  "steps": [
    {
      "title": "Teaching context",
      "help": "Prepare against a class, topic and date.",
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
          "name": "topic",
          "label": "Lesson topic",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "date",
          "label": "Lesson date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Plan",
      "help": "Use clear objectives, activities and a check for understanding.",
      "fields": [
        {
          "name": "objective",
          "label": "Learning objective",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "activities",
          "label": "Activities",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "check",
          "label": "Check for understanding",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Visibility",
      "help": "Drafts stay private to authorized teaching staff.",
      "fields": [
        {
          "name": "visibility",
          "label": "Save as",
          "type": "select",
          "options": [
            "Teacher draft",
            "Share with authorized teaching team"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A versioned lesson plan can be revisited and reused with deliberate context changes.",
  "rule": "Copying a plan must not copy pupil responses or private notes. Lesson plan is not automatic publication to families.",
  "recovery": "Concurrent edits preserve current revision; lost assignment removes protected content.",
  "data": "Learning owns LessonPlan/revision referencing authorized Offering and safe ResourceReferences.",
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
