# WF-SA-52 — Resolve a trip or handoff exception

Source workflow: SA-52. Workspace: VSchool_School_Admin_Design. Source area: transport. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-52",
  "module": "transport",
  "title": "Resolve a trip or handoff exception",
  "phase": 6,
  "capability": "transport.trip.manage (delegated)",
  "steps": [
    {
      "title": "Trip event",
      "help": "Protect live child location and identity.",
      "fields": [
        {
          "name": "trip",
          "label": "Trip",
          "type": "select",
          "options": [
            "Route 4 · Afternoon"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "event",
          "label": "Exception",
          "type": "select",
          "options": [
            "Missed boarding",
            "Unverified pickup",
            "Vehicle change"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Safe resolution",
      "help": "Follow the school’s approved emergency protocol.",
      "fields": [
        {
          "name": "resolution",
          "label": "Resolution and verified handoff reference",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An accountable trip exception is recorded and escalated where needed.",
  "rule": "Never confirm an unverified handoff; minimize live location exposure.",
  "edge": "Disconnected device or uncertain event preserves pending status and uses the approved human fallback.",
  "data": "Trip and BoardingEvent append; route/vehicle changes reviewed; Communication uses minimal authorized notices."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
