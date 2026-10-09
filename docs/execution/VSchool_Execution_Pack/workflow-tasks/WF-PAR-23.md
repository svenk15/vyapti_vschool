# WF-PAR-23 — Read published results

Source workflow: PAR-23. Workspace: VSchool_Parent_Guardian_Design. Source area: results. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-23",
  "area": "results",
  "title": "Read published results",
  "phase": 4,
  "purpose": "results.read_child",
  "steps": [
    {
      "title": "Published report",
      "help": "Choose a published reporting period.",
      "fields": [
        {
          "name": "period",
          "label": "Reporting period",
          "type": "select",
          "options": [
            "Term 1 · Published version 1"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Understand outcomes",
      "help": "Show the scheme, scale and teacher comments that were approved for release.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Subject outcomes",
            "Published comments",
            "Scale explanation"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent understands the official published result version.",
  "invariant": "Unentered, Absent and Exempt do not become zero. Draft marks/moderation are excluded. No sibling/class ranking by default.",
  "recovery": "Withheld, unpublished, superseded and unavailable have different user messages without leaking private reasons.",
  "data": "PublishedResultVersion → child’s approved outcomes + SchemeVersion and permitted comments.",
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
