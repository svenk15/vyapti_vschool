# WF-OP-J05 — Save and resume a draft

Source workflow: OP-J05. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J05",
  "name": "Save and resume a draft",
  "entry": "Onboarding or Institutions → My drafts",
  "steps": "Save partial values; return later to My drafts; Resume returns to the saved step and restores values.",
  "outcome": "Draft data, step, owner, version and last-saved time persist; no institution exists until successful submission.",
  "alternate_states": "Empty draft disabled; storage/save failure; draft unavailable; other owner; completed or discarded draft; stale draft version.",
  "implementation_contract": "Draft owner is the default editor. Approved reassignment is a separate workflow; do not infer shared visibility from operator status. Reauthorize on read, resume and submit."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
