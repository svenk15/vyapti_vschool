# WF-TEA-01 — Sign in to the school workspace

Source workflow: TEA-01. Workspace: VSchool_Teacher_Design. Source area: access. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-01",
  "area": "access",
  "title": "Sign in to the school workspace",
  "phase": 1,
  "capability": "active account + branch membership",
  "entry": "sign-in",
  "steps": [
    {
      "title": "School entry",
      "help": "Published school branding helps recognition; it does not grant access.",
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
      "title": "Authorized workspace",
      "help": "Skip branch selection when only one branch is permitted.",
      "fields": [
        {
          "name": "branch",
          "label": "Branch",
          "type": "select",
          "options": [
            "Whitefield",
            "Indiranagar"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "My Teaching Day opens in the authorized branch.",
  "rule": "Resolve permissions server-side. A Teacher role alone does not establish employee identity, dated eligibility or class assignment.",
  "recovery": "Generic credential rejection; revoked/suspended access exposes no roster. Safe return URLs only.",
  "data": "Access reads global UserAccount, branch SchoolMembership/RoleGrant and institution/branch state; creates verified session/context.",
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
