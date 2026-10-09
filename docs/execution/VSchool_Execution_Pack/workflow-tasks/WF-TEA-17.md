# WF-TEA-17 — Read school notices and acknowledge

Source workflow: TEA-17. Workspace: VSchool_Teacher_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-17",
  "area": "communication",
  "title": "Read school notices and acknowledge",
  "phase": 2,
  "capability": "communication.read for explicit audience",
  "entry": "communication",
  "steps": [
    {
      "title": "Notice",
      "help": "Open a notice addressed to this teacher.",
      "fields": [
        {
          "name": "notice",
          "label": "Notice",
          "type": "select",
          "options": [
            "Term planning meeting",
            "School calendar update"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Acknowledge when requested",
      "help": "Read, delivered and acknowledged are different states.",
      "fields": [
        {
          "name": "ack",
          "label": "I acknowledge this notice.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A required acknowledgement records the teacher’s explicit action.",
  "rule": "Do not infer acknowledgement from an opened page or email tracking. Attachments reauthorize.",
  "recovery": "Edited/withdrawn notice or revoked audience membership has a safe update state.",
  "data": "Communication published notice/version + RecipientSnapshot + explicit acknowledgement; access derived from live audience.",
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
