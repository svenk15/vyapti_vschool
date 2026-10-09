# WF-PAR-28 — Resolve an uncertain payment

Source workflow: PAR-28. Workspace: VSchool_Parent_Guardian_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-28",
  "area": "finance",
  "title": "Resolve an uncertain payment",
  "phase": 5,
  "purpose": "own payment status + current payer/read purpose",
  "steps": [
    {
      "title": "Payment status",
      "help": "Do not ask the parent to pay again while the result is unknown.",
      "fields": [
        {
          "name": "order",
          "label": "Payment order reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Resolve",
      "help": "Provider confirmation must be verified by the server.",
      "fields": [
        {
          "name": "action",
          "label": "Next action",
          "type": "select",
          "options": [
            "Check payment status",
            "Contact support with reference"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The existing order is resolved or remains visibly pending without another charge attempt.",
  "invariant": "Client callback, screenshot or success query parameter cannot mark an invoice Paid. Only verified settlement evidence changes the ledger.",
  "recovery": "A pending order persists across navigation. Repeated status reads are safe; retries only after a definitive owner-approved failure state.",
  "data": "PaymentAttempt status and provider event deduplication; Finance ledger allocation is atomic and idempotent.",
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
