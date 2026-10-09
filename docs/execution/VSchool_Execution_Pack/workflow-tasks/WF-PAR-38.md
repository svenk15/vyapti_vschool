# WF-PAR-38 — Track application requirements

Source workflow: PAR-38. Workspace: VSchool_Parent_Guardian_Design. Source area: admissions. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-38",
  "area": "admissions",
  "title": "Track application requirements",
  "phase": 3,
  "purpose": "own application read + allowed evidence upload",
  "steps": [
    {
      "title": "Application checklist",
      "help": "See only school-requested items and status.",
      "fields": [
        {
          "name": "application",
          "label": "Application reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Respond",
      "help": "Use restricted evidence handling and retain a clear receipt.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Review outstanding requirement",
            "Respond to school query",
            "Withdraw the application"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The applicant understands what remains outstanding and the school’s next decision.",
  "invariant": "Evidence is not a public attachment or ordinary message. File size/type/scan policy and review access must be defined before implementation.",
  "recovery": "Rejected evidence has a safe reason and resubmission path; do not erase previously reviewed versions.",
  "data": "ApplicationRequirement → evidence artifact/version → school disposition; object access is purpose scoped.",
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
