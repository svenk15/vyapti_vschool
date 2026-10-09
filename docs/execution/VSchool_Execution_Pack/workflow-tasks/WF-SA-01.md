# WF-SA-01 — Sign in and choose a branch

Source workflow: SA-01. Workspace: VSchool_School_Admin_Design. Source area: home. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-01",
  "module": "home",
  "title": "Sign in and choose a branch",
  "phase": 1,
  "capability": "authenticated identity + active branch grant",
  "steps": [
    {
      "title": "School sign-in",
      "help": "Use the school’s published entry. Its branding does not grant access.",
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
      "title": "Choose your workspace",
      "help": "Only authorized branches appear. Skip this step when there is only one.",
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
  "outcome": "The administrator lands on Today in the chosen branch.",
  "rule": "Recheck institution, branch, membership and module state; return URLs must be allowlisted.",
  "edge": "Invalid credentials use a generic message; suspended access shows a support route, never another branch’s data.",
  "data": "UserAccount → SchoolMembership → RoleGrant → Organization / School. Read only; session issuance is owned by Access."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
