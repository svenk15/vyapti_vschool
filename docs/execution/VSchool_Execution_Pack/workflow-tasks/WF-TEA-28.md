# WF-TEA-28 — Review submissions and late work

Source workflow: TEA-28. Workspace: VSchool_Teacher_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-28",
  "area": "learning",
  "title": "Review submissions and late work",
  "phase": 3,
  "capability": "learning.submission.read for assigned class",
  "entry": "learning/task/l1",
  "steps": [
    {
      "title": "Worklist",
      "help": "Submitted, missing, late and returned are separate states.",
      "fields": [
        {
          "name": "task",
          "label": "Assignment",
          "type": "select",
          "options": [
            "Fractions in everyday life"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "filter",
          "label": "Submission status",
          "type": "select",
          "options": [
            "All",
            "Submitted",
            "Late",
            "Missing",
            "Returned"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review work",
      "help": "Open only the current authorized submission revision.",
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
          "name": "next",
          "label": "Review action",
          "type": "select",
          "options": [
            "Read submitted work",
            "Request missing work follow-up"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher can act on each learner’s actual submission state.",
  "rule": "Missing is not a numeric zero. Submission revisions and late policy are pinned; never leak one pupil’s work to another.",
  "recovery": "Interrupted upload, withdrawn enrollment, missing file and malware rejection have distinct explanations.",
  "data": "Learning SubmissionRevision + published Assignment version + enrollment grant; Documents enforces file readiness and download scope.",
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
