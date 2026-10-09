# WF-LEA-05 — Review my school today

Source workflow: LEA-05. Workspace: VSchool_Principal_Leadership_Workflows. Source area: daily. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-05",
  "area": "daily",
  "title": "Review my school today",
  "phase": 1,
  "trigger": "Start of day or return to the workspace.",
  "actors": "Principal",
  "preconditions": "Branch-scoped source projections are authorized; school date/time and data freshness known.",
  "steps": [
    {
      "actor": "System",
      "action": "Show branch, school-local date and last successful refresh.",
      "result": "No ambiguous institution-wide totals."
    },
    {
      "actor": "Principal",
      "action": "Review a short prioritized list.",
      "result": "Registers due, uncovered sessions and assigned decisions appear only when those modules exist."
    },
    {
      "actor": "Principal",
      "action": "Open one item.",
      "result": "Filters, cutoff, source records and permitted action carry through."
    },
    {
      "actor": "System",
      "action": "Refresh after a source change.",
      "result": "Resolved items update without pretending every related follow-up is closed."
    }
  ],
  "fields": [
    {
      "name": "Date",
      "rule": "Defaults to school today; historical dates explicit."
    },
    {
      "name": "Priority",
      "rule": "Operational deadline/severity rule, never a pupil or teacher risk score."
    }
  ],
  "outcome": "One clear next action grounded in evidence.",
  "exceptions": [
    "No items: show No action required for this scope, plus data cutoff.",
    "Missing module: omit its widget; do not show zero or an upsell."
  ],
  "authorization": "Home projection inherits each source capability; aggregated cards do not create drill-down authority.",
  "reads": "Authorized session/decision/follow-up projections and as-of metadata.",
  "writes": "None.",
  "acceptance": "Every number has a definition and opens the same scoped record set.",
  "priority": "First release",
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
