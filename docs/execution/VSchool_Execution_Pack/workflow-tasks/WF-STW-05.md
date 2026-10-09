# WF-STW-05 — Handle expired or withdrawn access

Source workflow: STW-05. Workspace: VSchool_Student_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-05",
  "area": "access",
  "title": "Handle expired or withdrawn access",
  "phase": 2,
  "goal": "Understand why a workspace is unavailable.",
  "steps": [
    {
      "title": "See safe state",
      "instruction": "Clear protected content and explain sign-in or school help is needed."
    },
    {
      "title": "Resume safely",
      "instruction": "Reauthenticate and recheck current assignment before recovering work."
    }
  ],
  "outcome": "Authorized continuation or safe support route.",
  "invariant": "Historical access does not authorize current reads, downloads or status lookup.",
  "recovery": "Unknown submissions keep a reference; do not claim a failure or discard evidence.",
  "data": "Session + account status + current account link/enrollment; command receipt.",
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
