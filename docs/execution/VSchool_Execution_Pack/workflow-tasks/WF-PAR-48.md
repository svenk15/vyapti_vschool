# WF-PAR-48 — Request a student-support discussion

Source workflow: PAR-48. Workspace: VSchool_Parent_Guardian_Design. Source area: wellbeing. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-48",
  "area": "wellbeing",
  "title": "Request a student-support discussion",
  "phase": 6,
  "purpose": "support.request for permitted child",
  "steps": [
    {
      "title": "Request a conversation",
      "help": "Keep initial details minimal.",
      "fields": [
        {
          "name": "topic",
          "label": "Topic",
          "type": "select",
          "options": [
            "Learning support discussion",
            "Wellbeing conversation",
            "Contact the school team"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Preferred contact",
      "help": "A request is not an emergency service.",
      "fields": [
        {
          "name": "channel",
          "label": "Contact preference",
          "type": "select",
          "options": [
            "Verified email",
            "School-approved call"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "urgent",
          "label": "I will use official urgent assistance channels if needed.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A restricted contact request is tracked without exposing internal case details.",
  "invariant": "No automated diagnosis, safety score or medical recommendation. School specialist scope controls assessment and case access.",
  "recovery": "Missed contact, unavailable service and revoked grant have a private follow-up route.",
  "data": "StudentSupportRequest safe metadata → restricted specialist workflow; parent sees only approved status/response.",
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
