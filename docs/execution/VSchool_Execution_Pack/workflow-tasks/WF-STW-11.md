# WF-STW-11 — Understand an assignment

Source workflow: STW-11. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-11",
  "area": "assignments",
  "title": "Understand an assignment",
  "phase": 3,
  "goal": "Know what is required before starting.",
  "steps": [
    {
      "title": "Read requirements",
      "instruction": "Show instructions, teacher, subject, due time/timezone, submission modes and published rubric."
    },
    {
      "title": "Choose action",
      "instruction": "Start/resume draft or open the exact submitted attempt."
    }
  ],
  "outcome": "Requirements and next action are clear.",
  "invariant": "Policy revision is visible and rechecked on submission.",
  "recovery": "Withdrawn/unpublished assignment blocks new writes and links to school help.",
  "data": "Assignment published version + audience + SubmissionPolicy + criteria.",
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
