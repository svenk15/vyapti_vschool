# WF-SA-51 — Prepare routes and allocate students

Source workflow: SA-51. Workspace: VSchool_School_Admin_Design. Source area: transport. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-51",
  "module": "transport",
  "title": "Prepare routes and allocate students",
  "phase": 6,
  "capability": "transport.manage (delegated)",
  "steps": [
    {
      "title": "Route and capacity",
      "help": "Use eligible vehicles and drivers.",
      "fields": [
        {
          "name": "route",
          "label": "Route",
          "type": "select",
          "options": [
            "Route 4 · Whitefield"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "vehicle",
          "label": "Vehicle",
          "type": "select",
          "options": [
            "Bus 12 · 40 seats"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "driver",
          "label": "Verified driver reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Student allocation",
      "help": "Confirm approved stop and handoff arrangements.",
      "fields": [
        {
          "name": "student",
          "label": "Student",
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
          "name": "stop",
          "label": "Stop",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "from",
          "label": "Effective from",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A dated allocation contributes to the next trip manifest.",
  "rule": "Transport consent, pickup authority and guardian portal grant are separate.",
  "edge": "Full vehicle, expired qualification or unavailable stop blocks the allocation.",
  "data": "Transport RouteVersion, Stop, Vehicle/DriverQualification, Allocation and trip manifest snapshot."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
