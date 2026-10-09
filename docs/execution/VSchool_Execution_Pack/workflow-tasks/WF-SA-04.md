# WF-SA-04 — Complete first-use setup

Source workflow: SA-04. Workspace: VSchool_School_Admin_Design. Source area: home. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-04",
  "module": "home",
  "title": "Complete first-use setup",
  "phase": 1,
  "capability": "school.manage + relevant setup capabilities",
  "steps": [
    {
      "title": "Review readiness",
      "help": "Only prerequisites for your enabled modules belong in this checklist.",
      "fields": [
        {
          "name": "next",
          "label": "Next setup area",
          "type": "select",
          "options": [
            "School settings",
            "Academic year and calendar",
            "Classes and subjects",
            "Staff and assignments",
            "Students and enrollment",
            "Attendance sessions"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Assign the next action",
      "help": "The checklist reflects saved records, not a manually checked completion flag.",
      "fields": [
        {
          "name": "owner",
          "label": "Responsible role",
          "type": "select",
          "options": [
            "School administrator",
            "Institution administrator",
            "Assigned teacher"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The next incomplete dependency opens in its owning module.",
  "rule": "Setup completion is derived from authoritative data; adding Fees later must not invalidate Attendance readiness.",
  "edge": "Show blocked dependencies with a route to the responsible role; a hidden module is never a missing step.",
  "data": "Read model joins authorized School configuration, academic readiness, membership, enrollment and session counts."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
