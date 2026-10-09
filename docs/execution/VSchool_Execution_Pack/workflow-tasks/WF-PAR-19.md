# WF-PAR-19 — Respond to a school event

Source workflow: PAR-19. Workspace: VSchool_Parent_Guardian_Design. Source area: calendar. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-19",
  "area": "calendar",
  "title": "Respond to a school event",
  "phase": 3,
  "purpose": "event.response for child (proposed)",
  "steps": [
    {
      "title": "Event response",
      "help": "Review the event and its response deadline.",
      "fields": [
        {
          "name": "event",
          "label": "Event reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "response",
          "label": "Response",
          "type": "select",
          "options": [
            "Attending",
            "Not attending"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Confirm",
      "help": "RSVP and permission consent are separate.",
      "fields": [
        {
          "name": "confirm",
          "label": "I have checked the selected child and event response.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An explicit response is recorded for this event version.",
  "invariant": "RSVP does not grant excursion consent, pickup authority or paid-service enrollment. If a separate consent is needed, show it separately.",
  "recovery": "Deadline passed, event version changed or capacity changed yields a clear outcome.",
  "data": "Proposed EventResponse, event version and owner capacity policy; Consent and Finance remain separate owners.",
  "extension": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
