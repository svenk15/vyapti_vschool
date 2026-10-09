# WF-SA-28 — Cancel or review a session change

Source workflow: SA-28. Workspace: VSchool_School_Admin_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-28",
  "module": "attendance",
  "title": "Cancel or review a session change",
  "phase": 1,
  "capability": "class.manage",
  "steps": [
    {
      "title": "Session and reason",
      "help": "Show current state before offering allowed cancellation.",
      "fields": [
        {
          "name": "session",
          "label": "Session",
          "type": "select",
          "options": [
            "Science · 8 Oct · 11:15 · Scheduled"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review consequences",
      "help": "Cancellation keeps history and affects completeness transparently.",
      "fields": [
        {
          "name": "cancel",
          "label": "I have reviewed the session state and report impact.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A supported cancellation records its reason and preserved history.",
  "rule": "Do not silently reschedule an open/submitted session; use the supported state transition contract.",
  "edge": "Changed session state may block cancellation; refresh the current record before retry.",
  "data": "Attendance session state transition under version/guard, with audit/outbox and reporting status change."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
