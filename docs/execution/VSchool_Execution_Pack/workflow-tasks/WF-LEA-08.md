# WF-LEA-08 — Inspect register submission coverage

Source workflow: LEA-08. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-08",
  "area": "attendance",
  "title": "Inspect register submission coverage",
  "phase": 1,
  "trigger": "Principal wants to know whether expected registers have been received.",
  "actors": "Principal; Attendance owner",
  "preconditions": "Existing exact-session attendance contract and leadership read capability.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open Attendance oversight for a date/cutoff.",
      "result": "Show scheduled, due by cutoff, received and awaiting counts."
    },
    {
      "actor": "Principal",
      "action": "Open Awaiting submission.",
      "result": "Rows are exact eligible sessions, not absent pupils."
    },
    {
      "actor": "Principal",
      "action": "Inspect a session.",
      "result": "Show scheduled teacher, class, time, current status and last update."
    },
    {
      "actor": "System",
      "action": "Re-read before exposing any action.",
      "result": "A now-submitted session is no longer presented as missing."
    }
  ],
  "fields": [
    {
      "name": "Date/cutoff",
      "rule": "School-local date with explicit server as-of."
    },
    {
      "name": "Filters",
      "rule": "Class, session status and responsible teacher within permitted branch; no default selections."
    },
    {
      "name": "Sort",
      "rule": "Due time or class; stable ID tie-breaker."
    }
  ],
  "outcome": "Exact list of due but unsubmitted registers.",
  "exceptions": [
    "No registers due: show No registers due yet, not 100%.",
    "Cancelled or future-not-due session: excluded from due denominator with explicit reason."
  ],
  "authorization": "Read-only principal oversight does not grant attendance.mark or attendance.correct.",
  "reads": "Session schedule/state; frozen roster only if detailed grant; authoritative submission/revision receipt.",
  "writes": "None.",
  "acceptance": "Received + awaiting = due for the same cutoff; each register counted once.",
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
