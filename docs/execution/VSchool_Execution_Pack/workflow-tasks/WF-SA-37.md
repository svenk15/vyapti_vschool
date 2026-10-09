# WF-SA-37 — Review a family request

Source workflow: SA-37. Workspace: VSchool_School_Admin_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-37",
  "module": "communication",
  "title": "Review a family request",
  "phase": 2,
  "capability": "family.request.review",
  "steps": [
    {
      "title": "Open request",
      "help": "Limit each request to the relevant student and authorized office team.",
      "fields": [
        {
          "name": "request",
          "label": "Request",
          "type": "select",
          "options": [
            "Contact detail change",
            "Meeting request",
            "Student document request"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Respond",
      "help": "An approved request invokes the owning module’s use case.",
      "fields": [
        {
          "name": "decision",
          "label": "Decision",
          "type": "select",
          "options": [
            "Approve supported change",
            "Request more information",
            "Decline"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reply",
          "label": "Response",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The family sees the decision and any next step.",
  "rule": "Do not let a general message edit attendance, identity or financial records directly.",
  "edge": "Revoked child relationship blocks further disclosure; keep an internal audit of the decision.",
  "data": "Request owner records decision; Students/Documents/People execute permitted changes via explicit contracts."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
