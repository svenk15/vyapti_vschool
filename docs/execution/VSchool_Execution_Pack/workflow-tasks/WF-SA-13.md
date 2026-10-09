# WF-SA-13 — Create a staff profile

Source workflow: SA-13. Workspace: VSchool_School_Admin_Design. Source area: staff. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-13",
  "module": "staff",
  "title": "Create a staff profile",
  "phase": 1,
  "capability": "people.manage / current repository equivalent",
  "steps": [
    {
      "title": "Staff details",
      "help": "A staff record can exist without a login.",
      "fields": [
        {
          "name": "first",
          "label": "First name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "last",
          "label": "Last name",
          "type": "text",
          "options": [],
          "required": false,
          "value": ""
        },
        {
          "name": "code",
          "label": "Employee code",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "email",
          "label": "Work email",
          "type": "email",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    },
    {
      "title": "Employment",
      "help": "Choose a role label and effective employment dates.",
      "fields": [
        {
          "name": "type",
          "label": "Staff category",
          "type": "select",
          "options": [
            "Teaching",
            "Administration",
            "Support"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "from",
          "label": "Start date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An organization Person and branch Employee profile are linked deliberately.",
  "rule": "Email/name matches are not proof of identity or authority to merge people.",
  "edge": "Exact identity candidates need an explicit review; duplicate employee codes are rejected.",
  "data": "People owns Person and Employee with scoped uniqueness and explicit links. No account is automatically created."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
