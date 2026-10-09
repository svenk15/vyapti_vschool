# WF-STW-06 — Plan my school day

Source workflow: STW-06. Workspace: VSchool_Student_Design. Source area: day. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-06",
  "area": "day",
  "title": "Plan my school day",
  "phase": 3,
  "goal": "Know the next class and the next deliberate action.",
  "steps": [
    {
      "title": "Review today",
      "instruction": "Show school-local date, next class and a short prioritized list of due work."
    },
    {
      "title": "Open an action",
      "instruction": "Go directly to published class details, assignment, returned feedback or notice."
    }
  ],
  "outcome": "Student reaches one clear next task.",
  "invariant": "No engagement score, anxiety countdown, class rank or fabricated completion percentage.",
  "recovery": "Empty timetable and nothing-due states remain useful; display last successful refresh.",
  "data": "Published ScheduleOccurrence + student Assignment projections + returned Feedback.",
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
