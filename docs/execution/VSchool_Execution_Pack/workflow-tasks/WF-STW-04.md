# WF-STW-04 — Switch enrollment context

Source workflow: STW-04. Workspace: VSchool_Student_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-04",
  "area": "access",
  "title": "Switch enrollment context",
  "phase": 2,
  "goal": "Move safely between own authorized school contexts.",
  "steps": [
    {
      "title": "Choose context",
      "instruction": "List only active verified enrollments with institution, branch and academic year."
    },
    {
      "title": "Resolve current work",
      "instruction": "Save/discard a changed draft; unresolved submission must be reconciled first."
    }
  ],
  "outcome": "Destination context and capabilities are reloaded together.",
  "invariant": "Never keep one child identity with another branch; no independent arbitrary branch selector.",
  "recovery": "Revoked or stale destination becomes unavailable; clear protected cached content.",
  "data": "StudentAccountLink + Enrollment + module entitlements + course assignment.",
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
