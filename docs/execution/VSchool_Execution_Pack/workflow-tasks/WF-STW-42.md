# WF-STW-42 — Read my transport assignment

Source workflow: STW-42. Workspace: VSchool_Student_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-42",
  "area": "services",
  "title": "Read my transport assignment",
  "phase": 6,
  "goal": "Know my assigned service and published updates.",
  "steps": [
    {
      "title": "Open transport",
      "instruction": "Show assigned route/stop and school contact."
    },
    {
      "title": "Read update",
      "instruction": "Show published delay/cancellation text with time and source."
    }
  ],
  "outcome": "Current assigned service guidance.",
  "invariant": "No driver private data, other pupils, live location promise or self-changing pickup authority.",
  "recovery": "Unassigned/unavailable service routes to school; urgent change uses official contact.",
  "data": "TransportAssignment + published service update; no location stream.",
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
