# WF-SA-50 — Resolve reconciliation, adjustment or refund

Source workflow: SA-50. Workspace: VSchool_School_Admin_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-50",
  "module": "finance",
  "title": "Resolve reconciliation, adjustment or refund",
  "phase": 5,
  "capability": "finance.reconcile / refund.approve (delegated)",
  "steps": [
    {
      "title": "Exception",
      "help": "Open the exact ledger and provider evidence.",
      "fields": [
        {
          "name": "case",
          "label": "Case",
          "type": "select",
          "options": [
            "Unmatched settlement",
            "Credit adjustment",
            "Refund request"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review approval",
      "help": "Posted history is immutable; refunds reserve available value.",
      "fields": [
        {
          "name": "reference",
          "label": "Approval / settlement reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An authorized adjustment or reconciled outcome appends to the ledger.",
  "rule": "Do not edit posted amounts or double-refund an uncertain provider request.",
  "edge": "Timeout, duplicate callback, insufficient refundable balance and rejected approval have explicit outcomes.",
  "data": "Finance CreditNote, RefundReservation, Settlement and append-only ledger entries; idempotent provider seam."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
