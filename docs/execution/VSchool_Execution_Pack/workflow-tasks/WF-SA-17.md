# WF-SA-17 — Change or revoke staff access

Source workflow: SA-17. Workspace: VSchool_School_Admin_Design. Source area: staff. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-17",
  "module": "staff",
  "title": "Change or revoke staff access",
  "phase": 1,
  "capability": "user.manage",
  "steps": [
    {
      "title": "Select the access change",
      "help": "Only this branch’s grant changes.",
      "fields": [
        {
          "name": "employee",
          "label": "Employee",
          "type": "select",
          "options": [
            "Rohan Das · EMP-002",
            "Meera Iyer · EMP-003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "change",
          "label": "Change",
          "type": "select",
          "options": [
            "Suspend membership",
            "Revoke teacher role",
            "Restore eligible membership"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review impact",
      "help": "Assignments, sessions and the last active administrator require review.",
      "fields": [
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "confirm",
          "label": "I have reviewed affected work and access.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The next protected request rechecks the changed grant.",
  "rule": "Do not disable a global identity for a local branch action; prevent removal of the last active administrator.",
  "edge": "Concurrent revocations serialize; insufficient replacement/admin coverage blocks the action.",
  "data": "Access membership/grant transaction and audit; related assignment reads show impact without rewriting history."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
