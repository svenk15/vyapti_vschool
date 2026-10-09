# WF-SA-36 — Resolve failed delivery or missing acknowledgement

Source workflow: SA-36. Workspace: VSchool_School_Admin_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-36",
  "module": "communication",
  "title": "Resolve failed delivery or missing acknowledgement",
  "phase": 2,
  "capability": "communication.manage",
  "steps": [
    {
      "title": "Choose the notice or recipient",
      "help": "Inspect distinct publication, notification, reading and acknowledgement evidence.",
      "fields": [
        {
          "name": "notice",
          "label": "Notice",
          "type": "select",
          "options": [
            "Authorized current branch notice"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review the effect",
      "help": "Only the exact eligible recipient/version can be changed.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Retry confirmed failure",
            "Check unknown notification",
            "Remind pending recipients",
            "Record verified offline response",
            "Publish correction",
            "Withdraw notice"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reference",
          "label": "Safe reason or verification reference (when required)",
          "type": "text",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A permitted delivery attempt, reminder, version, withdrawal or verified offline response is recorded while previous evidence remains intact.",
  "rule": "Never infer acknowledgement, silently overwrite a published notice or blindly retry Unknown. Current recipient grants and independent offline-response authority are checked.",
  "edge": "Withdrawal/revocation/version change blocks stale reads and acknowledgements; already-sent email cannot be recalled. Correction retains the same NoticeId and asks for current-version acknowledgement.",
  "data": "Immutable NoticeVersion, append-only DeliveryAttempt and exact-version Acknowledgement with recipient and actual actor/method; scoped current grant queries and safe receipts.",
  "subjourneys": [
    "delivery failure",
    "unknown reconciliation",
    "reminder",
    "offline response",
    "correction",
    "previous versions",
    "withdrawal"
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
