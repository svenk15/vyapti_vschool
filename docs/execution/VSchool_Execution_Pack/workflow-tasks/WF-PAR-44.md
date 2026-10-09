# WF-PAR-44 — Request an extracurricular place

Source workflow: PAR-44. Workspace: VSchool_Parent_Guardian_Design. Source area: services. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-44",
  "area": "services",
  "title": "Request an extracurricular place",
  "phase": 6,
  "purpose": "activity.enroll_request for child (proposed)",
  "steps": [
    {
      "title": "Activity",
      "help": "Review eligibility, schedule and any fee separately.",
      "fields": [
        {
          "name": "activity",
          "label": "Activity",
          "type": "select",
          "options": [
            "School science club",
            "School music group"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Request place",
      "help": "A request can be waitlisted; consent/payment are separate.",
      "fields": [
        {
          "name": "confirm",
          "label": "I have checked the child’s schedule and activity requirements.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The request becomes pending, waitlisted, confirmed or declined.",
  "invariant": "No overbooking under concurrent requests. A guardian request does not itself satisfy consent or settle a charge.",
  "recovery": "Capacity changed, withdrawal, schedule conflict and expired offer have owner-controlled outcomes.",
  "data": "Proposed ActivityOffering/CapacityReservation/ParticipationRequest; Consent and Finance stay independent.",
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
