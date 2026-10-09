# WF-SA-49 — Generate invoices and collect payment

Source workflow: SA-49. Workspace: VSchool_School_Admin_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-49",
  "module": "finance",
  "title": "Generate invoices and collect payment",
  "phase": 5,
  "capability": "finance.invoice / finance.collect (delegated)",
  "steps": [
    {
      "title": "Invoice preview",
      "help": "Review payer, lines, currency and due date.",
      "fields": [
        {
          "name": "student",
          "label": "Student",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "due",
          "label": "Due date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "plan",
          "label": "Fee plan",
          "type": "select",
          "options": [
            "Approved tuition plan"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Collection",
      "help": "Show actual payment evidence and allocation.",
      "fields": [
        {
          "name": "method",
          "label": "Method",
          "type": "select",
          "options": [
            "Record verified bank transfer",
            "Record cash with receipt authority",
            "Hosted payment link"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reference",
          "label": "Payment reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Posted invoice, verified payment and receipt retain separate states.",
  "rule": "A browser success return is not proof of payment; callbacks authenticate and deduplicate.",
  "edge": "Unknown outcomes are reconciled before retrying; partial payment leaves an explicit balance.",
  "data": "Finance Invoice/Line snapshots, Payment, Allocation and Receipt, with unique provider/reference constraints and audit."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
