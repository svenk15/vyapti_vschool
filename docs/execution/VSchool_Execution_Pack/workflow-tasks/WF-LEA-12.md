# WF-LEA-12 — Review factual pupil attendance patterns

Source workflow: LEA-12. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-12",
  "area": "attendance",
  "title": "Review factual pupil attendance patterns",
  "phase": 2,
  "trigger": "School policy calls for a review of recorded absence patterns.",
  "actors": "Principal or attendance lead; authorized student support coordinator",
  "preconditions": "Explicit pupil-level attendance purpose; defined date window and outcome rules.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose recorded period and approved review criterion.",
      "result": "Show source coverage before any pattern list."
    },
    {
      "actor": "System",
      "action": "Group factual submitted outcomes by permitted pupil.",
      "result": "Count sessions/dates explicitly; no speculative risk label."
    },
    {
      "actor": "Principal",
      "action": "Open the record evidence.",
      "result": "Separate late, absent, excused and unsubmitted sessions."
    },
    {
      "actor": "Principal",
      "action": "Route a support follow-up if warranted.",
      "result": "Guardian contact/relationship and care information require their own grants."
    }
  ],
  "fields": [
    {
      "name": "Window",
      "rule": "Bounded school dates."
    },
    {
      "name": "Criterion",
      "rule": "Approved rule with version; no secret default scoring."
    },
    {
      "name": "Follow-up purpose",
      "rule": "Attendance support; no inferred medical/family reason."
    }
  ],
  "outcome": "Evidence-based human review and authorized next action.",
  "exceptions": [
    "Incomplete registers: disclose missing coverage; do not manufacture absence.",
    "Restriction on pupil detail: show authorized aggregate or deny; do not expose identity in export."
  ],
  "authorization": "Attendance purpose is not health, safeguarding or unrestricted family access.",
  "reads": "Submitted session outcomes; frozen roster; scoped student summary; rule version.",
  "writes": "Only an approved coordination/support request if confirmed.",
  "acceptance": "Same pupil with multiple absent sessions is counted as one pupil only when metric explicitly says unique pupils.",
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
