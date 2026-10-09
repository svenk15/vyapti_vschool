# WF-SA-45 — Issue a certificate or publish a form

Source workflow: SA-45. Workspace: VSchool_School_Admin_Design. Source area: documents. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-45",
  "module": "documents",
  "title": "Issue a certificate or publish a form",
  "phase": 3,
  "capability": "document.issue / form.publish",
  "steps": [
    {
      "title": "Template and audience",
      "help": "Use a versioned approved template.",
      "fields": [
        {
          "name": "type",
          "label": "Type",
          "type": "select",
          "options": [
            "Enrollment certificate",
            "Transfer certificate",
            "School form"
          ],
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
      "title": "Review generated content",
      "help": "Validate source fields and intended recipient.",
      "fields": [
        {
          "name": "review",
          "label": "I have reviewed the exact document preview.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An issued revision has a reference and controlled download.",
  "rule": "Do not overwrite issued documents; corrections issue a new linked version.",
  "edge": "Unavailable source data and revoked recipient grants prevent issue/download.",
  "data": "DocumentTemplateVersion → immutable issue snapshot or FormSchemaVersion/FormResponse, with signed-download authorization."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
