# WF-STW-39 — Review my library loans

Source workflow: STW-39. Workspace: VSchool_Student_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-39",
  "area": "services",
  "title": "Review my library loans",
  "phase": 6,
  "goal": "Know what is borrowed and when it is due.",
  "steps": [
    {
      "title": "Open loans",
      "instruction": "Show own current loans, due dates and service policy."
    },
    {
      "title": "Open item",
      "instruction": "View return instructions and permitted renewal action."
    }
  ],
  "outcome": "Own circulation record.",
  "invariant": "No other borrower history; fines if shown are read-only service data, not payer authority.",
  "recovery": "Unreturned/corrected records use library-help path.",
  "data": "LibraryLoan + item catalogue + own borrower mapping.",
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
