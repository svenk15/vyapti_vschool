# WF-LEA-29 — Approve, reject or return an assigned item

Source workflow: LEA-29. Workspace: VSchool_Principal_Leadership_Workflows. Source area: decisions. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-29",
  "area": "decisions",
  "title": "Approve, reject or return an assigned item",
  "phase": 2,
  "trigger": "A complete item is ready for a delegated decision.",
  "actors": "Principal; authorized Each owning module owner",
  "preconditions": "Owner exposes current valid actions and consequence preview.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Review source facts and policy.",
      "result": "See subject, version, scope and relevant history."
    },
    {
      "actor": "Principal",
      "action": "Select decision and enter reason.",
      "result": "Reason requirements vary by source type."
    },
    {
      "actor": "Principal",
      "action": "Review the consequences and confirm.",
      "result": "One explicit command with stable intent and expected version."
    },
    {
      "actor": "System / owner",
      "action": "Read decision receipt.",
      "result": "Actor, time, outcome, source revision and downstream pending effects are distinct."
    }
  ],
  "fields": [
    {
      "name": "Decision",
      "rule": "Source-defined allowed enum."
    },
    {
      "name": "Reason",
      "rule": "Required where meaningful; no generic mandatory filler for every approval."
    },
    {
      "name": "Intent/version",
      "rule": "Opaque server/adapter contract."
    }
  ],
  "outcome": "One owner-confirmed decision.",
  "exceptions": [
    "Concurrent decision wins first: show current result; no overwrite.",
    "Transport timeout: Check decision status before retry."
  ],
  "authorization": "No generic approval table may become authority over all modules.",
  "reads": "Owner decision item and policy/version.",
  "writes": "Only the owning module changes business state; receipt/audit atomically recorded.",
  "acceptance": "Approved but payment/delivery pending cannot display Completed.",
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
