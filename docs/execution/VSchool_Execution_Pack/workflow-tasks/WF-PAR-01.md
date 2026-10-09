# WF-PAR-01 — Accept a school invitation

Source workflow: PAR-01. Workspace: VSchool_Parent_Guardian_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-01",
  "area": "access",
  "title": "Accept a school invitation",
  "phase": 2,
  "purpose": "school-verified relationship + account binding",
  "steps": [
    {
      "title": "School invitation",
      "help": "The public invitation identifies the school; child details appear only after the required identity checks.",
      "fields": [
        {
          "name": "channel",
          "label": "I am using the school’s verified invitation channel.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review permitted access",
      "help": "The school has already verified the relationship and its allowed purposes.",
      "fields": [
        {
          "name": "identity",
          "label": "The invited identity has been verified through the school’s required process.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "access",
          "label": "I have reviewed the child and permitted purposes.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The verified child link becomes active for this account, with its exact permitted purposes.",
  "invariant": "Email possession alone cannot prove a guardian relationship. Bind a single-use invitation to the verified relationship and intended account; never let the parent choose a child or expand grants.",
  "recovery": "Expired, wrong-account, revoked and delivery-failed invitations show safe help. Replaying a completed acceptance returns the existing outcome.",
  "data": "Guardians owns relationship verification/purpose grant; Access owns account and invitation token hash. Atomic acceptance rechecks both before activation.",
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
