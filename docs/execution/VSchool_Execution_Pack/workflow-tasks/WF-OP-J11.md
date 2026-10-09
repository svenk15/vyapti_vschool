# WF-OP-J11 — Manage licensed modules

Source workflow: OP-J11. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J11",
  "name": "Manage licensed modules",
  "entry": "Institution → Modules → Manage licenses",
  "steps": "Review approved agreement, change Attendance licensing, add approval reference and reason. Foundations remain included.",
  "outcome": "Removing a license makes Attendance unavailable across branches and clears activation; records remain. Adding a license does not activate branches.",
  "alternate_states": "Unreleased module, invalid approval, stale configuration and failed save.",
  "implementation_contract": "Separate platform commercial entitlement from branch activation. Preserve module ownership and existing TEN-02 checks. Adding other products later requires their actual release/dependency contracts.",
  "timetable_contract": {
    "release": "TT-01",
    "owner": "academics / timetable",
    "entry": "Institution > Modules > Timetable",
    "specification": "docs/timetable/README.md",
    "phase": 3,
    "implementation": "NOT_ASSESSED"
  }
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
