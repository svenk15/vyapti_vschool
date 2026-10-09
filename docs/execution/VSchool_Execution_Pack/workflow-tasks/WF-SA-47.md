# WF-SA-47 — Approve, publish or correct results

Source workflow: SA-47. Workspace: VSchool_School_Admin_Design. Source area: assessments. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-47",
  "module": "assessments",
  "title": "Approve, publish or correct results",
  "phase": 4,
  "capability": "assessment.approve / results.publish (explicit)",
  "steps": [
    {
      "title": "Review approved revision",
      "help": "Publication pins exact mark and approval revisions.",
      "fields": [
        {
          "name": "publication",
          "label": "Publication",
          "type": "select",
          "options": [
            "Grade 6 · Term 1"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Review publication",
            "Publish approved results",
            "Correct a published result"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Audience and confirmation",
      "help": "Only entitled, authorized family panels can receive the release.",
      "fields": [
        {
          "name": "reason",
          "label": "Reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "publish",
          "label": "The approved content and audience have been reviewed.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Published results or a linked correction are available with a timestamp.",
  "rule": "Draft edits never leak; approval and publication cannot race past changed marks.",
  "edge": "Changed revision requires reapproval; partial delivery does not unpublish the valid result.",
  "data": "ResultPublicationManifest references approved immutable MarkRevisions; Communication queues minimal notices."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
