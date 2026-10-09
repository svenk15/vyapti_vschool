# WF-LEA-23 — Review staffing availability without private reasons

Source workflow: LEA-23. Workspace: VSchool_Principal_Leadership_Workflows. Source area: staff. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-23",
  "area": "staff",
  "title": "Review staffing availability without private reasons",
  "phase": 3,
  "trigger": "Principal checks whether the school day can be covered.",
  "actors": "Principal; authorized People + Timetable + Requests owner",
  "preconditions": "People/timetable availability projection; purpose-specific leadership grant.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose date and branch.",
      "result": "Show available/unavailable and relevant assignment coverage."
    },
    {
      "actor": "Principal",
      "action": "Open an uncovered occurrence.",
      "result": "No medical, payroll or private leave narrative."
    },
    {
      "actor": "Principal",
      "action": "Coordinate with eligible staff owner.",
      "result": "Availability is advisory until assignment conflict checks pass."
    },
    {
      "actor": "System / owner",
      "action": "Recheck published cover result.",
      "result": "Operational gap is resolved by owner evidence."
    }
  ],
  "fields": [
    {
      "name": "Date",
      "rule": "School-local date."
    },
    {
      "name": "Availability detail",
      "rule": "Minimum needed for cover."
    },
    {
      "name": "Action",
      "rule": "Coverage coordination, not staff-performance scoring."
    }
  ],
  "outcome": "Operational staffing view.",
  "exceptions": [
    "Missing availability data shown Unknown.",
    "A staff member working another branch is not presumed free."
  ],
  "authorization": "Availability oversight is not full HR-record access.",
  "reads": "People safe availability projection; dated teaching assignments.",
  "writes": "Optional cover request only.",
  "acceptance": "Private leave reason cannot appear in a list, export or notification.",
  "priority": "Later",
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
