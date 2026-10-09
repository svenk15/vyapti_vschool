# WF-TEA-11 — Submit attendance and keep the receipt

Source workflow: TEA-11. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-11",
  "area": "attendance",
  "title": "Submit attendance and keep the receipt",
  "phase": 1,
  "capability": "attendance.mark + eligible exact assignment",
  "entry": "attendance/a1",
  "steps": [
    {
      "title": "Review totals",
      "help": "Every frozen roster pupil must have one supported status.",
      "fields": [
        {
          "name": "complete",
          "label": "Every pupil has been marked and totals match the roster.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Submit once",
      "help": "Send one intent with its stable idempotency key and expected revision.",
      "fields": [
        {
          "name": "confirm",
          "label": "Submit this attendance register.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An acknowledged immutable submission shows scope, totals, actor, time and receipt reference.",
  "rule": "Validate the full frozen roster atomically. Same key/payload replay returns the same outcome; changed payload with that key conflicts.",
  "recovery": "Do not show success before server acknowledgement. On loss of response, retain the intent and use Check status.",
  "data": "Owner transaction rechecks authorization/guards/version, writes complete attendance records + submission revision + receipt + safe audit/outbox.",
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
