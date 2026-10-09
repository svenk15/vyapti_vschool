# WF-SA-48 — Configure fees and concessions

Source workflow: SA-48. Workspace: VSchool_School_Admin_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-48",
  "module": "finance",
  "title": "Configure fees and concessions",
  "phase": 5,
  "capability": "finance.plan.manage / concession.approve (delegated)",
  "steps": [
    {
      "title": "Plan scope",
      "help": "Finance is independent of Attendance.",
      "fields": [
        {
          "name": "plan",
          "label": "Plan",
          "type": "select",
          "options": [
            "2026–27 annual tuition"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "currency",
          "label": "Currency",
          "type": "select",
          "options": [
            "INR"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "amount",
          "label": "Amount in major units",
          "type": "number",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Concession review",
      "help": "Approval authority is separate from requesting a concession.",
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
          "name": "basis",
          "label": "Concession request / approval reference",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An approved plan revision can be used to generate invoice snapshots.",
  "rule": "General school administrators have coordination access only unless explicitly granted finance authority.",
  "edge": "In-use fee plans version forward; negative/invalid money and unsupported currency are rejected.",
  "data": "Finance owns FeePlanVersion and Concession decision. Store money in exact minor units with currency; no floats."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
