# WF-TEA-14 — Review history and hand off a correction

Source workflow: TEA-14. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-14",
  "area": "attendance",
  "title": "Review history and hand off a correction",
  "phase": 1,
  "capability": "attendance.read_class within authorized assignment scope",
  "entry": "history",
  "steps": [
    {
      "title": "Locate the session",
      "help": "Use class, date and subject to find the exact submitted register.",
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
          "label": "Session date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Correction handoff",
      "help": "Teachers cannot directly alter submitted attendance in Phase 1.",
      "fields": [
        {
          "name": "reference",
          "label": "Session / submission reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "next",
          "label": "Next action",
          "type": "select",
          "options": [
            "View receipt and revision history",
            "Contact authorized school administrator"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher understands the recorded result and the administrator’s correction route.",
  "rule": "No attendance.correct from the Teacher role. Show original submission and permitted correction history with safe reasons.",
  "recovery": "If the current assignment no longer authorizes the record, deny rather than revealing historical rosters.",
  "data": "Read Session → frozen roster → effective records/revisions plus scoped receipt. Phase 1 support handoff creates no correction or hidden request record.",
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
