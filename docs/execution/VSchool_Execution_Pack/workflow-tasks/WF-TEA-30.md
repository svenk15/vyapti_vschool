# WF-TEA-30 — Allow resubmission or revise a deadline

Source workflow: TEA-30. Workspace: VSchool_Teacher_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-30",
  "area": "learning",
  "title": "Allow resubmission or revise a deadline",
  "phase": 3,
  "capability": "learning.assignment.manage for own task",
  "entry": "flow/TEA-30",
  "steps": [
    {
      "title": "Change scope",
      "help": "Choose whole class or one authorized learner.",
      "fields": [
        {
          "name": "scope",
          "label": "Scope",
          "type": "select",
          "options": [
            "Whole assigned class",
            "Selected learner"
          ],
          "required": true,
          "value": ""
        },
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
          "name": "due",
          "label": "New deadline",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Explain change",
      "help": "Keep previous deadlines and submissions in history.",
      "fields": [
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "review",
          "label": "I have reviewed who is affected and which version remains visible.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The revised policy and optional resubmission path are explicit to affected learners.",
  "rule": "No silent retrospective penalty changes; preserve already published feedback and submission history.",
  "recovery": "Concurrent publication, offline upload and revoked enrollment reconcile against the pinned policy.",
  "data": "Assignment revision / per-learner exception and SubmissionRevision lineage; authorized notice event.",
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
