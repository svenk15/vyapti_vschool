# WF-LEA-16 — Review timetable conflicts and uncovered classes

Source workflow: LEA-16. Workspace: VSchool_Principal_Leadership_Workflows. Source area: academics. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-16",
  "area": "academics",
  "title": "Review timetable conflicts and uncovered classes",
  "phase": 3,
  "trigger": "A class is uncovered or a published schedule changes.",
  "actors": "Principal; authorized Academics + Learning + Assessments owner",
  "preconditions": "Published recurring timetable and coverage owner; manual attendance sessions alone are insufficient.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open affected period and branch.",
      "result": "List published uncovered/conflicting occurrences with evidence."
    },
    {
      "actor": "Principal",
      "action": "Inspect the exact occurrence.",
      "result": "Show current assignment and impact without private staff absence reasons."
    },
    {
      "actor": "Principal",
      "action": "Route to timetable coordinator or open delegated cover action.",
      "result": "Eligible staff and conflict checks come from the owner."
    },
    {
      "actor": "System / owner",
      "action": "Confirm owner result.",
      "result": "Publication/version refreshes; related attendance remains separate."
    }
  ],
  "fields": [
    {
      "name": "Period",
      "rule": "School dates and times."
    },
    {
      "name": "Occurrence",
      "rule": "Exact published version."
    },
    {
      "name": "Proposed action",
      "rule": "Owner-defined cover/change request."
    }
  ],
  "outcome": "Resolved cover arrangement or a traceable coordination request.",
  "exceptions": [
    "Concurrent timetable edit requires refreshed review.",
    "No eligible cover: show unresolved status and escalation, not an invented allocation."
  ],
  "authorization": "No general timetable-edit or attendance-mark authority from a principal role.",
  "reads": "Published occurrences; dated teacher eligibility and assignment; conflict projection.",
  "writes": "Owner-specific cover request/decision only.",
  "acceptance": "Assigned substitute cannot clash with another occurrence; cancelled sessions remain traceable.",
  "priority": "Later",
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
