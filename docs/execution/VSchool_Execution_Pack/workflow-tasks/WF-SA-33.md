# WF-SA-33 — Invite a verified guardian

Source workflow: SA-33. Workspace: VSchool_School_Admin_Design. Source area: families. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-33",
  "module": "families",
  "title": "Invite a verified guardian",
  "phase": 2,
  "capability": "guardian.invite",
  "steps": [
    {
      "title": "Choose approved connection",
      "help": "Open the exact verified relationship; use its verified contact, never enter an arbitrary replacement recipient.",
      "fields": [
        {
          "name": "connection",
          "label": "Connection",
          "type": "select",
          "options": [
            "Authorized active relationship"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review recipient and send",
      "help": "Trust policy selects email or the existing operator-assisted path. Review actual delivery state.",
      "fields": [
        {
          "name": "recipient",
          "label": "I checked the intended recipient.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An invitation has a visible delivery and acceptance state. Only intended-account acceptance activates the exact child’s approved grant.",
  "rule": "Recheck identity, trust mode, current policy, grant dates, purpose, restrictions and expected versions at acceptance; never treat parents as staff.",
  "edge": "Failed delivery cannot be consumed. Explicit resend replaces the old invitation. Expired, replaced, revoked and wrong-account links fail without exposing child data.",
  "data": "Guardians relationship and Access account binding; invite issue/consume with single-use hash, audit and delivery status.",
  "subjourneys": [
    "send",
    "delivery failure",
    "resend",
    "expiry",
    "intended-account acceptance",
    "my children",
    "attendance read"
  ]
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
