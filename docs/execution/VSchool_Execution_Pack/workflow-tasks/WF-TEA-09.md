# WF-TEA-09 — Open an assigned attendance session

Source workflow: TEA-09. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-09",
  "area": "attendance",
  "title": "Open an assigned attendance session",
  "phase": 1,
  "capability": "attendance.mark + exact dated teacher assignment",
  "entry": "attendance/a1",
  "steps": [
    {
      "title": "Session context",
      "help": "Check subject, class, date and branch-local time.",
      "fields": [
        {
          "name": "session",
          "label": "Assigned session",
          "type": "select",
          "options": [
            "Mathematics · Grade 6 A · 8 Oct, 09:00",
            "Mathematics · Grade 6 B · 8 Oct, 11:15"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Open register",
      "help": "Opening freezes the eligible roster, not its attendance statuses.",
      "fields": [
        {
          "name": "open",
          "label": "This is the intended class session.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The exact frozen roster opens with every pupil initially unmarked.",
  "rule": "No default presence or absence. Reauthorize at open and submit; validate current session state and assignment.",
  "recovery": "Empty roster, cancelled session, changed assignment and duplicate open have explicit outcomes. Never manufacture pupils or a replacement session.",
  "data": "AttendanceSession state/roster transaction reads scoped dated enrollment, pins roster and calendar revision, writes audit/receipt without student attendance statuses.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
