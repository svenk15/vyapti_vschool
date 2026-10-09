# WF-TEA-21 — Review permitted absence context

Source workflow: TEA-21. Workspace: VSchool_Teacher_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-21",
  "area": "communication",
  "title": "Review permitted absence context",
  "phase": 2,
  "capability": "attendance explanation read purpose; no default approval",
  "entry": "flow/TEA-21",
  "steps": [
    {
      "title": "Student and date",
      "help": "Read only the limited explanation permitted for teaching.",
      "fields": [
        {
          "name": "student",
          "label": "Student in assigned class",
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
          "name": "date",
          "label": "Session date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "School handoff",
      "help": "Review status does not itself alter the register.",
      "fields": [
        {
          "name": "next",
          "label": "Action",
          "type": "select",
          "options": [
            "View office-reviewed disposition",
            "Refer a discrepancy to the school office"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher gets necessary context while the school office controls disposition and correction.",
  "rule": "No clinical attachment, private family dispute or guardian note unless explicitly authorized. No automatic absence inference.",
  "recovery": "Pending explanation, late attendance, revoked relationship and unavailable detail are distinct.",
  "data": "Minimal authorized explanation/request read model; Attendance correction and Guardian relationship owners remain separate.",
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
