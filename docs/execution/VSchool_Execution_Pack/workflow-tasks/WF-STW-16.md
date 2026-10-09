# WF-STW-16 — Recover an uncertain submission

Source workflow: STW-16. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-16",
  "area": "assignments",
  "title": "Recover an uncertain submission",
  "phase": 3,
  "goal": "Find out whether the school accepted the work.",
  "steps": [
    {
      "title": "See confirmation pending",
      "instruction": "Preserve unchanged intent; disable a new submit or context switch."
    },
    {
      "title": "Check status",
      "instruction": "Reauthorize and query same command key before retry; exact replay returns the same receipt."
    }
  ],
  "outcome": "Existing accepted receipt or verified safe retry.",
  "invariant": "A timeout is not a failure; never create a second attempt speculatively.",
  "recovery": "Still unknown stays pending with help/reference; no false success.",
  "data": "Scoped CommandReceipt + submission attempt; immutable payload fingerprint.",
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
