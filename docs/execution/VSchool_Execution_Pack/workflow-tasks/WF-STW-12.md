# WF-STW-12 — Open learning resources

Source workflow: STW-12. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-12",
  "area": "assignments",
  "title": "Open learning resources",
  "phase": 3,
  "goal": "Read authorized material safely.",
  "steps": [
    {
      "title": "Choose resource",
      "instruction": "Show title, type and size before download."
    },
    {
      "title": "Open or download",
      "instruction": "Reauthorize resource access; use short-lived scoped links only in implementation."
    }
  ],
  "outcome": "Permitted resource delivered.",
  "invariant": "No arbitrary URL fetching; no unscanned/private resource exposure.",
  "recovery": "Expired download retries through authorization, not reuse of a permanent object URL.",
  "data": "Learning resource link + file asset scan state + owner authorization.",
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
