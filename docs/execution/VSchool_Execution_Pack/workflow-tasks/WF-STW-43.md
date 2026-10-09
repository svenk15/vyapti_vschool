# WF-STW-43 — Request student wellbeing support

Source workflow: STW-43. Workspace: VSchool_Student_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-43",
  "area": "services",
  "title": "Request student wellbeing support",
  "phase": 6,
  "goal": "Ask the authorized school team for support.",
  "steps": [
    {
      "title": "Understand visibility",
      "instruction": "Show who receives the request and school contact for urgent help."
    },
    {
      "title": "Send minimal request",
      "instruction": "Allow a brief description without compulsory health details; no confidentiality guarantee."
    }
  ],
  "outcome": "Restricted request receipt.",
  "invariant": "No automated diagnosis, risk score, covert parent disclosure or full health-record access.",
  "recovery": "Unavailable channel clearly routes to school contact; do not imply 24/7 monitoring.",
  "data": "Restricted support request + purpose grants + student-safe timeline.",
  "extension": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
