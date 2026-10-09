# WF-SA-18 — Register a student manually

Source workflow: SA-18. Workspace: VSchool_School_Admin_Design. Source area: students. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-18",
  "module": "students",
  "title": "Register a student manually",
  "phase": 1,
  "capability": "student.manage",
  "steps": [
    {
      "title": "Identity",
      "help": "Create a person or explicitly select an exact existing identity.",
      "fields": [
        {
          "name": "match",
          "label": "Identity selection",
          "type": "select",
          "options": [
            "Create new Person",
            "Exact person ID",
            "Exact admission number"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "lookup",
          "label": "Exact reference if selecting existing",
          "type": "text",
          "options": [],
          "required": false,
          "value": ""
        },
        {
          "name": "first",
          "label": "First name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "last",
          "label": "Last name",
          "type": "text",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    },
    {
      "title": "School record",
      "help": "Admission number stays stable in this branch.",
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
          "name": "joined",
          "label": "Admission date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review identity",
      "help": "Review a single exact candidate; do not match by email, name similarity or ranked results.",
      "fields": [
        {
          "name": "identity",
          "label": "I have verified that this is the intended student.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A Student profile references the deliberately selected organization Person.",
  "rule": "Same-institution identity lookup is exact admission number or person ID only; no broad person discovery.",
  "edge": "Duplicate/racing admission numbers show the existing permitted record or a conflict; no automatic merge.",
  "data": "People Person and Students Student are created through the owner contracts in the documented transaction."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
