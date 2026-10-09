# WF-SA-34 — Change, restrict or revoke a guardian link

Source workflow: SA-34. Workspace: VSchool_School_Admin_Design. Source area: families. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-34",
  "module": "families",
  "title": "Change, restrict or revoke a guardian link",
  "phase": 2,
  "capability": "guardian.relationship.manage",
  "steps": [
    {
      "title": "Choose connection and change",
      "help": "The scope and impact stay visible; other children remain unaffected.",
      "fields": [
        {
          "name": "connection",
          "label": "Connection",
          "type": "select",
          "options": [
            "Authorized child connection"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "change",
          "label": "Manage access",
          "type": "select",
          "options": [
            "Change access dates",
            "Remove portal access",
            "End relationship"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Confirm the intended effect",
      "help": "Date changes require fresh acceptance. Portal removal does not determine legal guardianship. Ending the school record requires a verified decision reference.",
      "fields": [
        {
          "name": "reason",
          "label": "Bounded reason or school decision reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "confirm",
          "label": "Confirm the selected action",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The exact child grant or school relationship changes with history preserved; old invitations and protected views recheck current access.",
  "rule": "Keep portal revocation, relationship end and purpose changes separate. Preserve sibling and other-institution grants and source attendance.",
  "edge": "If a record is disputed, escalate privately and avoid notifying an unsafe recipient automatically.",
  "data": "Guardians grant revision/revocation, binding read and cancellation/suppression contracts for queued delivery.",
  "subjourneys": [
    "change dates",
    "remove portal access",
    "end school relationship",
    "safe audit history",
    "old-link denial"
  ]
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
