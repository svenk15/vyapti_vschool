# WF-SA-56 — Resolve overdue, lost or inventory discrepancies

Source workflow: SA-56. Workspace: VSchool_School_Admin_Design. Source area: library. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-56",
  "module": "library",
  "title": "Resolve overdue, lost or inventory discrepancies",
  "phase": 6,
  "capability": "library.manage (delegated)",
  "steps": [
    {
      "title": "Exception",
      "help": "Review loan and item history.",
      "fields": [
        {
          "name": "case",
          "label": "Case",
          "type": "select",
          "options": [
            "Overdue copy",
            "Reported lost",
            "Inventory discrepancy"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Disposition",
      "help": "Use a reasoned adjustment rather than deleting history.",
      "fields": [
        {
          "name": "decision",
          "label": "Decision",
          "type": "select",
          "options": [
            "Extend with approval",
            "Record loss",
            "Reconcile return"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The item and borrower record show the reasoned outcome.",
  "rule": "Loss/recovery preserves circulation history; no automatic guardian billing without the Finance contract.",
  "edge": "Concurrent return and loss adjustment reconcile under the copy guard.",
  "data": "PhysicalCopy state, Loan closure/revision, inventory evidence and optional FineCharge event."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
