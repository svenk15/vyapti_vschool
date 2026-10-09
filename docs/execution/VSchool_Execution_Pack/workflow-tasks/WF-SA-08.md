# WF-SA-08 — Review modules and request a capability

Source workflow: SA-08. Workspace: VSchool_School_Admin_Design. Source area: settings. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-08",
  "module": "settings",
  "title": "Review modules and request a capability",
  "phase": 1,
  "capability": "module status read; commercial changes are institution/operator authority",
  "steps": [
    {
      "title": "Choose a module",
      "help": "See enabled modules and dependencies without exposing unlicensed operational screens.",
      "fields": [
        {
          "name": "module",
          "label": "Capability",
          "type": "select",
          "options": [
            "Attendance",
            "Family portal",
            "Fees & payments",
            "Transport"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Request a change",
      "help": "Commercial and branch activation approvals stay with the authorized owner.",
      "fields": [
        {
          "name": "need",
          "label": "What does your school need?",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The administrator gets a clear handoff to the institution contact.",
  "rule": "Licensed, released, branch-enabled and authorized are four separate checks. No self-service license escalation.",
  "edge": "Disabling a module retains data and must respect open obligations; request submission alone changes nothing.",
  "data": "Tenancy read model for entitlement and branch activation. Proposed change request only if an approved request contract exists; otherwise display contact instructions."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
