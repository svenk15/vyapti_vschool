# WF-LEA-28 — Request information before deciding

Source workflow: LEA-28. Workspace: VSchool_Principal_Leadership_Workflows. Source area: decisions. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-28",
  "area": "decisions",
  "title": "Request information before deciding",
  "phase": 2,
  "trigger": "Evidence is incomplete or ambiguous.",
  "actors": "Principal; authorized Each owning module owner",
  "preconditions": "Current decision assignment and a permitted communication channel.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Identify the missing information.",
      "result": "Choose targeted fields/questions; no unnecessary personal data."
    },
    {
      "actor": "Principal",
      "action": "Preview recipient and question.",
      "result": "Only authorized originator/team sees the request."
    },
    {
      "actor": "Principal",
      "action": "Confirm request for information.",
      "result": "Owner records Waiting for information and response expectation."
    },
    {
      "actor": "System / owner",
      "action": "Review response later.",
      "result": "Decision evidence version changes; prior review must be refreshed."
    }
  ],
  "fields": [
    {
      "name": "Question",
      "rule": "Bounded actionable text."
    },
    {
      "name": "Recipient",
      "rule": "Owner-approved requester/contact."
    },
    {
      "name": "Response date",
      "rule": "Policy-defined, not an invented statutory deadline."
    }
  ],
  "outcome": "An explicit pending-information state.",
  "exceptions": [
    "Reply delivery fails: remains visible; no implied receipt.",
    "Request already resolved/reassigned: stale transition rejected."
  ],
  "authorization": "Asking for information does not expand recipient or case permissions.",
  "reads": "Decision version; current originator/participant grant.",
  "writes": "Source-owner information request and approved message.",
  "acceptance": "Waiting for information is not Rejected or Approved.",
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
