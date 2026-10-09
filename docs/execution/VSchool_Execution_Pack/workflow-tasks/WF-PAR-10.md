# WF-PAR-10 — Read my child’s attendance

Source workflow: PAR-10. Workspace: VSchool_Parent_Guardian_Design. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-10",
  "area": "attendance",
  "title": "Read my child’s attendance",
  "phase": 2,
  "purpose": "attendance.read_child",
  "steps": [
    {
      "title": "Attendance period",
      "help": "Read submitted session outcomes in school-local time.",
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
          "label": "Until date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Inspect a session",
      "help": "Unsubmitted and unavailable are not absence.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Submitted session detail",
            "Unsubmitted session explanation",
            "Correction history when permitted"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent understands the exact session status and source of the recorded outcome.",
  "invariant": "Show session granularity and exclude unsubmitted/cancelled sessions from any policy-defined attendance denominator. Do not invent a daily status or percentage.",
  "recovery": "Pending data and revised records display honestly. Parent cannot edit marks.",
  "data": "Submitted AttendanceSession → child frozen roster entry → effective AttendanceRecord/revision, scoped to current child purpose.",
  "extension": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
