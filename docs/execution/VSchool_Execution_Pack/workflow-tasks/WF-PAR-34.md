# WF-PAR-34 — Request a child-record update

Source workflow: PAR-34. Workspace: VSchool_Parent_Guardian_Design. Source area: requests. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-34",
  "area": "requests",
  "title": "Request a child-record update",
  "phase": 3,
  "purpose": "record-change request; no direct master-data write",
  "steps": [
    {
      "title": "What changed?",
      "help": "The school verifies changes to official records.",
      "fields": [
        {
          "name": "category",
          "label": "Update category",
          "type": "select",
          "options": [
            "Preferred contact arrangement",
            "Student name correction",
            "Address correction"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Request details",
      "help": "Identity evidence uses the school’s restricted verification route.",
      "fields": [
        {
          "name": "note",
          "label": "Requested change",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "verify",
          "label": "I understand that the school will verify the change.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A pending change request is linked to the student record, without editing it directly.",
  "invariant": "No direct legal-name, custody, enrollment or guardian-grant edits. Account contact and child master data are different workflows.",
  "recovery": "Reject stale/disallowed edits safely; approved change has its own owner event/version.",
  "data": "ChangeRequest references Student/Person field category; Students/Guardians owner applies verified changes.",
  "extension": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
