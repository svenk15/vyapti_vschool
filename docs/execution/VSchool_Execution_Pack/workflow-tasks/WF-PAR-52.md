# WF-PAR-52 — Ask the school assistant

Source workflow: PAR-52. Workspace: VSchool_Parent_Guardian_Design. Source area: assistant. Catalog phase: 7.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-52",
  "area": "assistant",
  "title": "Ask the school assistant",
  "phase": 7,
  "purpose": "permission-filtered evidence for selected child/purpose",
  "steps": [
    {
      "title": "Question",
      "help": "Ask about published school information and permitted records.",
      "fields": [
        {
          "name": "topic",
          "label": "Topic",
          "type": "select",
          "options": [
            "Explain a published school notice",
            "Explain an attendance label",
            "Find an approved next step"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "question",
          "label": "Your question",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review evidence",
      "help": "Check the source and date before relying on a response.",
      "fields": [
        {
          "name": "sources",
          "label": "I have reviewed the cited school sources and any uncertainty.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent receives a source-linked explanation or a clear cannot-answer state.",
  "invariant": "No autonomous payments, consent, messages, medical advice or attendance/result changes. Child content stays isolated; retrieved text cannot override access rules.",
  "recovery": "Missing/stale/conflicting evidence is disclosed; provide the correct human school contact. Reauthorize sources at retrieval and action.",
  "data": "Assistant retrieves minimal purpose-filtered owner DTOs; provenance and draft disposition exclude raw sensitive content from general analytics.",
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
