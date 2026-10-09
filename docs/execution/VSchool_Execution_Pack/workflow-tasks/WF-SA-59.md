# WF-SA-59 — Refer a health or safeguarding concern

Source workflow: SA-59. Workspace: VSchool_School_Admin_Design. Source area: health. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-59",
  "module": "health",
  "title": "Refer a health or safeguarding concern",
  "phase": 6,
  "capability": "restricted referral.create; case read requires explicit specialist grant",
  "steps": [
    {
      "title": "Minimal referral",
      "help": "Avoid sensitive details in shared dashboards and notifications.",
      "fields": [
        {
          "name": "student",
          "label": "Student",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "urgency",
          "label": "Urgency",
          "type": "select",
          "options": [
            "Routine specialist review",
            "Urgent: follow approved school emergency protocol"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Restricted handoff",
      "help": "This review prototype stores no clinical narrative.",
      "fields": [
        {
          "name": "reference",
          "label": "Restricted handoff reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "team",
          "label": "Authorized team",
          "type": "select",
          "options": [
            "School health lead",
            "Safeguarding lead"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An authorized specialist receives a minimal referral; general admins see only permitted handoff status.",
  "rule": "No diagnosis or clinical advice in the general school workspace; emergency action follows the approved local protocol.",
  "edge": "If the recipient lacks authority, route privately to the approved escalation contact; never broadcast.",
  "data": "Restricted referral and purpose grant; HealthProfile/Visit/Incident remain specialist-owned and separately access controlled."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
