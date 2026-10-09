# WF-SA-15 — Review invitation or resend access

Source workflow: SA-15. Workspace: VSchool_School_Admin_Design. Source area: staff. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-15",
  "module": "staff",
  "title": "Review invitation or resend access",
  "phase": 1,
  "capability": "user.manage",
  "steps": [
    {
      "title": "Review access state",
      "help": "Separate membership state from delivery and activation.",
      "fields": [
        {
          "name": "staff",
          "label": "Staff member",
          "type": "select",
          "options": [
            "Nikhil Menon · Pending activation",
            "Nikhil Menon · Delivery-failure scenario"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Retry safely",
      "help": "Revoke the previous invitation before issuing a replacement.",
      "fields": [
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The new invitation attempt has an expiry and an honest delivery outcome.",
  "rule": "Do not activate on send, silently retry in a worker, expose tokens or reuse a failed token.",
  "edge": "Policy tightened, account blocked or expired grant explains why resend is unavailable.",
  "data": "Access token revoke + fresh issue + audit commit before email seam; sanitized delivery failure recorded afterward."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
