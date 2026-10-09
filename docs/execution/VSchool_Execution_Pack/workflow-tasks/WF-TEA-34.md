# WF-TEA-34 — Submit marks for moderation

Source workflow: TEA-34. Workspace: VSchool_Teacher_Design. Source area: assessments. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-34",
  "area": "assessments",
  "title": "Submit marks for moderation",
  "phase": 4,
  "capability": "assessment.submit for owned marks; moderator action separately delegated",
  "entry": "flow/TEA-34",
  "steps": [
    {
      "title": "Readiness",
      "help": "Check required marks and unresolved exceptions.",
      "fields": [
        {
          "name": "assessment",
          "label": "Assessment",
          "type": "select",
          "options": [
            "Fractions check · Grade 6 A"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "ready",
          "label": "The configured readiness checks are satisfied.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Submit reviewed revision",
      "help": "Moderators see the exact submitted version.",
      "fields": [
        {
          "name": "comment",
          "label": "Message to moderator",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The selected revision is awaiting moderation or returned with a reason.",
  "rule": "Teacher submission does not approve its own marks by default. Explicit delegation governs moderator actions.",
  "recovery": "Any changed marks invalidate the previous approval scope; returned marks keep review history.",
  "data": "Assessment moderation/approval request pins MarkRevisions; owner transaction prevents stale submit/approve races.",
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
