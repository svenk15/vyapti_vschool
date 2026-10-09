# WF-PAR-16 — Request a teacher meeting

Source workflow: PAR-16. Workspace: VSchool_Parent_Guardian_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-16",
  "area": "communication",
  "title": "Request a teacher meeting",
  "phase": 2,
  "purpose": "meeting.request for permitted teacher/child (proposed)",
  "steps": [
    {
      "title": "Meeting purpose",
      "help": "Choose a school-offered channel and participant.",
      "fields": [
        {
          "name": "participant",
          "label": "Meeting with",
          "type": "select",
          "options": [
            "Assigned class teacher",
            "School office"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "topic",
          "label": "Brief topic",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Preferred time",
      "help": "A request is not a confirmed calendar booking.",
      "fields": [
        {
          "name": "date",
          "label": "Preferred date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "slot",
          "label": "Preferred slot",
          "type": "select",
          "options": [
            "15:30–15:45",
            "15:45–16:00"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The request is pending, then confirmed/rescheduled/declined by the school.",
  "invariant": "Use offered availability only. Do not expose staff private calendars. Store school-local zone and an unambiguous instant after confirmation.",
  "recovery": "Handle competing reservations, cancellation and removed guardian access.",
  "data": "Proposed MeetingRequest/SlotReservation; Communication owns participant notifications. Requires scheduling LLD.",
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
