# WF-SA-19 — Enroll and place a student

Source workflow: SA-19. Workspace: VSchool_School_Admin_Design. Source area: students. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-19",
  "module": "students",
  "title": "Enroll and place a student",
  "phase": 1,
  "capability": "student.manage",
  "steps": [
    {
      "title": "Enrollment",
      "help": "Choose the student and year.",
      "fields": [
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
        },
        {
          "name": "year",
          "label": "Academic year",
          "type": "select",
          "options": [
            "2026–27"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Class placement",
      "help": "Dates determine which class roster the pupil belongs to.",
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
          "name": "from",
          "label": "Effective from",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "Effective until",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "roll",
          "label": "Roll number",
          "type": "text",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    },
    {
      "title": "Review placement",
      "help": "Check overlapping placements and any frozen attendance sessions.",
      "fields": [
        {
          "name": "review",
          "label": "I have reviewed roster impact.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The enrollment and effective placement are saved.",
  "rule": "One enrollment per student/year and non-overlapping placement intervals; no rewriting frozen rosters.",
  "edge": "A conflicting placement or open session is shown with a recovery link.",
  "data": "Students owns Enrollment and SectionPlacement; authorized academics references and attendance impact query are checked."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
