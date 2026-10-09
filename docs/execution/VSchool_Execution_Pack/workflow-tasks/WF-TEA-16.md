# WF-TEA-16 — Request an attendance correction

Source workflow: TEA-16. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-16",
  "area": "attendance",
  "title": "Request an attendance correction",
  "phase": 2,
  "capability": "attendance.correction.request (proposed)",
  "entry": "flow/TEA-16",
  "steps": [
    {
      "title": "Identify the exact record",
      "help": "A request is not a correction.",
      "fields": [
        {
          "name": "receipt",
          "label": "Submission reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "student",
          "label": "Student in assigned class",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "proposed",
          "label": "Requested status",
          "type": "select",
          "options": [
            "Present",
            "Absent",
            "Late",
            "Excused"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Explain",
      "help": "Use a minimal reason for authorized review.",
      "fields": [
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "request",
          "label": "Send this request to the authorized attendance reviewer.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A proposed request has Pending review / Accepted / Declined states and a linked outcome.",
  "rule": "New extension requiring scope approval. Only the administrator’s attendance.correct command changes the register.",
  "recovery": "Duplicates, withdrawal, permission loss and already-corrected records are handled with traceable decisions.",
  "data": "Proposed CorrectionRequest references session/record/revision; Attendance correction owner records accepted effect and audit. No direct teacher record writes.",
  "proposal": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
