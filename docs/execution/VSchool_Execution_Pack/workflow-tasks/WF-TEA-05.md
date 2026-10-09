# WF-TEA-05 — Plan my teaching day

Source workflow: TEA-05. Workspace: VSchool_Teacher_Design. Source area: today. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-05",
  "area": "today",
  "title": "Plan my teaching day",
  "phase": 1,
  "capability": "class.read + assigned attendance capabilities",
  "entry": "today",
  "steps": [
    {
      "title": "Choose the date",
      "help": "The school-local date determines the schedule.",
      "fields": [
        {
          "name": "date",
          "label": "Teaching date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next action",
      "help": "Show sessions in time order with their actual state.",
      "fields": [
        {
          "name": "action",
          "label": "Open",
          "type": "select",
          "options": [
            "Next assigned session",
            "Unsubmitted register",
            "Submitted session receipt"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher reaches the right class with a clear next action.",
  "rule": "Scheduled, open, submitted and cancelled are distinct. A missing register never creates absence records. No unrelated school-wide student counts.",
  "recovery": "No sessions is a helpful empty state, not evidence of an account failure. Refresh rechecks assignments.",
  "data": "Authorized Offering/Assignment → dated AttendanceSession read model. Include branch zone, as-of time and server-resolved capability.",
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
