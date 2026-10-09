# WF-TEA-02 — Activate or recover a teacher account

Source workflow: TEA-02. Workspace: VSchool_Teacher_Design. Source area: access. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-02",
  "area": "access",
  "title": "Activate or recover a teacher account",
  "phase": 1,
  "capability": "Access activation/recovery policy",
  "entry": "flow/TEA-02",
  "steps": [
    {
      "title": "Account help",
      "help": "Use the verified channel allowed by the institution and account-wide policy.",
      "fields": [
        {
          "name": "email",
          "label": "Account email",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "need",
          "label": "I need to",
          "type": "select",
          "options": [
            "Activate invited account",
            "Reset password"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next steps",
      "help": "The public response does not disclose whether the account exists.",
      "fields": [
        {
          "name": "ack",
          "label": "I will use the school’s verified recovery instructions.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A generic acknowledgement explains the permitted next step.",
  "rule": "Existing operator-issued and email-issued paths coexist. A stricter active institution can prevent an account-wide email reset at issue and consumption.",
  "recovery": "Expired/revoked/consumed/failed-delivery tokens fail safely. Resend and compromised-inbox recovery use their documented owner workflows.",
  "data": "Access owns token hashes, policy evaluation, single-use consume, session invalidation and sanitized delivery evidence. No secrets in drafts or audit.",
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
