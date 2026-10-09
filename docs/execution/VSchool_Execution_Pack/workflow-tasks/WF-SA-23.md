# WF-SA-23 — Preview a roster import

Source workflow: SA-23. Workspace: VSchool_School_Admin_Design. Source area: imports. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-23",
  "module": "imports",
  "title": "Preview a roster import",
  "phase": 1,
  "capability": "import.upload · school administrator only",
  "steps": [
    {
      "title": "Target and template",
      "help": "Context is supplied separately from STUDENT_ROSTER_V1 rows.",
      "fields": [
        {
          "name": "year",
          "label": "Academic year",
          "type": "select",
          "options": [
            "2026–27"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "namespace",
          "label": "Source namespace",
          "type": "text",
          "options": [],
          "required": true,
          "value": "school-sis"
        },
        {
          "name": "effective",
          "label": "Placement effective from",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Choose file",
      "help": "UTF-8 CSV; production limits and per-request chunk bounds follow the Imports LLD.",
      "fields": [
        {
          "name": "file",
          "label": "CSV file",
          "type": "file",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review preview",
      "help": "Inspect creates, no-change rows, conflicts and errors before confirming.",
      "fields": [
        {
          "name": "preview",
          "label": "I have reviewed the synthetic preview: 3 creates, 1 unchanged, 1 error.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A preview is available; no student records are written.",
  "rule": "No guardian columns in the Phase 1 roster contract; no raw rows, file bytes or hashes in audit.",
  "edge": "Invalid encoding/header/size fails clearly; schema error gives the correct template; no silent truncation.",
  "data": "Imports owns immutable source hash in ImportJob, versioned preview and bounded rows. Preview reads authorized academic/student facts only."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
