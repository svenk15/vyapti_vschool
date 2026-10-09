# WF-SA-38 — Capture inquiry and start an application

Source workflow: SA-38. Workspace: VSchool_School_Admin_Design. Source area: admissions. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-38",
  "module": "admissions",
  "title": "Capture inquiry and start an application",
  "phase": 3,
  "capability": "admissions.manage",
  "steps": [
    {
      "title": "Applicant",
      "help": "An applicant is distinct from an enrolled student.",
      "fields": [
        {
          "name": "name",
          "label": "Applicant name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "grade",
          "label": "Applying for",
          "type": "select",
          "options": [
            "Grade 6",
            "Grade 7"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "contact",
          "label": "Applicant contact email",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Cycle and checklist",
      "help": "Choose the relevant intake and required evidence.",
      "fields": [
        {
          "name": "cycle",
          "label": "Admission cycle",
          "type": "select",
          "options": [
            "2027–28"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "notice",
          "label": "The approved collection notice has been provided.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An application has a reference, checklist and next action.",
  "rule": "Admission must work without Fees; collect only information needed for the current stage.",
  "edge": "Duplicate candidate suggests deliberate review; do not auto-merge applicants or existing pupils.",
  "data": "Admissions owns Applicant, Application, Cycle and checklist; no Student row until accepted conversion."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
