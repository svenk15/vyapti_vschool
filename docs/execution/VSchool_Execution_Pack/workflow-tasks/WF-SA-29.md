# WF-SA-29 — Review an absence explanation

Source workflow: SA-29. Workspace: VSchool_School_Admin_Design. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-29",
  "module": "attendance",
  "title": "Review an absence explanation",
  "phase": 2,
  "capability": "attendance.explanation.review",
  "steps": [
    {
      "title": "Parent request",
      "help": "A family explanation is not an attendance correction.",
      "fields": [
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
        },
        {
          "name": "request",
          "label": "Request",
          "type": "select",
          "options": [
            "8 Oct · Medical appointment · Pending"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review disposition",
      "help": "A separate authorized correction is needed if attendance itself changes.",
      "fields": [
        {
          "name": "decision",
          "label": "Decision",
          "type": "select",
          "options": [
            "Accept explanation",
            "Ask for more information",
            "Reject with explanation"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reply",
          "label": "School response",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The family receives a permitted disposition; attendance changes only through correction.",
  "rule": "Recheck guardian relationship at request/read/delivery; do not expose restricted notes.",
  "edge": "Late submission, duplicate explanation and revoked guardian access have separate outcomes.",
  "data": "Guardian/request owner records case; Attendance correction facade optional; Communication delivers under current grants."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
