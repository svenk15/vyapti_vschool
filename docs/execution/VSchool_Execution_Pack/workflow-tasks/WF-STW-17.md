# WF-STW-17 — Submit under late or extended rules

Source workflow: STW-17. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-17",
  "area": "assignments",
  "title": "Submit under late or extended rules",
  "phase": 3,
  "goal": "Understand whether work can still be accepted.",
  "steps": [
    {
      "title": "Read effective deadline",
      "instruction": "Show school-local deadline, explicit extension if granted and late policy."
    },
    {
      "title": "Review allowed action",
      "instruction": "Allow late submission only under current policy; otherwise offer extension/support request."
    }
  ],
  "outcome": "Accepted on-time/late attempt or a clear closed state.",
  "invariant": "Server clock and approved per-student extension decide lateness; requesting one never grants it.",
  "recovery": "A deadline crossing during review forces policy re-evaluation, preserving work.",
  "data": "Assignment policy + approved extension + server received_at and effective_due_at.",
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
