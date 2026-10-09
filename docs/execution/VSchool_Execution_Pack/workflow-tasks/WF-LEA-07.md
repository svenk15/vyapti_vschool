# WF-LEA-07 — Run the weekly leadership review

Source workflow: LEA-07. Workspace: VSchool_Principal_Leadership_Workflows. Source area: daily. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-07",
  "area": "daily",
  "title": "Run the weekly leadership review",
  "phase": 2,
  "trigger": "Scheduled school review meeting.",
  "actors": "Principal; authorized coordinators",
  "preconditions": "Approved meeting purpose and source access; follow-up coordination enabled for actions.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose period and permitted scope.",
      "result": "Brief shows coverage, outstanding actions and relevant published changes."
    },
    {
      "actor": "Group",
      "action": "Inspect a concern and agree an action.",
      "result": "Owner, due time, source reference and completion evidence are explicit."
    },
    {
      "actor": "Principal",
      "action": "Confirm action list.",
      "result": "Each action is routed to its owning team; recipients are previewed."
    },
    {
      "actor": "Principal",
      "action": "Review carried-over actions next week.",
      "result": "Reassignment and verified outcomes remain traceable."
    }
  ],
  "fields": [
    {
      "name": "Period",
      "rule": "Explicit start/end and school timezone."
    },
    {
      "name": "Action owner",
      "rule": "Current eligible staff identity."
    },
    {
      "name": "Due time",
      "rule": "School-local input converted to an instant."
    },
    {
      "name": "Completion evidence",
      "rule": "Source-state condition or permitted attachment reference."
    }
  ],
  "outcome": "Actionable review brief and owned follow-ups.",
  "exceptions": [
    "No reliable comparison period: omit trend claim.",
    "Action falls outside participants’ authority: hand off instead of exposing private records."
  ],
  "authorization": "A meeting participant does not gain the principal’s source privileges.",
  "reads": "Approved report snapshots and follow-up history.",
  "writes": "Internal follow-up records and approved meeting action references only.",
  "acceptance": "Next review distinguishes open, overdue, evidence-ready and verified closed actions.",
  "priority": "Later",
  "extension": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
