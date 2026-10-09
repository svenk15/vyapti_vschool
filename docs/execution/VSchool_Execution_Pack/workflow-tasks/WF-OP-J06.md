# WF-OP-J06 — Discard or finish a draft

Source workflow: OP-J06. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J06",
  "name": "Discard or finish a draft",
  "entry": "My drafts → Discard, or final submission",
  "steps": "Confirm discarding unfinished setup. On successful creation, mark the source draft completed and link its institution.",
  "outcome": "Discarded/completed drafts leave the active drafts list; existing institutions never change on draft discard.",
  "alternate_states": "Double discard, concurrent submission, stale version and permission denial.",
  "implementation_contract": "Soft lifecycle transitions with metadata-only evidence. Do not use draft deletion as a cascade into production records."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
