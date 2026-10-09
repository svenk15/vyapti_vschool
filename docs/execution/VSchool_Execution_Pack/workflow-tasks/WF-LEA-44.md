# WF-LEA-44 — Coordinate a school service interruption

Source workflow: LEA-44. Workspace: VSchool_Principal_Leadership_Workflows. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-44",
  "area": "services",
  "title": "Coordinate a school service interruption",
  "phase": 6,
  "trigger": "Transport, library, facilities or another enabled service reports an operational issue.",
  "actors": "Principal; authorized Finance / individual service owners owner",
  "preconditions": "Specific service released, operational oversight grant and current incident owner.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open the affected service notice.",
      "result": "See scope, published impact and safe last update."
    },
    {
      "actor": "Principal",
      "action": "Coordinate with responsible service team.",
      "result": "Assign an action without inheriting specialist permissions."
    },
    {
      "actor": "Principal",
      "action": "Approve a targeted communication only if delegated.",
      "result": "Audience and facts verified by source owner."
    },
    {
      "actor": "System / owner",
      "action": "Verify restoration using owner evidence.",
      "result": "Resolution, communication delivery and pending follow-ups remain separate."
    }
  ],
  "fields": [
    {
      "name": "Service/scope",
      "rule": "Exact branch and affected period."
    },
    {
      "name": "Owner/due",
      "rule": "Eligible service coordinator."
    },
    {
      "name": "Update",
      "rule": "Published facts; no speculative arrival time or live tracking promise."
    }
  ],
  "outcome": "Owned service response and verified update.",
  "exceptions": [
    "No telemetry: do not invent live vehicle location.",
    "Restricted safety/health content routes separately."
  ],
  "authorization": "Operational service summary does not expose passenger addresses, driver private data or full case records.",
  "reads": "Service incident/status projection and current assignee.",
  "writes": "Service-owner coordination action and approved notice.",
  "acceptance": "Restored service does not automatically mark all recipients informed.",
  "priority": "Later",
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
