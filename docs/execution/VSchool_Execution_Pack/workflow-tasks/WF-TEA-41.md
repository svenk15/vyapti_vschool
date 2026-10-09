# WF-TEA-41 — Carry out an assigned school duty

Source workflow: TEA-41. Workspace: VSchool_Teacher_Design. Source area: duties. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-41",
  "area": "duties",
  "title": "Carry out an assigned school duty",
  "phase": 6,
  "capability": "explicit dated duty / minimal roster grant (proposed)",
  "entry": "duties",
  "steps": [
    {
      "title": "Duty scope",
      "help": "An event or transport duty does not grant full student access.",
      "fields": [
        {
          "name": "duty",
          "label": "Assignment",
          "type": "select",
          "options": [
            "Assembly supervision",
            "Approved trip support",
            "Pickup duty"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Record accountable handoff",
      "help": "Follow the approved duty-specific procedure.",
      "fields": [
        {
          "name": "reference",
          "label": "Duty / handoff reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "status",
          "label": "Status",
          "type": "select",
          "options": [
            "Completed assigned check",
            "Escalated to duty lead"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The assigned duty records a minimal outcome and responsible handoff.",
  "rule": "Proposed extension: explicit activity-specific grant, dates and authorized pickup/handoff rules must precede implementation. No unrestricted live child location.",
  "recovery": "Wrong-child handoff, missing pickup authority or offline uncertainty uses the approved human fallback.",
  "data": "Proposed DutyAssignment/Outcome; Transport or activity owner supplies minimal authorized manifest and records domain-specific effects.",
  "proposal": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
