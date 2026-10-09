# WF-SA-03 — Switch branch or sign out

Source workflow: SA-03. Workspace: VSchool_School_Admin_Design. Source area: home. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-03",
  "module": "home",
  "title": "Switch branch or sign out",
  "phase": 1,
  "capability": "active target-branch grant",
  "steps": [
    {
      "title": "Destination",
      "help": "Your current branch remains active until you confirm.",
      "fields": [
        {
          "name": "destination",
          "label": "Destination",
          "type": "select",
          "options": [
            "Indiranagar",
            "Whitefield",
            "Sign out"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Leave this workspace",
      "help": "Unsaved changes must be saved or explicitly discarded before continuing.",
      "fields": [
        {
          "name": "leave",
          "label": "I have reviewed any unsaved work.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "New context is resolved on the server, or the session is signed out.",
  "rule": "Clear scoped caches and protected drafts; reauthorize the destination and never reuse the previous branch’s data.",
  "edge": "If the target grant was revoked, keep the old context if still authorized and show a safe explanation.",
  "data": "Access session/context read; revoke session on sign-out. No business table writes."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
