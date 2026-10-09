# WF-OP-J07 — Leave or sign out during editing

Source workflow: OP-J07. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J07",
  "name": "Leave or sign out during editing",
  "entry": "Sidebar, browser Back, leave utility or Sign out",
  "steps": "Prompt only for unsaved changes. Save and leave, keep working or explicitly discard unsaved edits. If unchanged, leave directly.",
  "outcome": "A failed save keeps the user and edits on the page. Discard keeps any previously saved draft. Sign-out occurs only after a requested save succeeds.",
  "alternate_states": "Failed save, session expiry, browser reload and storage unavailable.",
  "implementation_contract": "Real sign-out must invalidate the current server session. Protected views reauthorize on browser Back. Retention of unsaved edits across reauthentication is a policy decision, not permission to persist credentials."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
