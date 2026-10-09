# WF-STW-18 — Revise and resubmit returned work

Source workflow: STW-18. Workspace: VSchool_Student_Design. Source area: assignments. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-18",
  "area": "assignments",
  "title": "Revise and resubmit returned work",
  "phase": 3,
  "goal": "Respond to teacher feedback without losing prior evidence.",
  "steps": [
    {
      "title": "Read returned feedback",
      "instruction": "Show exact attempt and whether revisions are allowed."
    },
    {
      "title": "Create revised draft",
      "instruction": "Create from an explicit prior attempt; submit a new numbered immutable attempt."
    }
  ],
  "outcome": "New attempt; previous submission and feedback remain traceable.",
  "invariant": "Feedback return does not itself reopen submission; policy/teacher permission must allow it.",
  "recovery": "Closed window or revoked permission blocks new attempt without altering old evidence.",
  "data": "Attempt revision chain + reopened policy + draft + feedback version.",
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
