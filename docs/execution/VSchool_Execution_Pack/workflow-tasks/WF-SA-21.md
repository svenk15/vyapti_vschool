# WF-SA-21 — Move a student to another section

Source workflow: SA-21. Workspace: VSchool_School_Admin_Design. Source area: students. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-21",
  "module": "students",
  "title": "Move a student to another section",
  "phase": 1,
  "capability": "student.manage",
  "steps": [
    {
      "title": "New placement",
      "help": "This is a dated move within the same branch.",
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
          "name": "section",
          "label": "Class",
          "type": "select",
          "options": [
            "Grade 6 · A",
            "Grade 6 · B",
            "Grade 7 · A"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "effective",
          "label": "Effective from",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review roster changes",
      "help": "The current placement closes at the new placement boundary.",
      "fields": [
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "impact",
          "label": "No frozen or submitted session is being rewritten.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Current and new placement intervals remain contiguous and explainable.",
  "rule": "Reject unsupported backdated changes; already frozen/submitted rosters remain unchanged.",
  "edge": "Offer a future valid date when historical attendance conflicts; do not delete and recreate enrollment.",
  "data": "Students closes old SectionPlacement and appends new placement atomically after Attendance impact checks."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
