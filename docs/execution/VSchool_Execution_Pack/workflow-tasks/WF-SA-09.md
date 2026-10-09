# WF-SA-09 — Create an academic year and calendar

Source workflow: SA-09. Workspace: VSchool_School_Admin_Design. Source area: academics. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-09",
  "module": "academics",
  "title": "Create an academic year and calendar",
  "phase": 1,
  "capability": "school.manage",
  "steps": [
    {
      "title": "Academic year",
      "help": "Use the school’s civil dates.",
      "fields": [
        {
          "name": "name",
          "label": "Year name",
          "type": "text",
          "options": [],
          "required": true,
          "value": "2026–27"
        },
        {
          "name": "from",
          "label": "Start date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "End date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Teaching days",
      "help": "Calendar changes create a reviewed revision.",
      "fields": [
        {
          "name": "week",
          "label": "Teaching week",
          "type": "select",
          "options": [
            "Monday–Friday",
            "Monday–Saturday"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "holidays",
          "label": "Holiday dates and descriptions",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review impact",
      "help": "Check date bounds and existing scheduled sessions before saving.",
      "fields": [
        {
          "name": "impact",
          "label": "I have reviewed calendar conflicts.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A valid year and immutable calendar revision are available.",
  "rule": "Reject invalid/reversed ranges and incompatible scheduled dates; existing sessions keep their pinned calendar revision.",
  "edge": "A concurrent calendar update requires reload and impact review.",
  "data": "Academics owns AcademicYear and CalendarRevision; sessions reference the selected calendar version."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
