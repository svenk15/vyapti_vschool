# WF-TEA-36 — Refer a student concern safely

Source workflow: TEA-36. Workspace: VSchool_Teacher_Design. Source area: wellbeing. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-36",
  "area": "wellbeing",
  "title": "Refer a student concern safely",
  "phase": 6,
  "capability": "restricted referral.create; assigned pupil context",
  "entry": "wellbeing",
  "steps": [
    {
      "title": "Minimal referral",
      "help": "Use the school’s approved reporting protocol. Do not include clinical detail in shared notes.",
      "fields": [
        {
          "name": "student",
          "label": "Student in assigned class",
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
            "Urgent: follow school emergency procedure"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Restricted handoff",
      "help": "Only the authorized specialist receives sensitive details through the approved channel.",
      "fields": [
        {
          "name": "recipient",
          "label": "Team",
          "type": "select",
          "options": [
            "School health lead",
            "Safeguarding lead"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reference",
          "label": "Restricted handoff reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A minimal referral is handed to an authorized specialist with accountable status.",
  "rule": "Teacher role gives no full clinical, custody or safeguarding case access. No automatic parent notification for a sensitive concern.",
  "recovery": "Unavailable recipient or urgent danger uses the approved human escalation protocol; do not leave an urgent case in a generic queue.",
  "data": "Restricted referral metadata and purpose grant; specialist case remains owned by Health/Safeguarding. General audit carries only safe references.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
