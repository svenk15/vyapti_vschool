# WF-PAR-51 — Request access, correction or privacy support

Source workflow: PAR-51. Workspace: VSchool_Parent_Guardian_Design. Source area: account. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-51",
  "area": "account",
  "title": "Request access, correction or privacy support",
  "phase": 2,
  "purpose": "own privacy request; school verification required",
  "steps": [
    {
      "title": "Privacy request",
      "help": "The school determines permitted records and identity verification.",
      "fields": [
        {
          "name": "type",
          "label": "Request type",
          "type": "select",
          "options": [
            "Ask about my data",
            "Request a correction",
            "Request access or deletion review"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Scope",
      "help": "Use safe references, not private evidence attachments.",
      "fields": [
        {
          "name": "note",
          "label": "Brief request",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A privacy request is acknowledged and routed for verified review.",
  "invariant": "Do not promise a legal deadline, automatic deletion of school records or another guardian’s data. Retention and child rights require jurisdiction-specific design.",
  "recovery": "Identity not established, shared record restrictions or retained obligations produce a reasoned owner response.",
  "data": "PrivacyRequest actor/scope/reference; audited owner review across modules with governed exports, no arbitrary SQL download.",
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
