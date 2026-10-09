# WF-PAR-29 — Read receipts and payment history

Source workflow: PAR-29. Workspace: VSchool_Parent_Guardian_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-29",
  "area": "finance",
  "title": "Read receipts and payment history",
  "phase": 5,
  "purpose": "finance.receipt.read for explicit payer scope",
  "steps": [
    {
      "title": "Payment history",
      "help": "Filter by the permitted child and issuing school.",
      "fields": [
        {
          "name": "state",
          "label": "Payment state",
          "type": "select",
          "options": [
            "Settled payments",
            "Pending attempts",
            "Failed attempts"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Receipt",
      "help": "A receipt belongs to a confirmed payment allocation.",
      "fields": [
        {
          "name": "reference",
          "label": "Receipt or order reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent can reconcile the invoice and a verified receipt.",
  "invariant": "Pending orders do not produce settled receipts. A receipt identifies currency, issuer, amount, date and masked references only.",
  "recovery": "Refunds/adjustments show a linked traceable event; a PDF download failure does not repeat the payment.",
  "data": "Settled PaymentAllocation → Receipt/version plus safe PaymentAttempt history; downloads reauthorize.",
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
