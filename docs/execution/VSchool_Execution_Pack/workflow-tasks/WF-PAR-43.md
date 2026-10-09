# WF-PAR-43 — Review child library loans

Source workflow: PAR-43. Workspace: VSchool_Parent_Guardian_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-43",
  "area": "services",
  "title": "Review child library loans",
  "phase": 6,
  "purpose": "library.read_child; renewal request if granted",
  "steps": [
    {
      "title": "Loans",
      "help": "View only this child’s lending records.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Current loans",
            "Due dates and return status"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next action",
      "help": "Renewal depends on library policy and availability.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Request renewal",
            "Ask about a return discrepancy"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent sees loan status and the owner’s renewal/query outcome.",
  "invariant": "Do not infer permission to pay or adjust a fine from loan visibility. No other borrower history.",
  "recovery": "Concurrent return/hold/renewal limit is a clear conflict, not a silently extended date.",
  "data": "LibraryLoan/version → copy/title plus own RenewalRequest; Finance handles authorized charges separately.",
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
