# WF-TEA-42 — Use a teaching draft with source evidence

Source workflow: TEA-42. Workspace: VSchool_Teacher_Design. Source area: assistant. Catalog phase: 7.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-42",
  "area": "assistant",
  "title": "Use a teaching draft with source evidence",
  "phase": 7,
  "capability": "assistant.use + each source capability",
  "entry": "assistant",
  "steps": [
    {
      "title": "Choose an allowed task",
      "help": "Use authorized curriculum/resources and minimal permitted learner data.",
      "fields": [
        {
          "name": "task",
          "label": "Task",
          "type": "select",
          "options": [
            "Draft a lesson outline",
            "Draft feedback from reviewed work",
            "Explain my class attendance summary"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "request",
          "label": "Request",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review evidence",
      "help": "Sources, as-of time and uncertainty remain visible.",
      "fields": [
        {
          "name": "sources",
          "label": "I have checked the sources and factual claims.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Human action",
      "help": "Open the normal workflow to edit and publish anything.",
      "fields": [
        {
          "name": "next",
          "label": "Next step",
          "type": "select",
          "options": [
            "Keep private draft",
            "Open the normal lesson/feedback form"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A reviewed draft supports the teacher without independently changing school records.",
  "rule": "No autonomous attendance marking, grading, discipline, diagnosis or guardian messaging. No unrestricted student SQL or sensitive-case retrieval.",
  "recovery": "Missing evidence, prompt injection, stale content and provider failure cause abstention or an explicit safe fallback.",
  "data": "AssistantSession/EvidenceReference/ActionProposal; permission-filtered owner read contracts, deterministic calculations and normal publication use cases.",
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
