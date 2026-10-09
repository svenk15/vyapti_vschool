# WF-TEA-13 — Handle a stale register or lost permission

Source workflow: TEA-13. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-13",
  "area": "attendance",
  "title": "Handle a stale register or lost permission",
  "phase": 1,
  "capability": "current assignment and session state",
  "entry": "flow/TEA-13",
  "steps": [
    {
      "title": "Understand the change",
      "help": "Explain a revision conflict separately from revoked access.",
      "fields": [
        {
          "name": "change",
          "label": "Change",
          "type": "select",
          "options": [
            "Session revision changed",
            "Session cancelled",
            "Assignment or membership revoked"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Safe next action",
      "help": "Protected input can be retained only while the teacher remains authorized.",
      "fields": [
        {
          "name": "next",
          "label": "Action",
          "type": "select",
          "options": [
            "Reload and review current authorized record",
            "Return to My Teaching Day"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher resolves a valid conflict or leaves an unavailable record without silent overwrite.",
  "rule": "409 requires explicit review; 401/403 clears protected draft data. Never silently replay an old roster against a new one.",
  "recovery": "A submitted record stays read-only; an unavailable record does not leak the new teacher or pupils.",
  "data": "Application rechecks live guards and returns safe errors. New reads query owner state under current scope; no automatic mutation.",
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
