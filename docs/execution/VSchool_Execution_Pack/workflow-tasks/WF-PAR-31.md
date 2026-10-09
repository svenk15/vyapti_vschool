# WF-PAR-31 — Ask about payer access

Source workflow: PAR-31. Workspace: VSchool_Parent_Guardian_Design. Source area: finance. Catalog phase: 5.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-31",
  "area": "finance",
  "title": "Ask about payer access",
  "phase": 5,
  "purpose": "support claim; no self-grant of finance authority",
  "steps": [
    {
      "title": "Payer access",
      "help": "An emergency contact or guardian is not automatically a payer.",
      "fields": [
        {
          "name": "issue",
          "label": "Issue",
          "type": "select",
          "options": [
            "I cannot see the invoice",
            "The payer relationship needs review",
            "Payment access should be removed"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "School verification",
      "help": "Use the school’s verified payer process.",
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
  "outcome": "The finance/relationship owner reviews a purpose-specific access request.",
  "invariant": "A payer-only contact must not gain academic or health access. No parent can add another payer or inherit their banking records.",
  "recovery": "Changed mandate invalidates pending payer actions and rechecks owner-controlled in-flight obligations.",
  "data": "PayerMandate/PurposeGrant remains owner controlled; FamilyRequest stores the claim and decision reference.",
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
