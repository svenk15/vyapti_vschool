# WF-SA-54 — Review payroll inputs and hand off

Source workflow: SA-54. Workspace: VSchool_School_Admin_Design. Source area: people-ops. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-54",
  "module": "people-ops",
  "title": "Review payroll inputs and hand off",
  "phase": 6,
  "capability": "payroll.input / payroll.approve (restricted)",
  "steps": [
    {
      "title": "Pay period",
      "help": "Only authorized payroll staff see salary figures.",
      "fields": [
        {
          "name": "period",
          "label": "Period",
          "type": "select",
          "options": [
            "October 2026"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Review input completeness",
            "Handoff to payroll approver"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Approval evidence",
      "help": "Use jurisdiction-specific versioned rules.",
      "fields": [
        {
          "name": "reference",
          "label": "Approved payroll review reference",
          "type": "text",
          "options": [],
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
    }
  ],
  "outcome": "Authorized payroll review proceeds with immutable approved run history.",
  "rule": "A School Administrator role grants no salary access; no payroll formula is assumed in this design.",
  "edge": "Rule change, missing input or revoked approval stops the run; corrections create a new linked revision.",
  "data": "Restricted PayrollRun, rule version and input references; immutable approval/export evidence. Separate regulatory design required."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
