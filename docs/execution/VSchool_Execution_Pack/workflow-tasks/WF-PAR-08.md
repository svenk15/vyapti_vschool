# WF-PAR-08 — Switch child and school context

Source workflow: PAR-08. Workspace: VSchool_Parent_Guardian_Design. Source area: home. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-08",
  "area": "home",
  "title": "Switch child and school context",
  "phase": 2,
  "purpose": "active destination relationship and specific purposes",
  "steps": [
    {
      "title": "Select a child",
      "help": "The child card includes school, branch and class to avoid mistakes.",
      "fields": [
        {
          "name": "destination",
          "label": "Destination",
          "type": "select",
          "options": [
            "Aarav · Greenwood · Whitefield",
            "Nila · Greenwood · Indiranagar",
            "Mira · Westbridge · North campus"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review unsaved work",
      "help": "Records remain attached to their original child.",
      "fields": [
        {
          "name": "leave",
          "label": "I have reviewed any unsent work before switching.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The entire workspace switches to the selected child and re-evaluates modules and permissions.",
  "invariant": "No independent branch switch that leaves the previous child selected. Cancel or confirm dirty input; clear prior child view state. Persisted pending payments stay tied to their original invoice.",
  "recovery": "If a destination grant changes, leave the parent in a safe permitted context. Never carry messages, attachments or request drafts across children.",
  "data": "Relationship/child/context DTO drives owner calls. Draft and pending-intent keys include actor, institution, child and purpose.",
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
