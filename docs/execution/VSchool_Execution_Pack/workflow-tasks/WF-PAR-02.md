# WF-PAR-02 — Sign in through the school page

Source workflow: PAR-02. Workspace: VSchool_Parent_Guardian_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-02",
  "area": "access",
  "title": "Sign in through the school page",
  "phase": 2,
  "purpose": "active account; child-purpose authorization after sign-in",
  "steps": [
    {
      "title": "Sign in",
      "help": "Published school branding gives context, not access.",
      "fields": [
        {
          "name": "email",
          "label": "Email address",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "password",
          "label": "Password",
          "type": "password",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Choose a workspace",
      "help": "Only currently permitted family contexts appear.",
      "fields": [
        {
          "name": "destination",
          "label": "Start with",
          "type": "select",
          "options": [
            "My family overview",
            "My selected child"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent enters an authorized family workspace and sees the current child context.",
  "invariant": "No admission-number plus birth-date public child lookup. Account identity and relationship authority remain separate. Safe internal return URLs only.",
  "recovery": "Use generic credential rejection. Empty links lead to school contact; suspended access does not reveal child names.",
  "data": "Access session → active GuardianRelationship/PurposeGrant → minimal permitted child summaries.",
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
