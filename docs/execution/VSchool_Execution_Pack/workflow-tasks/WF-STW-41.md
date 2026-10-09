# WF-STW-41 — Join an enabled activity

Source workflow: STW-41. Workspace: VSchool_Student_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-41",
  "area": "services",
  "title": "Join an enabled activity",
  "phase": 6,
  "goal": "Explore eligible activities and request a place.",
  "steps": [
    {
      "title": "Review activity",
      "instruction": "Show schedule, eligibility, places and any required guardian consent."
    },
    {
      "title": "Request place",
      "instruction": "Record interest; confirm only after allocation and required approvals."
    }
  ],
  "outcome": "Requested/waitlisted/confirmed state from owner.",
  "invariant": "Interest is separate from guardian consent, payment and attendance.",
  "recovery": "Full activity offers waitlist only if enabled; changed schedule requires new review.",
  "data": "ActivityOffer + registration + allocation + Consent reference.",
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
