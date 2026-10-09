# WF-LEA-46 — Manage sessions, preferences and school support

Source workflow: LEA-46. Workspace: VSchool_Principal_Leadership_Workflows. Source area: account. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-46",
  "area": "account",
  "title": "Manage sessions, preferences and school support",
  "phase": 1,
  "trigger": "Leader signs out, checks session security or changes personal preferences.",
  "actors": "Principal; authorized Access + Preferences owner",
  "preconditions": "Existing Access/session policy and own-account identity.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open My account.",
      "result": "Show own sessions and allowed preferences."
    },
    {
      "actor": "Principal",
      "action": "Change an approved preference or revoke a session.",
      "result": "Identity/contact changes follow existing verification, not a direct profile write."
    },
    {
      "actor": "Principal",
      "action": "Confirm sensitive action if policy requires.",
      "result": "Server acknowledges revocation before claiming success."
    },
    {
      "actor": "System / owner",
      "action": "Sign out from the separate session action.",
      "result": "Clear protected context and local drafts under documented policy."
    }
  ],
  "fields": [
    {
      "name": "Preferences",
      "rule": "Own allowed keys; required security notices labelled."
    },
    {
      "name": "Session",
      "rule": "Own session reference only."
    },
    {
      "name": "Support",
      "rule": "School-approved contact route."
    }
  ],
  "outcome": "Controlled personal account state.",
  "exceptions": [
    "Unsaved draft: save/discard before leaving; unknown command: preserve safe reference and reconcile.",
    "Failed revoke cannot say session ended."
  ],
  "authorization": "Own-account management grants no staff-user administration.",
  "reads": "Own sessions/preferences and safe support configuration.",
  "writes": "Access owner revocation/preference/verified-change workflow.",
  "acceptance": "Sign out is visually separate from name/role and protects shared-device data.",
  "priority": "First release",
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
