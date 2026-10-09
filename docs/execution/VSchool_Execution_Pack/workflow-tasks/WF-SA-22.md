# WF-SA-22 — Promote, transfer or leave school

Source workflow: SA-22. Workspace: VSchool_School_Admin_Design. Source area: students. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-22",
  "module": "students",
  "title": "Promote, transfer or leave school",
  "phase": 3,
  "capability": "student.lifecycle.manage",
  "steps": [
    {
      "title": "Lifecycle action",
      "help": "Keep prior enrollment and attendance history intact.",
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
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Promote to next year",
            "Transfer to another branch",
            "Record withdrawal"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "effective",
          "label": "Effective date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Destination and obligations",
      "help": "Destination access and open obligations are reviewed independently.",
      "fields": [
        {
          "name": "destination",
          "label": "Destination / receiving school",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "review",
          "label": "Reviewed obligations and handoff",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Confirm lifecycle change",
      "help": "A cross-branch move creates a destination profile under that branch’s authority.",
      "fields": [
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A dated lifecycle case records the outcome and preserves source history.",
  "rule": "Bulk promotion requires preview and per-student results; financial balances do not transfer by moving a student row.",
  "edge": "Partial results, destination rejection, changed capacity and duplicate confirmation require recoverable receipts.",
  "data": "Students owns LifecycleCase and enrollment changes; Finance/Documents/Guardians use explicit follow-up contracts."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
