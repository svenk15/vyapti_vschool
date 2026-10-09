# WF-PAR-03 — Activate or recover account access

Source workflow: PAR-03. Workspace: VSchool_Parent_Guardian_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-03",
  "area": "access",
  "title": "Activate or recover account access",
  "phase": 2,
  "purpose": "institution trust mode + account-wide recovery policy",
  "steps": [
    {
      "title": "Account help",
      "help": "Use the recovery channel allowed by the school and every relevant stricter membership.",
      "fields": [
        {
          "name": "email",
          "label": "Account email",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "need",
          "label": "Help needed",
          "type": "select",
          "options": [
            "Activate invited account",
            "Recover password",
            "Mailbox no longer safe"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next step",
      "help": "A generic acknowledgement protects account existence.",
      "fields": [
        {
          "name": "understood",
          "label": "I will follow the verified instructions from the school.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent receives a safe acknowledgement or verified support route.",
  "invariant": "Global account recovery must not bypass a stricter institution. Recheck policy when issuing and consuming a token. Compromised-inbox recovery uses the verified owner route.",
  "recovery": "Expired/revoked/consumed/failed-delivery tokens fail safely. Do not send a second identity’s invitation to a newly entered mailbox.",
  "data": "Access token hash, delivery state, session invalidation and policy evidence; no secrets or raw tokens in logs.",
  "extension": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
