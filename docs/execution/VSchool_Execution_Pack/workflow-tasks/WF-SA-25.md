# WF-SA-25 — Schedule attendance sessions

Source workflow: SA-25. Workspace: VSchool_School_Admin_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-25",
  "module": "attendance",
  "title": "Schedule attendance sessions",
  "phase": 1,
  "capability": "class.manage",
  "steps": [
    {
      "title": "Session",
      "help": "Attendance belongs to a class session, not an editable daily register.",
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
          "name": "subject",
          "label": "Subject",
          "type": "select",
          "options": [
            "Mathematics",
            "English",
            "Science"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "day",
          "label": "Session date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Time and teacher",
      "help": "Use the branch time zone. The teacher needs a dated eligible assignment.",
      "fields": [
        {
          "name": "start",
          "label": "Start time",
          "type": "time",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "end",
          "label": "End time",
          "type": "time",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "teacher",
          "label": "Teacher",
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
      "title": "Review schedule",
      "help": "Check calendar, offering/date overlap and teacher/date clashes.",
      "fields": [
        {
          "name": "clash",
          "label": "I have reviewed the conflict check.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The session appears in the assigned teacher’s teaching day.",
  "rule": "Reject overlapping scheduled sessions for the same primary teacher; roster freezes only when the session opens.",
  "edge": "Calendar conflict or teacher change explains the exact blocked interval.",
  "data": "Attendance owns AttendanceSession; Academics supplies Offering, Assignment and pinned CalendarRevision. Index both overlap query shapes."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
