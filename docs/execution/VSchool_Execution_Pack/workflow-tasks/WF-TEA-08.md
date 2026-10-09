# WF-TEA-08 — Review a minimal class roster

Source workflow: TEA-08. Workspace: VSchool_Teacher_Design. Source area: classes. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-08",
  "area": "classes",
  "title": "Review a minimal class roster",
  "phase": 1,
  "capability": "class.read + assigned-roster student.read",
  "entry": "classes/c1",
  "steps": [
    {
      "title": "Roster scope",
      "help": "The effective class/date determines membership.",
      "fields": [
        {
          "name": "class",
          "label": "Assigned class",
          "type": "select",
          "options": [
            "Grade 6 · A · Mathematics",
            "Grade 6 · B · Mathematics",
            "Grade 7 · A · Science"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "date",
          "label": "Roster date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Student context",
      "help": "See only the data needed for assigned teaching.",
      "fields": [
        {
          "name": "student",
          "label": "Student in assigned class",
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
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Student name and school reference",
            "Assigned-session attendance"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher can identify the correct pupil without gaining full student-record access.",
  "rule": "No institution-wide person search, unrelated pupil directory, bulk pupil export, financial ledger, custody detail or clinical narrative.",
  "recovery": "A pupil joining/leaving on a boundary changes future roster eligibility; already opened session rosters remain frozen.",
  "data": "Students Student → Person → effective Enrollment/SectionPlacement → authorized class. Session view uses frozen roster instead of live enrollment.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
