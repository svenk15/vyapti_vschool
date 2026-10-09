# WF-TEA-06 — Resolve a missing or changed assignment

Source workflow: TEA-06. Workspace: VSchool_Teacher_Design. Source area: today. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-06",
  "area": "today",
  "title": "Resolve a missing or changed assignment",
  "phase": 1,
  "capability": "self.read + minimal assignment status",
  "entry": "flow/TEA-06",
  "steps": [
    {
      "title": "Readiness",
      "help": "Show the safe reason the teaching day is incomplete.",
      "fields": [
        {
          "name": "issue",
          "label": "Issue",
          "type": "select",
          "options": [
            "No active teaching assignment",
            "Teacher eligibility not ready",
            "Session changed or cancelled"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Handoff",
      "help": "The teacher cannot repair identity, eligibility or assignments themselves.",
      "fields": [
        {
          "name": "reference",
          "label": "Safe support reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": "TEACH-SETUP-108"
        },
        {
          "name": "next",
          "label": "Next step",
          "type": "select",
          "options": [
            "Contact school administrator",
            "Refresh after administrator update"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The teacher has a precise, non-sensitive handoff and a retry route.",
  "rule": "Never widen access, create an assignment or offer another teacher’s session to fill an empty page.",
  "recovery": "If assignment is revoked while open, stop access and clear protected draft data.",
  "data": "Read Access/People/Academics readiness through published minimal contracts. Phase 1 handoff is informational, not a new ticket system.",
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
