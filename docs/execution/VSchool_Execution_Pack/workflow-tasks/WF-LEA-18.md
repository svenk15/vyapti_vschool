# WF-LEA-18 — Review feedback awaiting return

Source workflow: LEA-18. Workspace: VSchool_Principal_Leadership_Workflows. Source area: academics. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-18",
  "area": "academics",
  "title": "Review feedback awaiting return",
  "phase": 3,
  "trigger": "Accepted learner work has not received returned feedback within school policy.",
  "actors": "Principal; authorized Academics + Learning + Assessments owner",
  "preconditions": "Learning oversight and an approved turnaround definition; teacher draft privacy preserved.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Select period and subject.",
      "result": "Show accepted attempts awaiting student-facing feedback."
    },
    {
      "actor": "Principal",
      "action": "Inspect elapsed time and source policy.",
      "result": "Calendar/working-day basis and cutoff are visible."
    },
    {
      "actor": "Principal",
      "action": "Coordinate with the subject lead.",
      "result": "No private draft comments or automatic staff performance verdict."
    },
    {
      "actor": "System / owner",
      "action": "Track returned publication.",
      "result": "Fresh evidence supports follow-up verification."
    }
  ],
  "fields": [
    {
      "name": "Turnaround rule",
      "rule": "Versioned school policy; no hidden hardcoded deadline."
    },
    {
      "name": "Assignee",
      "rule": "Eligible subject coordinator."
    },
    {
      "name": "Note",
      "rule": "Operational, not evaluative personal data."
    }
  ],
  "outcome": "Clear feedback backlog with owned follow-up.",
  "exceptions": [
    "Returned then withdrawn feedback is shown under owner policy, not counted as permanently delivered.",
    "Incomplete timestamps block unsupported average."
  ],
  "authorization": "Feedback oversight is separate from permission to read full learner work.",
  "reads": "Accepted attempt timestamp; returned feedback publication timestamps/state.",
  "writes": "Optional coordination record; no teacher feedback edits.",
  "acceptance": "Teacher Save private draft does not clear Awaiting return.",
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
