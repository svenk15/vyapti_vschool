# WF-SA-41 — Build and publish a timetable

Source workflow: SA-41. Workspace: VSchool_School_Admin_Design. Source area: planning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-41",
  "module": "planning",
  "title": "Build and publish a timetable",
  "phase": 3,
  "capability": "timetable.manage",
  "steps": [
    {
      "title": "Draft schedule",
      "help": "Keep draft separate from the published timetable.",
      "fields": [
        {
          "name": "week",
          "label": "Cycle",
          "type": "select",
          "options": [
            "Weekly cycle",
            "Two-week cycle"
          ],
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
          "name": "from",
          "label": "Effective from",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Resolve conflicts",
      "help": "Validate teacher, room and calendar conflicts.",
      "fields": [
        {
          "name": "resolution",
          "label": "Conflict review reference",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Publish revision",
      "help": "Preview generated session changes before confirmation.",
      "fields": [
        {
          "name": "publish",
          "label": "I have reviewed the published revision and future session impact.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A published timetable version drives idempotent future session generation.",
  "rule": "Existing open/submitted attendance stays pinned; recurring plan is not the Phase 1 manual-session contract.",
  "edge": "Clash races and repeated generation cannot produce double sessions.",
  "data": "Academics owns TimetableVersion/slots, room and teacher constraints; Attendance consumes versioned generation commands.",
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
