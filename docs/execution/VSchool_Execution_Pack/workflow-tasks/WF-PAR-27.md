# WF-PAR-27 — Pay an authorized invoice

Source workflow: PAR-27. Workspace: VSchool_Parent_Guardian_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-27",
  "area": "finance",
  "title": "Pay an authorized invoice",
  "phase": 5,
  "purpose": "finance.pay + explicit payer mandate",
  "steps": [
    {
      "title": "Payment review",
      "help": "Confirm the invoice, child, merchant institution and exact amount.",
      "fields": [
        {
          "name": "invoice",
          "label": "Invoice",
          "type": "select",
          "options": [
            "INV-GW-2026-104 · Tuition"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "amount",
          "label": "I have checked the displayed currency and exact amount.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Payment handoff",
      "help": "A provider redirect is not proof of settlement.",
      "fields": [
        {
          "name": "provider",
          "label": "I understand that the receipt is issued only after verified confirmation.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "One payment order is created; the result is Processing, Paid, Failed or Unknown until reconciled.",
  "invariant": "Server computes amount and issuer from the current invoice. Stable idempotency key, invoice version and payable-state guard prevent duplicate orders. Never collect card details in this portal.",
  "recovery": "Changed balance requires re-review. Interrupted redirect or pending provider outcome uses Check status before any new payment.",
  "data": "PaymentOrder → PaymentAttempt → verified provider event/reconciliation → ledger allocation/receipt in Finance. Prototype never contacts a provider.",
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
