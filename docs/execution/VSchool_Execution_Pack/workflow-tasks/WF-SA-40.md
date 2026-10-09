# WF-SA-40 — Accept an offer and enroll once

Source workflow: SA-40. Workspace: VSchool_School_Admin_Design. Source area: admissions. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-40",
  "module": "admissions",
  "title": "Accept an offer and enroll once",
  "phase": 3,
  "capability": "admissions.convert + student.manage",
  "steps": [
    {
      "title": "Accepted offer",
      "help": "Conversion follows verified acceptance and required evidence.",
      "fields": [
        {
          "name": "application",
          "label": "Application",
          "type": "select",
          "options": [
            "APP-2712 · Accepted"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "start",
          "label": "Enrollment start",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Student handoff",
      "help": "Preview the new student, placement and guardian verification work.",
      "fields": [
        {
          "name": "admission",
          "label": "Admission number",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "section",
          "label": "Class",
          "type": "select",
          "options": [
            "Grade 6 · A",
            "Grade 6 · B",
            "Grade 7 · A"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "convert",
          "label": "I have reviewed identity and enrollment details.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "One student conversion receipt links the application to enrollment.",
  "rule": "A repeated request returns the same conversion; do not create duplicate students or automatic guardian grants.",
  "edge": "Invalid capacity, changed acceptance or incomplete identity evidence pauses conversion safely.",
  "data": "Admissions conversion intent and Students owner transaction produce durable linkage; optional Finance/Documents handoffs are explicit."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
