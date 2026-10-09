# WF-PAR-50 — Review sessions and sign out

Source workflow: PAR-50. Workspace: VSchool_Parent_Guardian_Design. Source area: account. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-50",
  "area": "account",
  "title": "Review sessions and sign out",
  "phase": 2,
  "purpose": "own session management",
  "steps": [
    {
      "title": "My account",
      "help": "Review safe account and current session information.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Account details",
            "Current session",
            "Other sessions if supported"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "End access",
      "help": "Keep Sign out separate from identity details.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Sign out of this session",
            "Use verified account recovery"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent can end the current session and understand permitted security actions.",
  "invariant": "Other-session revocation is an extension unless already supported. Clear protected child view state; browser back must not reveal private data after real sign-out.",
  "recovery": "Unsent drafts require a clear decision. Persisted pending requests/payments retain their owner references without exposing them signed out.",
  "data": "Access session revoke + authenticated cache invalidation; no token material in the UI.",
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
