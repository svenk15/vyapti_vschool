# WF-SA-61 — Review connection status and reconcile a sync

Source workflow: SA-61. Workspace: VSchool_School_Admin_Design. Source area: integrations. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-61",
  "module": "integrations",
  "title": "Review connection status and reconcile a sync",
  "phase": 3,
  "capability": "integration.read / integration.manage (delegated)",
  "steps": [
    {
      "title": "Connection",
      "help": "Credentials remain in a secure store and never in the screen or audit.",
      "fields": [
        {
          "name": "connection",
          "label": "Connection",
          "type": "select",
          "options": [
            "Roster source",
            "Approved email provider"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Review status",
            "Preview sync",
            "Reconcile failed records"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review effects",
      "help": "Map source IDs and preview changes before committing.",
      "fields": [
        {
          "name": "reference",
          "label": "Reviewed sync reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "scope",
          "label": "The target branch and permitted changes are correct.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A scoped synchronization run has reconciled per-record outcomes.",
  "rule": "No unreviewed source overwrites; authenticated webhooks deduplicate and reauthorize.",
  "edge": "Unknown provider outcome, duplicate webhook and mapping conflict stay visible.",
  "data": "IntegrationCredentialRef, SyncRun, WebhookReceipt and owner module commands. No direct writes to another module’s tables."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
