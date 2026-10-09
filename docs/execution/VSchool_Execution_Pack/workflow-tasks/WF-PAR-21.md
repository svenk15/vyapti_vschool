# WF-PAR-21 — Read returned learning feedback

Source workflow: PAR-21. Workspace: VSchool_Parent_Guardian_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-21",
  "area": "learning",
  "title": "Read returned learning feedback",
  "phase": 3,
  "purpose": "feedback.read_child purpose + returned version",
  "steps": [
    {
      "title": "Returned feedback",
      "help": "Only feedback intentionally returned to the permitted audience appears.",
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
        }
      ]
    },
    {
      "title": "Support next steps",
      "help": "Separate the teacher’s feedback from automated interpretation.",
      "fields": [
        {
          "name": "next",
          "label": "Next action",
          "type": "select",
          "options": [
            "Review strengths and next steps",
            "Ask a learning question"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent sees the returned revision and can support its next step.",
  "invariant": "Private draft feedback, moderation notes and unrelated student work never appear.",
  "recovery": "Withdrawn/replaced feedback identifies the permitted current version; authorization applies to historical versions too.",
  "data": "FeedbackRevision returned state + guardian learning purpose + submission/task references.",
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
