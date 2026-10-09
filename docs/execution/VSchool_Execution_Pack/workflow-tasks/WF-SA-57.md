# WF-SA-57 — Receive, issue or return stock and assets

Source workflow: SA-57. Workspace: VSchool_School_Admin_Design. Source area: facilities. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-57",
  "module": "facilities",
  "title": "Receive, issue or return stock and assets",
  "phase": 6,
  "capability": "inventory.manage (delegated)",
  "steps": [
    {
      "title": "Item and movement",
      "help": "Separate quantity stock from individually tracked assets.",
      "fields": [
        {
          "name": "item",
          "label": "Item / asset reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "movement",
          "label": "Movement",
          "type": "select",
          "options": [
            "Receive",
            "Issue",
            "Return",
            "Custody transfer"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "quantity",
          "label": "Quantity",
          "type": "number",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Custody evidence",
      "help": "Track who received it and why.",
      "fields": [
        {
          "name": "custodian",
          "label": "Authorized custodian",
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
  "outcome": "An append-only movement and current custody state are available.",
  "rule": "No negative stock unless explicitly approved by a versioned policy; cross-branch transfer requires both scopes.",
  "edge": "Concurrent issue or missing custody acknowledgement leaves a reviewable exception.",
  "data": "Inventory StockMovement ledger and Asset/CustodyAssignment; owner transaction controls available stock."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
