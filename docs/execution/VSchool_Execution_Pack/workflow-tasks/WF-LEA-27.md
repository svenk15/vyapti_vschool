# WF-LEA-27 — Work from a purpose-scoped decision inbox

Source workflow: LEA-27. Workspace: VSchool_Principal_Leadership_Workflows. Source area: decisions. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-27",
  "area": "decisions",
  "title": "Work from a purpose-scoped decision inbox",
  "phase": 2,
  "trigger": "Principal has requests awaiting their decision.",
  "actors": "Principal; authorized Each owning module owner",
  "preconditions": "Source modules expose an authorized assigned-decision projection.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open My decisions.",
      "result": "Group by decision type, due time and action readiness."
    },
    {
      "actor": "Principal",
      "action": "Filter or sort using shared controls.",
      "result": "Counts reflect accessible items and current scope."
    },
    {
      "actor": "Principal",
      "action": "Open an item.",
      "result": "Owner-specific evidence, allowed actions and impact load fresh."
    },
    {
      "actor": "System / owner",
      "action": "Return to inbox.",
      "result": "Decided, awaiting information and unavailable items update distinctly."
    }
  ],
  "fields": [
    {
      "name": "Filters",
      "rule": "Type, state, due period; no selected defaults."
    },
    {
      "name": "Search",
      "rule": "Request reference or permitted subject."
    },
    {
      "name": "Sort",
      "rule": "Due time or submitted time."
    }
  ],
  "outcome": "One navigational inbox, with owner-specific decisions.",
  "exceptions": [
    "Source module disabled: no blind approve button.",
    "Stale list row: re-read source, do not trust cached action state."
  ],
  "authorization": "Inbox read grant never authorizes decisions across every source module.",
  "reads": "Authorized decision references and safe status projection only.",
  "writes": "None.",
  "acceptance": "Opening a decision calls its owner policy; unseen types cannot be acted upon.",
  "priority": "Second release",
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
