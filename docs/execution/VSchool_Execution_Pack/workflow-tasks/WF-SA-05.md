# WF-SA-05 — Resolve a daily exception

Source workflow: SA-05. Workspace: VSchool_School_Admin_Design. Source area: home. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-05",
  "module": "home",
  "title": "Resolve a daily exception",
  "phase": 1,
  "capability": "capability of the underlying action",
  "steps": [
    {
      "title": "Choose an issue",
      "help": "Each item links to evidence and the action that resolves it.",
      "fields": [
        {
          "name": "issue",
          "label": "Issue",
          "type": "select",
          "options": [
            "Grade 6 A register not submitted",
            "Roster import needs review",
            "Staff activation pending"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review ownership",
      "help": "An exception does not disappear until its underlying record changes.",
      "fields": [
        {
          "name": "action",
          "label": "Next action",
          "type": "select",
          "options": [
            "Open source record",
            "Review blocked dependency"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The source record opens with its branch and status intact.",
  "rule": "Never turn a pending register into an absence; the dashboard is a read model.",
  "edge": "An already resolved or revoked item refreshes safely and explains why it is no longer actionable.",
  "data": "Read AttendanceSession, ImportJob and permitted access status; no separate shadow business state."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
