# WF-TEA-38 — Review my staff record and request a correction

Source workflow: TEA-38. Workspace: VSchool_Teacher_Design. Source area: self-service. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-38",
  "area": "self-service",
  "title": "Review my staff record and request a correction",
  "phase": 6,
  "capability": "own staff.read / correction request",
  "entry": "flow/TEA-38",
  "steps": [
    {
      "title": "My details",
      "help": "Employment records are separate from login identity.",
      "fields": [
        {
          "name": "field",
          "label": "Field to review",
          "type": "select",
          "options": [
            "Work contact",
            "Qualification record",
            "Employment detail"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Correction request",
      "help": "Only the record owner can approve controlled changes.",
      "fields": [
        {
          "name": "change",
          "label": "Requested correction",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "evidence",
          "label": "Non-sensitive evidence reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An own-record request has a traceable decision.",
  "rule": "No view of colleagues’ personal records or payroll; bank/salary changes require a separately designed sensitive process.",
  "recovery": "Revoked employment, disputed evidence and duplicate requests route to the authorized HR owner.",
  "data": "Employee safe self projection and proposed StaffCorrectionRequest; approved changes use People operations owner commands.",
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
