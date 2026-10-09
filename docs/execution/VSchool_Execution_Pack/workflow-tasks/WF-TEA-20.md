# WF-TEA-20 — Arrange a family meeting

Source workflow: TEA-20. Workspace: VSchool_Teacher_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-20",
  "area": "communication",
  "title": "Arrange a family meeting",
  "phase": 2,
  "capability": "meeting.request within permitted family relationship (proposed)",
  "entry": "flow/TEA-20",
  "steps": [
    {
      "title": "Purpose and participant",
      "help": "Use a verified conversation or school-approved scheduling route.",
      "fields": [
        {
          "name": "student",
          "label": "Student in assigned class",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "topic",
          "label": "Meeting topic",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "date",
          "label": "Preferred date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Availability",
      "help": "Share only offered times, not the teacher’s private calendar.",
      "fields": [
        {
          "name": "time",
          "label": "Time",
          "type": "select",
          "options": [
            "15:30–15:45",
            "15:45–16:00"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "note",
          "label": "Message to the family",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The request is proposed, confirmed, rescheduled or cancelled with an explicit participant response.",
  "rule": "This scheduling extension needs approval and a conflict model before implementation. No student-sensitive detail in public calendars.",
  "recovery": "Concurrent booking, cancellation, time-zone display and guardian revocation require clear recovery.",
  "data": "Proposed MeetingRequest/SlotReservation with participant grants; Communication handles notices separately.",
  "proposal": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
