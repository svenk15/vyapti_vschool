# WF-PAR-06 — Handle changed or withdrawn access

Source workflow: PAR-06. Workspace: VSchool_Parent_Guardian_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-06",
  "area": "access",
  "title": "Handle changed or withdrawn access",
  "phase": 2,
  "purpose": "live relationship and purpose check",
  "steps": [
    {
      "title": "Access changed",
      "help": "Show only a safe message and support reference.",
      "fields": [
        {
          "name": "next",
          "label": "Next step",
          "type": "select",
          "options": [
            "Return to permitted children",
            "Contact the school"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Leave safely",
      "help": "Clear protected screen state when access changes.",
      "fields": [
        {
          "name": "ack",
          "label": "I understand that previous access may no longer be available.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Protected child data is cleared and the parent receives a safe next step.",
  "invariant": "Recheck on reads, writes, downloads and delivery. Child-switch caches, search results and back navigation must not retain revoked data.",
  "recovery": "Never expose the private restriction reason, another guardian’s details or a previously authorized attachment.",
  "data": "Access/Guardians revocation event invalidates purpose caches; owner queries enforce current grants independently.",
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
