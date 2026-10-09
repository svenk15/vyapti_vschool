# WF-STW-01 — Find the correct school sign-in

Source workflow: STW-01. Workspace: VSchool_Student_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-01",
  "area": "access",
  "title": "Find the correct school sign-in",
  "phase": 2,
  "goal": "Enter the school-issued workspace.",
  "steps": [
    {
      "title": "Use school link",
      "instruction": "Check school name and branch; use the school-issued sign-in link."
    },
    {
      "title": "Sign in",
      "instruction": "Use the student account assigned by school; no account enumeration or public pupil search."
    }
  ],
  "outcome": "Own permitted enrollment contexts.",
  "invariant": "A public school slug is branding, never authorization.",
  "recovery": "Invalid school link offers school contact; invalid credentials remain generic.",
  "data": "Published BrandProfile; UserAccount; verified StudentAccountLink; active Enrollment.",
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
