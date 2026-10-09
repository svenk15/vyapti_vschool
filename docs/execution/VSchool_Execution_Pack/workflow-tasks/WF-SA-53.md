# WF-SA-53 — Review leave and staffing coverage

Source workflow: SA-53. Workspace: VSchool_School_Admin_Design. Source area: people-ops. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-53",
  "module": "people-ops",
  "title": "Review leave and staffing coverage",
  "phase": 6,
  "capability": "leave.approve (delegated)",
  "steps": [
    {
      "title": "Leave request",
      "help": "Show dates and staffing impact; keep sensitive attachments restricted.",
      "fields": [
        {
          "name": "request",
          "label": "Request",
          "type": "select",
          "options": [
            "Rohan Das · 12–13 Oct"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "decision",
          "label": "Decision",
          "type": "select",
          "options": [
            "Approve",
            "Request information",
            "Decline"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Coverage",
      "help": "Coordinate cover through Timetable; no attendance auto-edit.",
      "fields": [
        {
          "name": "coverage",
          "label": "Coverage plan and response",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The leave balance and coverage decisions are recorded separately.",
  "rule": "Pupil attendance and staff attendance are different domains; serialize concurrent leave debits.",
  "edge": "Insufficient balance or changed approver authority blocks approval.",
  "data": "People operations owns LeaveRequest/BalanceLedger; Academics owns cover; Employee identity read via People contract."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
