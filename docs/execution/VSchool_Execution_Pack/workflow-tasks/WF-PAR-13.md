# WF-PAR-13 — Query an attendance discrepancy

Source workflow: PAR-13. Workspace: VSchool_Parent_Guardian_Design. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-13",
  "area": "attendance",
  "title": "Query an attendance discrepancy",
  "phase": 2,
  "purpose": "attendance.read_child + permitted school request",
  "steps": [
    {
      "title": "Exact session",
      "help": "Quote the session the school recorded.",
      "fields": [
        {
          "name": "session",
          "label": "Session reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "issue",
          "label": "Issue",
          "type": "select",
          "options": [
            "Recorded status appears incorrect",
            "Explanation not reflected",
            "Session details need clarification"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Explain the concern",
      "help": "The authorized school administrator decides any correction.",
      "fields": [
        {
          "name": "note",
          "label": "What should the school review?",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent receives a query reference; the submitted register remains unchanged.",
  "invariant": "No parent attendance.correct grant. A query is not an approved correction or evidence that the teacher was wrong.",
  "recovery": "If the record changed, show the permitted new revision and retain the original query reference.",
  "data": "FamilyRequest references child/session/revision; Attendance correction owner links any accepted outcome.",
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
