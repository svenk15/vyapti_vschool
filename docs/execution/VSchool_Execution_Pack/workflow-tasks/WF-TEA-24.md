# WF-TEA-24 — Hand over a lesson or request a schedule change

Source workflow: TEA-24. Workspace: VSchool_Teacher_Design. Source area: planning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-24",
  "area": "planning",
  "title": "Hand over a lesson or request a schedule change",
  "phase": 3,
  "capability": "timetable.change.request (proposed) + own assignment",
  "entry": "flow/TEA-24",
  "steps": [
    {
      "title": "Affected lesson",
      "help": "A request does not directly modify the timetable.",
      "fields": [
        {
          "name": "class",
          "label": "Assigned class",
          "type": "select",
          "options": [
            "Grade 6 · A · Mathematics",
            "Grade 6 · B · Mathematics",
            "Grade 7 · A · Science"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "date",
          "label": "Date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "reasonType",
          "label": "Request type",
          "type": "select",
          "options": [
            "Availability change",
            "Room issue",
            "Cover handoff"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Handoff",
      "help": "Share only necessary teaching context with the authorized recipient.",
      "fields": [
        {
          "name": "handoff",
          "label": "Lesson handoff / request reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The scheduling owner reviews the request and publishes any approved change.",
  "rule": "Do not move a scheduled session or grant access from a teacher draft. Open/submitted history is preserved.",
  "recovery": "Denied request or changed assignment leaves the original schedule authoritative.",
  "data": "Proposed TimetableChangeRequest links an existing offering/occurrence; Academics executes approval. Learning resources keep their grants.",
  "proposal": true,
  "timetable_contract": {
    "release": "TT-01",
    "owner": "academics / timetable",
    "entry": "planning",
    "specification": "docs/timetable/README.md",
    "phase": 3,
    "implementation": "NOT_ASSESSED"
  }
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
