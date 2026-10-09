# WF-PAR-14 — Read and acknowledge a school notice

Source workflow: PAR-14. Workspace: VSchool_Parent_Guardian_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-14",
  "area": "communication",
  "title": "Read and acknowledge a school notice",
  "phase": 2,
  "purpose": "notice audience grant for this account/child",
  "steps": [
    {
      "title": "Read the notice",
      "help": "Show the published version and the child/school audience.",
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
      "title": "Acknowledge",
      "help": "Acknowledgement requires a deliberate action.",
      "fields": [
        {
          "name": "acknowledge",
          "label": "I acknowledge this notice.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The exact published notice version is acknowledged with a timestamp.",
  "invariant": "Read, delivered and acknowledged are separate. Editing a notice may require a new acknowledgement; an open page is not consent.",
  "recovery": "Withdrawn/changed notice or revoked audience cannot be silently acknowledged.",
  "data": "Notice/version + audience snapshot + explicit AccountAcknowledgement; recheck current grant on attachment access.",
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
