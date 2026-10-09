# WF-TEA-10 — Mark attendance and review exceptions

Source workflow: TEA-10. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-10",
  "area": "attendance",
  "title": "Mark attendance and review exceptions",
  "phase": 1,
  "capability": "attendance.mark for exact open session",
  "entry": "attendance/a1",
  "steps": [
    {
      "title": "Mark deliberately",
      "help": "Use Present, Absent, Late or Excused. Unmarked is a draft state.",
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
          "name": "status",
          "label": "Attendance",
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
      "title": "Check the whole class",
      "help": "A filtered view must not hide incomplete rows from final validation.",
      "fields": [
        {
          "name": "review",
          "label": "I have checked exceptions and all unmarked pupils.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An in-memory draft accurately represents the teacher’s intended register.",
  "rule": "Explicit bulk action states its scope. Mark unmarked present preserves existing exceptions; replacing every status requires a separate confirmation.",
  "recovery": "Search/filter changes never discard edits. Phase 1 reload/navigation may lose unsent input; warn clearly.",
  "data": "UI draft keyed by exact session/roster revision. No browser durable pupil cache, database record or automatic attendance event before submit.",
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
