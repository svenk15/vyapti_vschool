# WF-STW-44 — Manage my sessions

Source workflow: STW-44. Workspace: VSchool_Student_Design. Source area: account. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-44",
  "area": "account",
  "title": "Manage my sessions",
  "phase": 2,
  "goal": "Protect my school account on shared devices.",
  "steps": [
    {
      "title": "Review sessions",
      "instruction": "Show only own session labels/time; no secrets or raw device identifiers."
    },
    {
      "title": "Revoke or sign out",
      "instruction": "Reauthenticate when required; clear local protected state."
    }
  ],
  "outcome": "Selected sessions revoked or current session ended.",
  "invariant": "Keep sign out separate from identity block; server revocation is authoritative.",
  "recovery": "Already-revoked is idempotent; failed revoke must not say completed.",
  "data": "Access session + audit + revocation command.",
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
