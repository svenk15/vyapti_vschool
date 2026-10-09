# WF-LEA-40 — Compare branches responsibly

Source workflow: LEA-40. Workspace: VSchool_Principal_Leadership_Workflows. Source area: reports. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-40",
  "area": "reports",
  "title": "Compare branches responsibly",
  "phase": 2,
  "trigger": "Institution leader has explicit cross-branch analytics authority.",
  "actors": "Principal; authorized Reporting + source owners owner",
  "preconditions": "Comparable definitions, time basis, granted branch set and suppression rules.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Select authorized branches and period.",
      "result": "No implicit all-institution scope."
    },
    {
      "actor": "Principal",
      "action": "Review comparability.",
      "result": "Show module availability, calendar, coverage and definition differences."
    },
    {
      "actor": "Principal",
      "action": "Compare like-for-like metrics.",
      "result": "Display counts/denominators; no misleading simple average of percentages."
    },
    {
      "actor": "System / owner",
      "action": "Open a branch only where detailed authority exists.",
      "result": "A summary grant does not create full operational access."
    }
  ],
  "fields": [
    {
      "name": "Branch set",
      "rule": "Explicit allowed set."
    },
    {
      "name": "Metric",
      "rule": "Compatible definition version."
    },
    {
      "name": "Comparison window",
      "rule": "Normalized school-day/period policy, visibly documented."
    }
  ],
  "outcome": "Qualified comparison with limitations visible.",
  "exceptions": [
    "Different calendars or missing data: show Not comparable rather than rank.",
    "Partial branch grant loss: recompute safely without revealing withheld totals."
  ],
  "authorization": "Cross-branch analytics, branch detail and pupil evidence are separate capabilities.",
  "reads": "Authorized aggregate snapshots and definition metadata.",
  "writes": "None, unless an explicitly authorized report export is requested.",
  "acceptance": "Weighted total uses underlying counts; unavailable branch is never treated as zero.",
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
