# WF-TEA-40 — Request materials or book a teaching space

Source workflow: TEA-40. Workspace: VSchool_Teacher_Design. Source area: resources. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-40",
  "area": "resources",
  "title": "Request materials or book a teaching space",
  "phase": 6,
  "capability": "resource.request / facility.book within granted scope",
  "entry": "flow/TEA-40",
  "steps": [
    {
      "title": "Request",
      "help": "Choose a teaching need and time.",
      "fields": [
        {
          "name": "resource",
          "label": "Resource",
          "type": "select",
          "options": [
            "Science lab",
            "Projector kit",
            "Classroom materials"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "date",
          "label": "Date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "fromTime",
          "label": "Start time",
          "type": "time",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "toTime",
          "label": "End time",
          "type": "time",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Purpose",
      "help": "Inventory custody and room scheduling remain explicit.",
      "fields": [
        {
          "name": "purpose",
          "label": "Teaching purpose",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The request is confirmed only after availability and approval checks.",
  "rule": "No direct stock adjustment or room double-booking; timetable commitments and maintenance blocks apply.",
  "recovery": "Concurrent booking, unavailable quantity, overdue return and changed class schedule need reviewed alternatives.",
  "data": "Facilities booking range and Inventory request/custody references; authorized owner commands append movements and reservations.",
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
