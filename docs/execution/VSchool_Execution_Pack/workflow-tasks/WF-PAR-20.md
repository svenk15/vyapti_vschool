# WF-PAR-20 — Review published homework

Source workflow: PAR-20. Workspace: VSchool_Parent_Guardian_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-20",
  "area": "learning",
  "title": "Review published homework",
  "phase": 3,
  "purpose": "learning.read_child",
  "steps": [
    {
      "title": "Assignment",
      "help": "Read the teacher’s published task and deadline.",
      "fields": [
        {
          "name": "task",
          "label": "Assignment",
          "type": "select",
          "options": [
            "Fractions in everyday life",
            "Reading reflection"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Support the child",
      "help": "The student remains the author of submitted work.",
      "fields": [
        {
          "name": "next",
          "label": "Next action",
          "type": "select",
          "options": [
            "Read instructions",
            "Review submission status",
            "Ask an allowed learning question"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The guardian understands the task, deadline and current learner submission state.",
  "invariant": "No submit-as-child or mark-as-complete shortcut unless a separately approved assisted-submission policy exists. Draft tasks are private.",
  "recovery": "Missing and late are distinct; no submission is not proof of non-learning. Reauthorize attachments.",
  "data": "Published Assignment/version → child audience/enrollment → minimal SubmissionStatus, with no unrelated classmates.",
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
