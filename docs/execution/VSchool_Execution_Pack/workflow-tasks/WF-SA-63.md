# WF-SA-63 — Review an AI-assisted explanation or draft

Source workflow: SA-63. Workspace: VSchool_School_Admin_Design. Source area: assistant. Catalog phase: 7.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-63",
  "module": "assistant",
  "title": "Review an AI-assisted explanation or draft",
  "phase": 7,
  "capability": "assistant.use + every source capability",
  "steps": [
    {
      "title": "Choose an allowed task",
      "help": "The assistant retrieves only evidence already permitted to you.",
      "fields": [
        {
          "name": "task",
          "label": "Task",
          "type": "select",
          "options": [
            "Explain a permitted attendance report",
            "Draft a school notice"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "question",
          "label": "Question / draft request",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Check sources",
      "help": "The answer must carry source references and an as-of time.",
      "fields": [
        {
          "name": "sources",
          "label": "I have checked the cited evidence and any uncertainty.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Use a reviewed draft",
      "help": "Business changes still use normal authorized forms.",
      "fields": [
        {
          "name": "next",
          "label": "Next action",
          "type": "select",
          "options": [
            "Keep as a draft",
            "Open the normal action form"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A reviewed draft or explanation can support a human decision.",
  "rule": "No unrestricted SQL, autonomous record changes or sensitive health/disciplinary inference.",
  "edge": "Missing evidence, provider outage and suspicious retrieved instructions trigger abstention or a safe fallback.",
  "data": "AssistantSession, scoped EvidenceReference and ActionProposal; deterministic calculations from owner read contracts."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
