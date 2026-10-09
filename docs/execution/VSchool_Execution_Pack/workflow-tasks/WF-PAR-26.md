# WF-PAR-26 — Review a child’s fee invoice

Source workflow: PAR-26. Workspace: VSchool_Parent_Guardian_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-26",
  "area": "finance",
  "title": "Review a child’s fee invoice",
  "phase": 5,
  "purpose": "finance.read for explicit child/payer scope",
  "steps": [
    {
      "title": "Invoice",
      "help": "Review the issuing institution, invoice and currency.",
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
        }
      ]
    },
    {
      "title": "Breakdown",
      "help": "Distinguish charges, adjustments, receipts and outstanding balance.",
      "fields": [
        {
          "name": "next",
          "label": "Next action",
          "type": "select",
          "options": [
            "Review line items",
            "Read payment history",
            "Query the school office"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The payer understands the exact payable balance for one issuing institution.",
  "invariant": "Guardian status alone does not grant fee or payer access. No cross-school combined basket. Never expose another payer’s private banking details.",
  "recovery": "Disputed/adjusted invoice, stale balance or disabled online payment remains reviewable only under current grant.",
  "data": "Finance Invoice/version → line items/adjustments → allocated settled payments. All money uses currency and exact minor units.",
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
