# WF-TEA-39 — Borrow, reserve or renew a resource

Source workflow: TEA-39. Workspace: VSchool_Teacher_Design. Source area: resources. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-39",
  "area": "resources",
  "title": "Borrow, reserve or renew a resource",
  "phase": 6,
  "capability": "library.self_service for own borrower identity",
  "entry": "resources",
  "steps": [
    {
      "title": "Find resource",
      "help": "Search permitted catalog items, not other borrowers’ history.",
      "fields": [
        {
          "name": "title",
          "label": "Title or copy reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Request",
      "help": "Current eligibility and hold policy determine availability.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Request checkout",
            "Reserve available title",
            "Request renewal"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher sees their own loan/reservation and due date.",
  "rule": "A request is not a confirmed checkout until the circulation owner records it. No authority to waive fines or edit another borrower.",
  "recovery": "Already loaned copy, hold queue, renewal limit and lost item have explicit outcomes.",
  "data": "Library CatalogItem/Copy/Loan/Reservation read contracts; teacher requests are scoped to own borrower identity.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
