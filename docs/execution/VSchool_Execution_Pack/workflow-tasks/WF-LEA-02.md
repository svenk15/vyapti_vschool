# WF-LEA-02 — Switch branches without losing context

Source workflow: LEA-02. Workspace: VSchool_Principal_Leadership_Workflows. Source area: access. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-02",
  "area": "access",
  "title": "Switch branches without losing context",
  "phase": 1,
  "trigger": "Leader oversees multiple explicitly granted branches.",
  "actors": "Principal or institution leader",
  "preconditions": "Destination branch grant exists; any pending command has been reconciled.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open the branch selector.",
      "result": "Each allowed option names institution and branch."
    },
    {
      "actor": "System",
      "action": "Check unsaved work or unresolved commands.",
      "result": "Save/discard prompt for editable draft; unresolved decision must be checked first."
    },
    {
      "actor": "Principal",
      "action": "Confirm destination.",
      "result": "Server re-resolves module and object permissions."
    },
    {
      "actor": "System",
      "action": "Clear prior branch filters and data.",
      "result": "New branch context reloads; a deep link from the previous branch is not silently reused."
    }
  ],
  "fields": [
    {
      "name": "Destination",
      "rule": "A returned branch reference, not an arbitrary UUID."
    },
    {
      "name": "Unfinished work",
      "rule": "Remain, save draft if supported, or discard explicitly."
    }
  ],
  "outcome": "New branch view with consistent scope and capabilities.",
  "exceptions": [
    "Destination grant revoked while chooser is open: remain in old authorized context.",
    "Different timezone: date is recalculated in destination school timezone."
  ],
  "authorization": "Cross-branch aggregate authority is separate from branch switching.",
  "reads": "Current branch grants; module availability; pending command references.",
  "writes": "Existing context-selection/session state only.",
  "acceptance": "A stale selection is rejected; no old branch record flashes or leaks.",
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
