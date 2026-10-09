# WF-PAR-22 — Ask a learning question

Source workflow: PAR-22. Workspace: VSchool_Parent_Guardian_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-22",
  "area": "learning",
  "title": "Ask a learning question",
  "phase": 3,
  "purpose": "learning read + approved communication grant",
  "steps": [
    {
      "title": "Learning context",
      "help": "Quote the relevant assignment, not a class-wide pupil list.",
      "fields": [
        {
          "name": "reference",
          "label": "Assignment or feedback reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Question",
      "help": "Use the permitted teacher conversation.",
      "fields": [
        {
          "name": "question",
          "label": "Your question",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The question is routed to a permitted conversation with the child context attached.",
  "invariant": "No unrestricted new recipient selection or implicit result-appeal workflow.",
  "recovery": "If the teacher’s assignment changes, the school resolves routing without exposing another private thread.",
  "data": "Communication message references a permitted Learning resource/version; each owner rechecks its scope.",
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
