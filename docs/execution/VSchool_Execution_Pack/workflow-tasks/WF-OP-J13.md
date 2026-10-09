# WF-OP-J13 — Add verified administrator access

Source workflow: OP-J13. Workspace: VSchool_Operator_Design. Source area: operator. Catalog phase: not numbered.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "OP-J13",
  "name": "Add verified administrator access",
  "entry": "Institution → Administrators → Add administrator",
  "steps": "Enter identity, independent verification reference and branch setup scope; review account reuse before confirming.",
  "outcome": "Grant institution configuration access. Existing account credentials/memberships remain. New accounts await the approved activation path.",
  "alternate_states": "Duplicate membership, existing account ownership not confirmed, institution inactive, no verification and save failure.",
  "implementation_contract": "Preserve IAM-02/03 operator-assisted bootstrap and account-wide trust constraints. Do not grant student-record roles, reset credentials or send arbitrary invitations from this console."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
