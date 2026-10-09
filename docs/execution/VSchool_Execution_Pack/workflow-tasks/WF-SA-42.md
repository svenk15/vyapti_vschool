# WF-SA-42 — Arrange cover or a timetable exception

Source workflow: SA-42. Workspace: VSchool_School_Admin_Design. Source area: planning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-42",
  "module": "planning",
  "title": "Arrange cover or a timetable exception",
  "phase": 3,
  "capability": "timetable.cover.manage",
  "steps": [
    {
      "title": "Affected session",
      "help": "Choose a dated exception, not a permanent identity reassignment.",
      "fields": [
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
          "name": "date",
          "label": "Date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "teacher",
          "label": "Cover teacher",
          "type": "select",
          "options": [
            "Ananya Rao",
            "Rohan Das"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review access and notice",
      "help": "The cover teacher receives only the required dated scope.",
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
          "name": "cover",
          "label": "Eligibility and clashes have been reviewed.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The supported substitution is visible to the affected staff.",
  "rule": "Never use shared logins; do not replace historical assignment attribution.",
  "edge": "Unavailable cover or an already opened session invokes the defined review path.",
  "data": "Academics owns Substitution with effective period; Attendance assignment-resolution contract and Communication notification request.",
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
