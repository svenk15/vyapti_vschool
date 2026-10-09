# WF-TEA-26 — Add and reuse teaching resources

Source workflow: TEA-26. Workspace: VSchool_Teacher_Design. Source area: learning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-26",
  "area": "learning",
  "title": "Add and reuse teaching resources",
  "phase": 3,
  "capability": "learning.resource.write + document permissions",
  "entry": "resources",
  "steps": [
    {
      "title": "Resource",
      "help": "Attach only material the school is permitted to use.",
      "fields": [
        {
          "name": "title",
          "label": "Resource title",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "file",
          "label": "Resource file",
          "type": "file",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Audience",
      "help": "File access follows the owning task/plan, not a public link.",
      "fields": [
        {
          "name": "audience",
          "label": "Audience",
          "type": "select",
          "options": [
            "Teaching team draft",
            "Assigned class after publication"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "review",
          "label": "I have reviewed the resource and its intended audience.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A safe, versioned resource is attached to the intended lesson or assignment.",
  "rule": "Scan before availability; sanitized preview; scope-bound short-lived downloads; accessible alternative instructions.",
  "recovery": "Upload progress, interruption, scan rejection and revoked audience remain explicit.",
  "data": "Documents FileAsset/ScanResult/DocumentVersion; Learning ResourceReference; read authorization rechecked at download.",
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
