# WF-PAR-36 — Respond to a permission or consent form

Source workflow: PAR-36. Workspace: VSchool_Parent_Guardian_Design. Source area: requests. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-36",
  "area": "requests",
  "title": "Respond to a permission or consent form",
  "phase": 3,
  "purpose": "consent.respond for verified authorized signer",
  "steps": [
    {
      "title": "Read the request",
      "help": "Review the exact purpose, scope, dates and document version.",
      "fields": [
        {
          "name": "form",
          "label": "Form",
          "type": "select",
          "options": [
            "Science museum visit · Version 1"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Your decision",
      "help": "Choices are unselected until a deliberate decision.",
      "fields": [
        {
          "name": "decision",
          "label": "Decision",
          "type": "select",
          "options": [
            "Consent",
            "Do not consent"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "read",
          "label": "I have read this version of the information.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An explicit decision records signer, child, purpose, document version and time.",
  "invariant": "No preselected consent, bundled unrelated purposes or assumption that every guardian may sign alone. School policy defines required signers and withdrawal effects.",
  "recovery": "Changed form, deadline passed or signer grant removed requires a safe re-review. Withdrawal is a separate traceable decision when policy allows.",
  "data": "ConsentRequest/version + SignerPolicy + immutable ConsentDecision; one guardian’s response cannot satisfy an unfulfilled second-signature requirement.",
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
