# WF-SA-11 — Create an offering and assign a teacher

Source workflow: SA-11. Workspace: VSchool_School_Admin_Design. Source area: academics. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-11",
  "module": "academics",
  "title": "Create an offering and assign a teacher",
  "phase": 1,
  "capability": "class.manage",
  "steps": [
    {
      "title": "Teaching context",
      "help": "An offering connects class, subject and academic year.",
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
          "name": "year",
          "label": "Academic year",
          "type": "text",
          "options": [],
          "required": true,
          "value": "2026–27"
        }
      ]
    },
    {
      "title": "Teacher and dates",
      "help": "Only verified, eligible teachers appear.",
      "fields": [
        {
          "name": "teacher",
          "label": "Teacher",
          "type": "select",
          "options": [
            "Ananya Rao · EMP-001",
            "Rohan Das · EMP-002"
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
        }
      ]
    },
    {
      "title": "Review assignment",
      "help": "Check teacher eligibility and schedule clashes.",
      "fields": [
        {
          "name": "confirmed",
          "label": "I have reviewed the assignment period.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A dated teaching assignment is saved.",
  "rule": "Identity binding and teacher eligibility are separate from account activation; enforce non-overlap under the documented guard.",
  "edge": "A teacher becoming ineligible before save rejects the command and retains safe form input.",
  "data": "Academics owns Offering and Assignment; published People/Access contracts verify Employee, Person binding and membership."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
