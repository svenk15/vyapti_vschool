# WF-SA-39 — Review application and make a decision

Source workflow: SA-39. Workspace: VSchool_School_Admin_Design. Source area: admissions. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-39",
  "module": "admissions",
  "title": "Review application and make a decision",
  "phase": 3,
  "capability": "admissions.review / decision delegation",
  "steps": [
    {
      "title": "Review evidence",
      "help": "Review only the documents within your assigned role.",
      "fields": [
        {
          "name": "application",
          "label": "Application",
          "type": "select",
          "options": [
            "APP-2712 · Nisha Patel"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "review",
          "label": "Review stage",
          "type": "select",
          "options": [
            "Checklist review",
            "Interview",
            "Decision review"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Decision",
      "help": "Separate reviewer recommendation from authorized decision.",
      "fields": [
        {
          "name": "decision",
          "label": "Decision",
          "type": "select",
          "options": [
            "Recommend offer",
            "Waitlist",
            "Decline",
            "Request information"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The decision revision and next action are recorded.",
  "rule": "Seat reservation and offer expiry must be atomic; subjective notes remain restricted.",
  "edge": "Last-seat conflicts and expired decision authority require refreshed capacity and delegation.",
  "data": "Admissions decision revision, capacity/offer reservation and audit; document download reauthorizes."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
