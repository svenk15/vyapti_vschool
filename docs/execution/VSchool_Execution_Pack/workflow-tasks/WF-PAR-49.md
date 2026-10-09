# WF-PAR-49 — Update my verified contact details

Source workflow: PAR-49. Workspace: VSchool_Parent_Guardian_Design. Source area: account. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-49",
  "area": "account",
  "title": "Update my verified contact details",
  "phase": 2,
  "purpose": "account self-update with step-up verification",
  "steps": [
    {
      "title": "New contact",
      "help": "Change your own account contact, not the child’s guardian relationship.",
      "fields": [
        {
          "name": "email",
          "label": "New email address",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Verification",
      "help": "Private delivery must not move to an unverified destination.",
      "fields": [
        {
          "name": "verify",
          "label": "I will complete the school-approved verification and recovery checks.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A pending contact change becomes effective only after the required verification.",
  "invariant": "Do not overwrite identity binding or relationship evidence from a contact edit. Existing compromise controls and account-wide recovery policy remain active.",
  "recovery": "Failed verification/expired token preserves the current verified contact; suspicious change uses the verified support route.",
  "data": "Access PendingContactChange/token hash and verified contact; Communication uses only approved effective channels.",
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
