# WF-STW-15 — Review and submit work

Source workflow: STW-15. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-15",
  "area": "assignments",
  "title": "Review and submit work",
  "phase": 3,
  "goal": "Make one deliberate, confirmed submission.",
  "steps": [
    {
      "title": "Review work",
      "instruction": "Show assignment revision, answer, ready files, effective due date and late status."
    },
    {
      "title": "Submit assignment",
      "instruction": "Recheck current rights, assignment policy and draft version; commit one attempt and receipt."
    }
  ],
  "outcome": "Immutable attempt reference, number and accepted time.",
  "invariant": "No implicit submit on upload/save; no mutable file reference that changes an accepted attempt.",
  "recovery": "Validation preserves draft; concurrent policy/draft change requires renewed review.",
  "data": "SubmissionAttempt snapshot + attachment snapshots + command receipt + safe audit.",
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
