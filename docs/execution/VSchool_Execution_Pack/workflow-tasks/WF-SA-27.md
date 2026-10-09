# WF-SA-27 — Correct submitted attendance

Source workflow: SA-27. Workspace: VSchool_School_Admin_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-27",
  "module": "attendance",
  "title": "Correct submitted attendance",
  "phase": 1,
  "capability": "attendance.correct",
  "steps": [
    {
      "title": "Select the record",
      "help": "Corrections preserve the original submission.",
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
          "name": "session",
          "label": "Session",
          "type": "select",
          "options": [
            "Mathematics · 8 Oct · 09:00"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "status",
          "label": "Corrected status",
          "type": "select",
          "options": [
            "Present",
            "Absent",
            "Late",
            "Excused"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Record evidence",
      "help": "A meaningful reason is mandatory.",
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
          "name": "correct",
          "label": "I have reviewed the original and corrected status.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A new correction revision appears with actor, reason and time.",
  "rule": "Only submitted attendance is correctable; compare the expected revision in the same authorized transaction.",
  "edge": "Another editor’s correction shows a conflict and comparison; unknown result uses the same request receipt.",
  "data": "Attendance appends immutable record/correction revision, audit and outbox; reporting reads the effective revision without destroying the original."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
