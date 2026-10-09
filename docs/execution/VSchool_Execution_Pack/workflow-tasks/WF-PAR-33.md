# WF-PAR-33 — Track or withdraw a school request

Source workflow: PAR-33. Workspace: VSchool_Parent_Guardian_Design. Source area: requests. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-33",
  "area": "requests",
  "title": "Track or withdraw a school request",
  "phase": 2,
  "purpose": "own request read/withdraw + live purpose",
  "steps": [
    {
      "title": "Request history",
      "help": "Read only requests this account may see.",
      "fields": [
        {
          "name": "reference",
          "label": "Request reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Action",
      "help": "Withdrawing a request is not deleting its history.",
      "fields": [
        {
          "name": "action",
          "label": "Next action",
          "type": "select",
          "options": [
            "Read status and school response",
            "Withdraw if still pending"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent sees the current owner decision and eligible next actions.",
  "invariant": "A co-guardian does not automatically see another guardian’s private request. Use originator plus purpose policy, not household equality.",
  "recovery": "Concurrent review, completed request or removed authority returns a safe conflict instead of overwriting the decision.",
  "data": "FamilyRequest/version + eligible actor visibility; append a transition and preserve owner response.",
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
