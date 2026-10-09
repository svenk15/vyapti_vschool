# WF-SA-02 — Activate or recover an account

Source workflow: SA-02. Workspace: VSchool_School_Admin_Design. Source area: home. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-02",
  "module": "home",
  "title": "Activate or recover an account",
  "phase": 1,
  "capability": "access activation / recovery policy",
  "steps": [
    {
      "title": "Request access help",
      "help": "The available recovery path follows the institution and account-wide trust policy.",
      "fields": [
        {
          "name": "email",
          "label": "Email address",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "help",
          "label": "What do you need?",
          "type": "select",
          "options": [
            "Activate invited account",
            "Reset password"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next steps",
      "help": "The public response must not reveal account existence or which institution restricts recovery.",
      "fields": [
        {
          "name": "ack",
          "label": "I understand that the verified recovery channel must be used.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A generic acknowledgement and permitted recovery instructions are shown.",
  "rule": "Email resets must satisfy every active institution membership at issue and consume time; operator recovery remains supported.",
  "edge": "Expired, revoked, failed-delivery and previously consumed tokens cannot be accepted; resend rotates the token.",
  "data": "Access owns invitation/activation/reset tokens, consumption transaction, audit and delivery outcome. Never put secrets in audit."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
