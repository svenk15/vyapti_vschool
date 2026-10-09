# WF-PAR-07 — Review my family overview

Source workflow: PAR-07. Workspace: VSchool_Parent_Guardian_Design. Source area: home. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-07",
  "area": "home",
  "title": "Review my family overview",
  "phase": 2,
  "purpose": "current minimal summary for each active relationship",
  "steps": [
    {
      "title": "Family overview",
      "help": "Summaries are limited to currently permitted children and sources.",
      "fields": [
        {
          "name": "view",
          "label": "Show",
          "type": "select",
          "options": [
            "Actions needing me",
            "My linked children"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next action",
      "help": "Every item names its child and school.",
      "fields": [
        {
          "name": "next",
          "label": "Open",
          "type": "select",
          "options": [
            "Selected child dashboard",
            "A school request",
            "An unread school notice"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent reaches a relevant action without a school-wide dashboard or sibling comparisons.",
  "invariant": "No combined attendance percentage, combined cross-school payment basket or hidden child counts. Avoid labeling a child as at risk from incomplete data.",
  "recovery": "Partial module failure identifies the unavailable source and last-updated time without inventing a zero.",
  "data": "Compose authorized owner summaries per relationship; all-school counts never enter the parent read model.",
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
