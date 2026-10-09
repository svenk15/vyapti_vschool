# WF-TEA-37 — Request leave and arrange a handoff

Source workflow: TEA-37. Workspace: VSchool_Teacher_Design. Source area: self-service. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-37",
  "area": "self-service",
  "title": "Request leave and arrange a handoff",
  "phase": 6,
  "capability": "own leave.request; no approval power",
  "entry": "self-service",
  "steps": [
    {
      "title": "Leave request",
      "help": "Only your own balances and requests are shown.",
      "fields": [
        {
          "name": "from",
          "label": "From date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "Until date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "type",
          "label": "Leave type",
          "type": "select",
          "options": [
            "Approved personal leave category",
            "School-approved leave category"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Teaching impact",
      "help": "Requesting leave does not automatically cancel class sessions.",
      "fields": [
        {
          "name": "handoff",
          "label": "Teaching handoff reference",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "submit",
          "label": "Submit for the authorized approver.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The request is pending, approved, returned or declined with a clear reason.",
  "rule": "Coverage belongs to the timetable owner; pupil and staff attendance are different domains. Sensitive leave evidence is restricted.",
  "recovery": "Insufficient balance, overlapping request or changed approval authority blocks/returns appropriately.",
  "data": "People operations LeaveRequest and versioned balance policy; ledger debit on approved transition; Academics cover handoff is separate.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
