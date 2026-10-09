# WF-SA-55 — Catalog and circulate library items

Source workflow: SA-55. Workspace: VSchool_School_Admin_Design. Source area: library. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-55",
  "module": "library",
  "title": "Catalog and circulate library items",
  "phase": 6,
  "capability": "library.circulate (delegated)",
  "steps": [
    {
      "title": "Identify the copy",
      "help": "Barcode identifies a physical copy, not only the title.",
      "fields": [
        {
          "name": "barcode",
          "label": "Copy barcode",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "student",
          "label": "Student",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Circulation",
      "help": "Check eligibility and active hold policy.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Check out",
            "Return",
            "Renew",
            "Reserve"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The loan or reservation is recorded with a clear due date.",
  "rule": "Only one active loan per physical copy; fines are optional Finance integration.",
  "edge": "Already loaned, hold queue conflict, lost item and duplicate scan have explicit outcomes.",
  "data": "CatalogItem, PhysicalCopy, Loan, Reservation and versioned policy. Lock copy/hold state in circulation transaction."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
