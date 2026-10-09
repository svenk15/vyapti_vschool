# WF-SA-30 — Review and export attendance

Source workflow: SA-30. Workspace: VSchool_School_Admin_Design. Source area: reports. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-30",
  "module": "reports",
  "title": "Review and export attendance",
  "phase": 1,
  "capability": "attendance.read_school + attendance.export",
  "steps": [
    {
      "title": "Report scope",
      "help": "Start with one authorized branch and an explicit period.",
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
          "name": "to",
          "label": "To date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Session completeness",
            "Student attendance",
            "Class summary"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review export",
      "help": "Show columns, row count, completeness and the data timestamp.",
      "fields": [
        {
          "name": "export",
          "label": "I have reviewed the scope and permitted columns.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A scoped report and bounded export match the underlying session records.",
  "rule": "Rate = (Present + Late) / (Present + Late + Absent); Excused excluded. Zero denominator is unavailable.",
  "edge": "Unsubmitted data remains missing; revoked access is rechecked at export generation/download.",
  "data": "Reporting joins scoped sessions, effective records, frozen roster and student identifiers; export reads only allowed columns."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
