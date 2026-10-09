# WF-TEA-31 — Review learning progress and plan support

Source workflow: TEA-31. Workspace: VSchool_Teacher_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-31",
  "area": "learning",
  "title": "Review learning progress and plan support",
  "phase": 3,
  "capability": "learning.progress.read for assigned scope",
  "entry": "learning/progress",
  "steps": [
    {
      "title": "Review evidence",
      "help": "Use visible source tasks and transparent completeness.",
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
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Work completion",
            "Feedback follow-up",
            "Topic evidence"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Plan next action",
      "help": "Support decisions remain human and role-scoped.",
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
          "name": "action",
          "label": "Teaching follow-up",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher can explain a support action from permitted learning evidence.",
  "rule": "No opaque risk scores, permanent labels or inference from missing data. A confidential support case needs a separate grant.",
  "recovery": "Sparse evidence and changed enrollment limit conclusions; never turn unavailable data into poor performance.",
  "data": "Learning read projection of assignments, submissions and returned feedback; proposed support task references sources and minimizes pupil notes.",
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
