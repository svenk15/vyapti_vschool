# WF-PAR-32 — Submit a school request

Source workflow: PAR-32. Workspace: VSchool_Parent_Guardian_Design. Source area: requests. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-32",
  "area": "requests",
  "title": "Submit a school request",
  "phase": 2,
  "purpose": "request.create for permitted child/category",
  "steps": [
    {
      "title": "Request category",
      "help": "Show only school-enabled categories.",
      "fields": [
        {
          "name": "category",
          "label": "Category",
          "type": "select",
          "options": [
            "School office query",
            "Attendance query",
            "Access question"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "subject",
          "label": "Subject",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Details",
      "help": "Avoid private evidence in a general request.",
      "fields": [
        {
          "name": "message",
          "label": "Request details",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "safe",
          "label": "I have kept sensitive evidence out of this general request.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A reference and Pending review state make the next step clear.",
  "invariant": "Submission is not approval, a correction or a service booking. Category routing and visibility are school configured.",
  "recovery": "Save failure keeps input; duplicate intent returns the existing reference; unknown outcome checks the same request.",
  "data": "FamilyRequest with actor/child/category/version/status and private owner routing; minimal audit metadata.",
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
