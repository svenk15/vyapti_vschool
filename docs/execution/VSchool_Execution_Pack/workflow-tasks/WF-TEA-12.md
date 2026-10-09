# WF-TEA-12 — Recover an uncertain submission

Source workflow: TEA-12. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-12",
  "area": "attendance",
  "title": "Recover an uncertain submission",
  "phase": 1,
  "capability": "same authorized command / receipt scope",
  "entry": "attendance/a1",
  "steps": [
    {
      "title": "Check status",
      "help": "An interrupted response can mean the server has already committed.",
      "fields": [
        {
          "name": "recovery",
          "label": "Recovery action",
          "type": "select",
          "options": [
            "Check existing request status",
            "Retry the unchanged request when confirmed safe"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Resolve the outcome",
      "help": "A new key would be a new intent; do not create one blindly.",
      "fields": [
        {
          "name": "receipt",
          "label": "I have resolved the current request before changing the draft.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "One logical submission is acknowledged without duplicated or overwritten attendance.",
  "rule": "Freeze payload/key while outcome is unknown. Receipt resolution reauthorizes; a receipt key is not a bearer credential.",
  "recovery": "If status check fails, remain Unknown. If not committed and still authorized, retry unchanged intent.",
  "data": "Read owner command receipt/current session using institution, branch, account and resource scope; no new business writes during status lookup.",
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
