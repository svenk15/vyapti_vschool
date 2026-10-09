# WF-LEA-42 — Review decision and follow-up history

Source workflow: LEA-42. Workspace: VSchool_Principal_Leadership_Workflows. Source area: reports. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-42",
  "area": "reports",
  "title": "Review decision and follow-up history",
  "phase": 2,
  "trigger": "Leader audits why an action was taken or a case remains open.",
  "actors": "Principal; authorized Reporting + source owners owner",
  "preconditions": "Purpose-specific audit/event-read grant.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Search by reference, actor or bounded date.",
      "result": "Only visible scopes and safe event metadata returned."
    },
    {
      "actor": "Principal",
      "action": "Open event sequence.",
      "result": "Show intent, owner result, version and who acted."
    },
    {
      "actor": "Principal",
      "action": "Inspect linked source only with current permission.",
      "result": "Audit reference does not bypass access."
    },
    {
      "actor": "System / owner",
      "action": "Record a review finding or escalation if needed.",
      "result": "Prior audit events remain append-only."
    }
  ],
  "fields": [
    {
      "name": "Search attribute",
      "rule": "Reference by default; actor/date allowlisted."
    },
    {
      "name": "Window",
      "rule": "Bounded; no all-time unrestricted dump."
    },
    {
      "name": "Finding",
      "rule": "Separate review record."
    }
  ],
  "outcome": "Understandable accountability trail.",
  "exceptions": [
    "Actor later inactive: historical attribution retained safely.",
    "Source unavailable/restricted: audit shows safe reference, not leaked contents."
  ],
  "authorization": "General audit excludes raw messages, answers, health detail, tokens and file contents.",
  "reads": "Append-only safe events; command/decision references.",
  "writes": "Optional review finding, never audit rewrite.",
  "acceptance": "Closed/reopened/reassigned history cannot be overwritten to erase responsibility.",
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
