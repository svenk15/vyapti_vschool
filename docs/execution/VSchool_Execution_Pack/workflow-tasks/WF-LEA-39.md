# WF-LEA-39 — Drill into a metric and export permitted evidence

Source workflow: LEA-39. Workspace: VSchool_Principal_Leadership_Workflows. Source area: reports. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-39",
  "area": "reports",
  "title": "Drill into a metric and export permitted evidence",
  "phase": 1,
  "trigger": "Leader needs to explain a number or share an authorized report.",
  "actors": "Principal; authorized Reporting + source owners owner",
  "preconditions": "Versioned metric definition, bounded query and distinct export permission.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open a metric.",
      "result": "Carry filters, cutoff, denominator and scope into the evidence list."
    },
    {
      "actor": "Principal",
      "action": "Inspect records and exceptions.",
      "result": "Explain what was excluded and what is unavailable."
    },
    {
      "actor": "Principal",
      "action": "Preview export fields and scope.",
      "result": "Minimize personal data; rows are not broadened beyond the reviewed query."
    },
    {
      "actor": "System / owner",
      "action": "Generate and download via authorized route.",
      "result": "Report records definition/version/as-of; link expires and access is rechecked."
    }
  ],
  "fields": [
    {
      "name": "Metric/period",
      "rule": "Exact definition/version and cutoff."
    },
    {
      "name": "Columns",
      "rule": "Allowlisted for purpose."
    },
    {
      "name": "Export format",
      "rule": "Owner-supported CSV/PDF; safe spreadsheet-cell handling."
    }
  ],
  "outcome": "Explainable report and controlled evidence export.",
  "exceptions": [
    "Large export: bounded asynchronous job with explicit readiness, reauthorization and expiry if supported.",
    "Suppressed small groups must not be reconstructible via totals or overlapping filter exports."
  ],
  "authorization": "Aggregate access does not imply pupil-level rows or unrestricted bulk export.",
  "reads": "Authorized metric projection/source records, snapshot metadata.",
  "writes": "Report job/download audit; no source-record mutation.",
  "acceptance": "Report total agrees with the same scoped evidence snapshot.",
  "priority": "Later",
  "extension": "First release"
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
