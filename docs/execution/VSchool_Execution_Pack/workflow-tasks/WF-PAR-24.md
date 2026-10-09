# WF-PAR-24 — Download an authorized report

Source workflow: PAR-24. Workspace: VSchool_Parent_Guardian_Design. Source area: results. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-24",
  "area": "results",
  "title": "Download an authorized report",
  "phase": 4,
  "purpose": "results.download_child",
  "steps": [
    {
      "title": "Report version",
      "help": "Choose the exact published report.",
      "fields": [
        {
          "name": "report",
          "label": "Report",
          "type": "select",
          "options": [
            "Term 1 report · Version 1"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Download",
      "help": "Confirm the device and intended child.",
      "fields": [
        {
          "name": "device",
          "label": "I am using a device suitable for this child’s school records.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A permitted report download is issued and its version is clear.",
  "invariant": "Authorize every download; use short-lived delivery links. URLs are not permanent authorization. No other child in filenames or shared caches.",
  "recovery": "Revoked access or superseded report requires a fresh authorized request.",
  "data": "Document owner references immutable published result version; audit only minimal download metadata.",
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
