# WF-SA-10 — Configure grades, sections and subjects

Source workflow: SA-10. Workspace: VSchool_School_Admin_Design. Source area: academics. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-10",
  "module": "academics",
  "title": "Configure grades, sections and subjects",
  "phase": 1,
  "capability": "class.manage",
  "steps": [
    {
      "title": "Class structure",
      "help": "Codes are unique within the documented branch/year scope.",
      "fields": [
        {
          "name": "grade",
          "label": "Grade",
          "type": "select",
          "options": [
            "Grade 6",
            "Grade 7",
            "Grade 8"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "section",
          "label": "Section code",
          "type": "text",
          "options": [],
          "required": true,
          "value": "C"
        },
        {
          "name": "subject",
          "label": "Subject name",
          "type": "text",
          "options": [],
          "required": true,
          "value": "Science"
        }
      ]
    },
    {
      "title": "Review dependencies",
      "help": "Referenced records can be retired prospectively, never deleted from history.",
      "fields": [
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
  "outcome": "The class and subject are available for offering setup.",
  "rule": "Do not silently merge duplicate names; enforce scoped code constraints.",
  "edge": "An in-use record shows dependency counts and a supported retirement path.",
  "data": "Academics owns Grade, Section and Subject; enrollment placements and offerings reference their identities."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
