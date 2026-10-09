# WF-STW-31 — Review published events and assessments

Source workflow: STW-31. Workspace: VSchool_Student_Design. Source area: calendar. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-31",
  "area": "calendar",
  "title": "Review published events and assessments",
  "phase": 3,
  "goal": "Plan around the school schedule.",
  "steps": [
    {
      "title": "Browse agenda",
      "instruction": "Show school-local dates, permitted event details and assessment schedule."
    },
    {
      "title": "Open event",
      "instruction": "Read changes, venue, participation requirements and contact."
    }
  ],
  "outcome": "Clear upcoming event context.",
  "invariant": "Draft assessment schedules remain hidden; published changes are visible.",
  "recovery": "Cancelled events are labelled and no longer accept interest actions.",
  "data": "CalendarEvent publication + audience + assessment schedule projection.",
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
