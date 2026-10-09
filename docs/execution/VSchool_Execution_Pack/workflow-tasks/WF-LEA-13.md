# WF-LEA-13 — Review an absence explanation

Source workflow: LEA-13. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-13",
  "area": "attendance",
  "title": "Review an absence explanation",
  "phase": 2,
  "trigger": "Guardian submits an explanation requiring school disposition.",
  "actors": "Principal only if delegated; attendance office; guardian",
  "preconditions": "Verified guardian-origin request and an explicit school-review capability.",
  "steps": [
    {
      "actor": "Reviewer",
      "action": "Open assigned request.",
      "result": "See exact child/session/date and minimum explanation permitted for purpose."
    },
    {
      "actor": "Reviewer",
      "action": "Check related attendance and prior disposition.",
      "result": "Explanation status is separate from attendance outcome."
    },
    {
      "actor": "Reviewer",
      "action": "Record allowed disposition or ask for clarification.",
      "result": "Response communicates school review, not an automatic correction."
    },
    {
      "actor": "Authorized Attendance owner",
      "action": "If required, perform separate correction workflow.",
      "result": "Correction receipt is linked without impersonating teacher or guardian."
    }
  ],
  "fields": [
    {
      "name": "Disposition",
      "rule": "Owner-allowed values only."
    },
    {
      "name": "Clarification",
      "rule": "Bounded question; recipient is current authorized originator."
    },
    {
      "name": "Correction reason",
      "rule": "Separate owner command and permission."
    }
  ],
  "outcome": "Explained school decision with traceable handoff.",
  "exceptions": [
    "Restricted relationship changes: recheck before reply.",
    "Principal not delegated: view only permitted routing state, not explanation body."
  ],
  "authorization": "Principal status alone does not grant family/care detail or correction authority.",
  "reads": "Owned family request; current guardian purpose; exact attendance record/version.",
  "writes": "Request disposition and permitted message; correction is separate.",
  "acceptance": "Approving an explanation does not mutate an attendance mark.",
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
