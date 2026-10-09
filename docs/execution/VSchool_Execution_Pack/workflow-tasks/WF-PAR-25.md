# WF-PAR-25 — Request a result clarification

Source workflow: PAR-25. Workspace: VSchool_Parent_Guardian_Design. Source area: results. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-25",
  "area": "results",
  "title": "Request a result clarification",
  "phase": 4,
  "purpose": "published results read + permitted query",
  "steps": [
    {
      "title": "Result context",
      "help": "A clarification does not change a published mark.",
      "fields": [
        {
          "name": "report",
          "label": "Report reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "subject",
          "label": "Subject",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Question",
      "help": "The assessment owner follows the school’s review process.",
      "fields": [
        {
          "name": "question",
          "label": "What would you like clarified?",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A tracked clarification reaches the authorized school reviewer.",
  "invariant": "No direct parent grade edits, guaranteed revaluation or automatic publication of revised results.",
  "recovery": "Closed review window, duplicate query and a superseded result produce clear next steps.",
  "data": "FamilyRequest references PublishedResultVersion/subject; Assessments owns any correction and republication.",
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
