# WF-SA-06 — Edit branch information

Source workflow: SA-06. Workspace: VSchool_School_Admin_Design. Source area: settings. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-06",
  "module": "settings",
  "title": "Edit branch information",
  "phase": 1,
  "capability": "school.manage",
  "steps": [
    {
      "title": "School information",
      "help": "Maintain operational contact details for this branch.",
      "fields": [
        {
          "name": "name",
          "label": "Branch display name",
          "type": "text",
          "options": [],
          "required": true,
          "value": "Greenwood · Whitefield"
        },
        {
          "name": "email",
          "label": "School office email",
          "type": "email",
          "options": [],
          "required": true,
          "value": "office@greenwood.example"
        },
        {
          "name": "phone",
          "label": "School office phone",
          "type": "tel",
          "options": [],
          "required": false,
          "value": ""
        },
        {
          "name": "address",
          "label": "Address",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": "Whitefield, Bengaluru"
        }
      ]
    },
    {
      "title": "Review changes",
      "help": "The institution identity, branch code and existing time zone are controlled separately.",
      "fields": [
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
  "outcome": "Permitted details are saved with a revision and activity entry.",
  "rule": "Time zone Asia/Kolkata is read-only after branch creation. Reject a forged change server-side.",
  "edge": "A stale edit shows the latest saved values and a comparison; never overwrite automatically.",
  "data": "Access owns School changes; Branding/contact read models read the saved revision. Compare expected version under the guard."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
