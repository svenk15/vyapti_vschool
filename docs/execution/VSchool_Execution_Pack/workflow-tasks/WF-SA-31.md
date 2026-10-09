# WF-SA-31 — Compare trends and assign follow-up

Source workflow: SA-31. Workspace: VSchool_School_Admin_Design. Source area: reports. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-31",
  "module": "reports",
  "title": "Compare trends and assign follow-up",
  "phase": 2,
  "capability": "report.read + followup.manage (proposed)",
  "steps": [
    {
      "title": "Review the metric",
      "help": "Compare compatible periods with definition, denominator and freshness.",
      "fields": [
        {
          "name": "metric",
          "label": "Metric",
          "type": "select",
          "options": [
            "Submission completeness",
            "Unexplained absence follow-up"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "from",
          "label": "From date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "To date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Follow up",
      "help": "Create a purpose-limited action for an authorized colleague.",
      "fields": [
        {
          "name": "owner",
          "label": "Owner",
          "type": "select",
          "options": [
            "School office",
            "Class teacher"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "action",
          "label": "Follow-up action",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The concern has an owner, due date and source evidence.",
  "rule": "Structured follow-up is a proposed extension, not claimed Phase 2 implementation; no punitive automated scoring.",
  "edge": "Low sample sizes, partial data and changed permissions limit drilldowns.",
  "data": "Reporting read model; proposed FollowUpCase stores references and minimal notes, with separate module design before implementation."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
