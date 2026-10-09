# WF-PAR-37 — Start or resume an application

Source workflow: PAR-37. Workspace: VSchool_Parent_Guardian_Design. Source area: admissions. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-37",
  "area": "admissions",
  "title": "Start or resume an application",
  "phase": 3,
  "purpose": "applicant self-scope; separate from enrolled child grant",
  "steps": [
    {
      "title": "Application",
      "help": "Use the school’s offered intake and a minimal applicant record.",
      "fields": [
        {
          "name": "applicant",
          "label": "Applicant name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "intake",
          "label": "Intake",
          "type": "select",
          "options": [
            "2027–28 · School-offered entry"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Save or submit",
      "help": "A submitted application is not enrollment or portal access.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Save application draft",
            "Submit for school review"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "truth",
          "label": "I have reviewed the information for accuracy.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An applicant-scoped draft or submitted application has a reference.",
  "invariant": "An applicant is not matched to an existing pupil by email/DOB alone. Keep evidence, fee and relationship verification separate.",
  "recovery": "Duplicate claims, withdrawal, document failure and intake closure do not create student records automatically.",
  "data": "Admissions Application/version/owner actor; approved admission later invokes verified Students/Guardians onboarding.",
  "extension": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
