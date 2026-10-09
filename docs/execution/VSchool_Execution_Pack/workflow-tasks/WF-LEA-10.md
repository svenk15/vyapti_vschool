# WF-LEA-10 — Follow up multiple missing registers safely

Source workflow: LEA-10. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-10",
  "area": "attendance",
  "title": "Follow up multiple missing registers safely",
  "phase": 2,
  "trigger": "Several due sessions need action.",
  "actors": "Principal; Coordination owner",
  "preconditions": "All selected rows reauthorized; bulk capability explicitly enabled; single-item workflow proven.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Select explicit visible sessions.",
      "result": "Selection count and scope remain visible across filters."
    },
    {
      "actor": "System",
      "action": "Build a server-side review preview.",
      "result": "Identify already resolved, duplicate, ineligible and eligible rows."
    },
    {
      "actor": "Principal",
      "action": "Confirm recipients, common due time and per-item effects.",
      "result": "No hidden select-all across unreviewed pages."
    },
    {
      "actor": "System",
      "action": "Process independent owner commands.",
      "result": "Per-session succeeded/skipped/failed results and references returned."
    },
    {
      "actor": "Principal",
      "action": "Retry only known failures.",
      "result": "Uncertain items use status lookup; successful items are not resent."
    }
  ],
  "fields": [
    {
      "name": "Selection",
      "rule": "Explicit bounded ID list; proposed max 25."
    },
    {
      "name": "Assignee rule",
      "rule": "Per-session validated coordinator or approved routing."
    },
    {
      "name": "Reason/due",
      "rule": "Previewed before confirmation."
    }
  ],
  "outcome": "Honest per-item outcomes with no duplicate follow-ups.",
  "exceptions": [
    "Permission/source changes after preview: that item is denied/skipped without rollback of unrelated successes.",
    "Filter change does not silently change confirmed payload."
  ],
  "authorization": "Bulk authority cannot exceed single-item authority. No bulk attendance marking/correction.",
  "reads": "Same records as single follow-up plus versioned preview.",
  "writes": "One coordination command receipt per session, plus non-sensitive batch summary.",
  "acceptance": "3 selected with 1 resolved and 1 denied yields 1 new, 1 skipped, 1 denied; no false batch-success label.",
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
