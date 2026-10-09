# WF-SA-26 — Monitor and inspect attendance

Source workflow: SA-26. Workspace: VSchool_School_Admin_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-26",
  "module": "attendance",
  "title": "Monitor and inspect attendance",
  "phase": 1,
  "capability": "attendance.read_school / attendance.read_class",
  "steps": [
    {
      "title": "Choose the scope",
      "help": "Completeness and attendance rate are separate metrics.",
      "fields": [
        {
          "name": "day",
          "label": "School date",
          "type": "date",
          "options": [],
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
        }
      ]
    },
    {
      "title": "Open a register",
      "help": "Read its roster, submission state and revision history.",
      "fields": [
        {
          "name": "session",
          "label": "Session",
          "type": "select",
          "options": [
            "Mathematics · 09:00 · Submitted",
            "English · 10:00 · Not submitted",
            "Science · 11:15 · Scheduled"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The exact session and its submission evidence are shown.",
  "rule": "School admin is not granted attendance.mark by default; link to assigned teacher, never impersonate them.",
  "edge": "Cancelled and unsubmitted sessions are distinct from absent pupils; missing denominator displays unavailable.",
  "data": "Read scoped Session → frozen roster → records/revisions, with current authorization and data-as-of timestamp."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
