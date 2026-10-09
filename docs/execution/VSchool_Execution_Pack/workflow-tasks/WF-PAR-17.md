# WF-PAR-17 — Resolve an undelivered message

Source workflow: PAR-17. Workspace: VSchool_Parent_Guardian_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-17",
  "area": "communication",
  "title": "Resolve an undelivered message",
  "phase": 2,
  "purpose": "own message read + live conversation grant",
  "steps": [
    {
      "title": "Delivery status",
      "help": "A failed delivery does not become a sent message.",
      "fields": [
        {
          "name": "reference",
          "label": "Message reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Recovery",
      "help": "Recheck status before repeating an uncertain request.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Check current status",
            "Retry a confirmed failed delivery",
            "Contact the school through an approved channel"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent knows whether a message was accepted, failed or remains unknown.",
  "invariant": "Keep one stable message identity; delivery attempts are separate and grant-checked. Never retry to a removed recipient.",
  "recovery": "Provider acknowledgement is not human reading. Show a safe failure reason without delivery credentials.",
  "data": "Message intent → DeliveryAttempt status, idempotent retry policy and current ConversationGrant.",
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
