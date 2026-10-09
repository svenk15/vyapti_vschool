# WF-SA-12 — Change calendar or teaching assignment

Source workflow: SA-12. Workspace: VSchool_School_Admin_Design. Source area: academics. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-12",
  "module": "academics",
  "title": "Change calendar or teaching assignment",
  "phase": 1,
  "capability": "class.manage / school.manage",
  "steps": [
    {
      "title": "Choose the change",
      "help": "Show the effective date and affected future sessions.",
      "fields": [
        {
          "name": "change",
          "label": "Change",
          "type": "select",
          "options": [
            "Calendar revision",
            "Teacher assignment end date"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "effective",
          "label": "Effective date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review affected sessions",
      "help": "Open and submitted sessions cannot be silently rewritten.",
      "fields": [
        {
          "name": "impact",
          "label": "Reviewed impact reference",
          "type": "textarea",
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
  "outcome": "A supported future-dated change preserves historical references.",
  "rule": "Block changes affecting frozen/submitted roster history in the first release; substitutions are a later explicit workflow.",
  "edge": "List conflicting sessions and let the administrator resolve them before retrying.",
  "data": "Owner use case reads dependent AttendanceSession references; new academic revision/dates plus transactional audit."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
