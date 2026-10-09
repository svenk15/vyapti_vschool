# WF-SA-58 — Book a facility or request maintenance

Source workflow: SA-58. Workspace: VSchool_School_Admin_Design. Source area: facilities. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-58",
  "module": "facilities",
  "title": "Book a facility or request maintenance",
  "phase": 6,
  "capability": "facilities.manage (delegated)",
  "steps": [
    {
      "title": "Facility",
      "help": "Choose an available resource and date.",
      "fields": [
        {
          "name": "facility",
          "label": "Facility",
          "type": "select",
          "options": [
            "Science lab",
            "Assembly hall"
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
          "name": "start",
          "label": "Start time",
          "type": "time",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "end",
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
      "help": "A maintenance closure blocks conflicting use.",
      "fields": [
        {
          "name": "type",
          "label": "Request type",
          "type": "select",
          "options": [
            "Booking",
            "Maintenance closure"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A conflict-free booking or owned maintenance order is recorded.",
  "rule": "Enforce overlapping reservation constraints and clear unavailable periods.",
  "edge": "Concurrent booking or changed maintenance status shows alternatives instead of double-booking.",
  "data": "FacilityBooking range constraint and MaintenanceOrder; published timetable room use checked through Academics contract."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
