# WF-STW-02 — Activate an issued student account

Source workflow: STW-02. Workspace: VSchool_Student_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-02",
  "area": "access",
  "title": "Activate an issued student account",
  "phase": 2,
  "goal": "Accept the exact school-verified account binding.",
  "steps": [
    {
      "title": "Review invitation",
      "instruction": "See intended school and a safe account hint; do not select another child."
    },
    {
      "title": "Activate",
      "instruction": "Authenticate intended identity and accept a valid, unrevoked invitation under school policy."
    }
  ],
  "outcome": "Account link active with school-defined capabilities.",
  "invariant": "Mailbox possession does not establish pupil identity; a guardian token cannot activate student authority.",
  "recovery": "Expired, wrong-account or failed-delivery token routes to school help; no self-link.",
  "data": "Access invitation + StudentAccountLink + non-sensitive verification reference.",
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
