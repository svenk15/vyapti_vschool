# WF-PAR-18 — Plan with the school calendar

Source workflow: PAR-18. Workspace: VSchool_Parent_Guardian_Design. Source area: calendar. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-18",
  "area": "calendar",
  "title": "Plan with the school calendar",
  "phase": 2,
  "purpose": "published calendar audience for child",
  "steps": [
    {
      "title": "Calendar",
      "help": "See school-local dates and the source school.",
      "fields": [
        {
          "name": "from",
          "label": "From date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "category",
          "label": "Category",
          "type": "select",
          "options": [
            "All permitted events",
            "Holidays",
            "Meetings",
            "Class events"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Event detail",
      "help": "A dated event is not proof of attendance or a transport reservation.",
      "fields": [
        {
          "name": "next",
          "label": "Action",
          "type": "select",
          "options": [
            "Read event details",
            "Review permitted calendar export"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent can plan using a readable agenda and current published event version.",
  "invariant": "Calendar export contains only permitted minimal details. No other child or staff-private schedule.",
  "recovery": "Changed/cancelled events show clear history; stale export does not override the live school record.",
  "data": "Published calendar event/version + audience purpose; export generation reauthorizes each event.",
  "extension": false,
  "timetable_contract": {
    "release": "TT-01",
    "owner": "academics / timetable",
    "entry": "timetable",
    "specification": "docs/timetable/README.md",
    "phase": 3,
    "implementation": "NOT_ASSESSED"
  }
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
