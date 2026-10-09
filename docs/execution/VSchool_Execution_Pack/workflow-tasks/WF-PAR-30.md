# WF-PAR-30 — Raise a fee or refund query

Source workflow: PAR-30. Workspace: VSchool_Parent_Guardian_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-30",
  "area": "finance",
  "title": "Raise a fee or refund query",
  "phase": 5,
  "purpose": "finance.query within payer scope",
  "steps": [
    {
      "title": "Query context",
      "help": "A request is not an approved refund or adjustment.",
      "fields": [
        {
          "name": "reference",
          "label": "Invoice or receipt reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "kind",
          "label": "Query type",
          "type": "select",
          "options": [
            "Charge clarification",
            "Possible duplicate payment",
            "Refund request"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Explain",
      "help": "Share only the transaction reference the school needs.",
      "fields": [
        {
          "name": "note",
          "label": "Query details",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A financial query is tracked separately from settlement and approval.",
  "invariant": "No parent refund execution, auto-writeoff or trusted uploaded payment screenshot. Authorized finance review controls any ledger effect.",
  "recovery": "Duplicate queries link to existing case. Keep Pending review distinct from Refund initiated and Refunded.",
  "data": "FinanceCase references invoice/payment; approval, provider refund event and ledger adjustment are separate owner transactions.",
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
