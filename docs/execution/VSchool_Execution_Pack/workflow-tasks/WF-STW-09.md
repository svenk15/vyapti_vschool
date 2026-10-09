# WF-STW-09 — Open an assigned class space

Source workflow: STW-09. Workspace: VSchool_Student_Design. Source area: day. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-09",
  "area": "day",
  "title": "Open an assigned class space",
  "phase": 3,
  "goal": "Find course-specific work and resources.",
  "steps": [
    {
      "title": "Choose my class",
      "instruction": "Show only current assigned offerings, grouped by subject."
    },
    {
      "title": "Review class",
      "instruction": "Open published work, permitted resources and returned feedback."
    }
  ],
  "outcome": "Own course material only.",
  "invariant": "No class roster, classmates’ marks, guardian contacts or private teacher notes.",
  "recovery": "Ended enrollment follows explicit historical-access policy; default deny new downloads.",
  "data": "Offering + dated Enrollment/AssignmentAudience; minimized student projection.",
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
