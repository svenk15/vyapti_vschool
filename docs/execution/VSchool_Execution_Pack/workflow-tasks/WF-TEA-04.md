# WF-TEA-04 — Review my account and sessions

Source workflow: TEA-04. Workspace: VSchool_Teacher_Design. Source area: access. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-04",
  "area": "access",
  "title": "Review my account and sessions",
  "phase": 1,
  "capability": "self.read; self-service session actions must match existing Access contract",
  "entry": "account",
  "steps": [
    {
      "title": "My account",
      "help": "Review only your own safe account and branch memberships.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Account details",
            "Authorized branches",
            "Session information"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Account action",
      "help": "Role, employee identity and permissions are changed by their authorized owner.",
      "fields": [
        {
          "name": "action",
          "label": "Next action",
          "type": "select",
          "options": [
            "Use password recovery",
            "Contact school administrator",
            "Sign out of this session"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher understands their identity, access and permitted account actions.",
  "rule": "No self-service role escalation, arbitrary branch addition or global identity editing. Listing/revoking other own sessions is an extension unless the repository already supports it.",
  "recovery": "A stale or expired session returns to school sign-in; never disclose token material.",
  "data": "Access self DTO from UserAccount/session/membership; no salary, guardian grant or administrator-only record joins.",
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
