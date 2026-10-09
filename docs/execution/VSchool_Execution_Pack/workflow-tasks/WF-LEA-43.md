# WF-LEA-43 — Review financial exceptions under a separate grant

Source workflow: LEA-43. Workspace: VSchool_Principal_Leadership_Workflows. Source area: services. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-43",
  "area": "services",
  "title": "Review financial exceptions under a separate grant",
  "phase": 5,
  "trigger": "Authorized leader reviews a finance summary or assigned approval.",
  "actors": "Principal; authorized Finance / individual service owners owner",
  "preconditions": "Finance module released; explicit aggregate/detail/approval grants; finance policies independently designed.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open authorized finance summary.",
      "result": "Show exact currency, cutoff, reconciliation state and definition."
    },
    {
      "actor": "Principal",
      "action": "Inspect permitted exception or assigned decision.",
      "result": "No default pupil debtor list from principal role."
    },
    {
      "actor": "Principal",
      "action": "Hand off or decide within explicit limit/separation rules.",
      "result": "Adjustment, concession and refund commands remain finance-owned."
    },
    {
      "actor": "System / owner",
      "action": "Confirm actual financial outcome.",
      "result": "Approval, initiated payment/refund and reconciled settlement remain distinct."
    }
  ],
  "fields": [
    {
      "name": "Period/currency",
      "rule": "Explicit; no combining unlike currencies."
    },
    {
      "name": "Decision limit",
      "rule": "Finance policy, not UI-only."
    },
    {
      "name": "Reason/evidence",
      "rule": "Owner-required and minimized."
    }
  ],
  "outcome": "Authorized financial oversight or bounded decision.",
  "exceptions": [
    "Unreconciled data is labelled; no false collection total.",
    "Requester/self-approver conflict routes independently."
  ],
  "authorization": "No automatic refunds, fee editing, payroll access or financial hardship disclosure.",
  "reads": "Finance safe projections, assigned approval and ledger/reconciliation evidence.",
  "writes": "Finance owner decision only if explicitly delegated.",
  "acceptance": "A principal cannot approve a refund merely because it appears in an inbox.",
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
