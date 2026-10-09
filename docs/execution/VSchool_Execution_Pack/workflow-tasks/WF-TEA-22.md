# WF-TEA-22 — Review my published timetable

Source workflow: TEA-22. Workspace: VSchool_Teacher_Design. Source area: planning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-22",
  "area": "planning",
  "title": "Review my published timetable",
  "phase": 3,
  "capability": "timetable.read for current assignments",
  "entry": "planning",
  "steps": [
    {
      "title": "Week",
      "help": "A published version is distinct from a draft plan.",
      "fields": [
        {
          "name": "week",
          "label": "Week beginning",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Session details",
      "help": "See room, subject and permitted changes with a list alternative to the grid.",
      "fields": [
        {
          "name": "class",
          "label": "Assigned class",
          "type": "select",
          "options": [
            "Grade 6 · A · Mathematics",
            "Grade 6 · B · Mathematics",
            "Grade 7 · A · Science"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Published timetable",
            "Dated exceptions"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher can plan against a versioned schedule and identify changes.",
  "rule": "Manual Phase 1 sessions do not imply recurring timetable support. A schedule view never creates attendance records.",
  "recovery": "Draft/unpublished change, room closure and cancelled occurrence clearly identify the current authoritative version.",
  "data": "Academics TimetableVersion/slots + dated assignments and exceptions compose the view; Attendance references generated occurrence source.",
  "proposal": false,
  "timetable_contract": {
    "release": "TT-01",
    "owner": "academics / timetable",
    "entry": "planning",
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
