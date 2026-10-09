# WF-STW-08 — Respond to a changed class

Source workflow: STW-08. Workspace: VSchool_Student_Design. Source area: day. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-08",
  "area": "day",
  "title": "Respond to a changed class",
  "phase": 3,
  "goal": "Notice a schedule change without confusing it with attendance.",
  "steps": [
    {
      "title": "Read change",
      "instruction": "Show old/new room or time with effective date and published notice."
    },
    {
      "title": "View current class",
      "instruction": "Navigate to the current occurrence; do not silently open cancelled links."
    }
  ],
  "outcome": "Current class context with visible change.",
  "invariant": "A cancellation never manufactures an attendance outcome.",
  "recovery": "Stale links resolve current published version or a safe cancelled state.",
  "data": "Schedule revision + occurrence + scoped communication update.",
  "extension": false,
  "timetable_contract": {
    "release": "TT-01",
    "owner": "academics / timetable",
    "entry": "timetable",
    "specification": "docs/timetable/README.md",
    "phase": 3,
    "implementation": "NOT_ASSESSED"
  }
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
