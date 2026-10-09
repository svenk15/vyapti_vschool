# WF-SA-16 — Verify a staff identity and teacher eligibility

Source workflow: SA-16. Workspace: VSchool_School_Admin_Design. Source area: staff. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-16",
  "module": "staff",
  "title": "Verify a staff identity and teacher eligibility",
  "phase": 1,
  "capability": "user.manage + class.manage",
  "steps": [
    {
      "title": "Identity evidence",
      "help": "Record a non-sensitive reference to the school’s verification process.",
      "fields": [
        {
          "name": "employee",
          "label": "Employee",
          "type": "select",
          "options": [
            "Ananya Rao · EMP-001",
            "Rohan Das · EMP-002"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reference",
          "label": "Verification reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Teacher eligibility",
      "help": "A teaching profile needs an active eligible employee and permitted account binding.",
      "fields": [
        {
          "name": "from",
          "label": "Eligible from",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "Eligible until",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "verified",
          "label": "The school has verified this identity outside email activation.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher can be selected for dated assignments when all requirements are met.",
  "rule": "No auto-binding by email equality; explicit IAM-03 acceptance gates in the actual repository must be preserved.",
  "edge": "Changing eligibility lists affected assignments; a conflicting effective date is blocked.",
  "data": "People/Access own verified binding; Academics owns Teacher eligibility. Mutations use published contracts, not foreign table writes."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
