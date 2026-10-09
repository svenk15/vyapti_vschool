# WF-PAR-05 — Ask about a missing child link

Source workflow: PAR-05. Workspace: VSchool_Parent_Guardian_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-05",
  "area": "access",
  "title": "Ask about a missing child link",
  "phase": 2,
  "purpose": "authenticated support request; no child-record access",
  "steps": [
    {
      "title": "Contact the school",
      "help": "Submit a claim for verification, not a search across school records.",
      "fields": [
        {
          "name": "school",
          "label": "School name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "reference",
          "label": "School-issued reference",
          "type": "text",
          "options": [],
          "required": false,
          "value": ""
        },
        {
          "name": "issue",
          "label": "Issue",
          "type": "select",
          "options": [
            "My child is missing",
            "My access looks incorrect",
            "Invitation has not arrived"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review request",
      "help": "Use the school’s approved identity-verification process.",
      "fields": [
        {
          "name": "message",
          "label": "Brief description",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "safe",
          "label": "I have not included passwords, identity documents or private custody details.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A support request is pending verification; no child access is added automatically.",
  "invariant": "Do not confirm whether a named child exists. Only a designated school verifier can establish the relationship and purpose grants.",
  "recovery": "Duplicate request shows prior reference. Missing proof uses a private school channel; an ordinary request is not evidence.",
  "data": "Support claim is owned by Family requests; verified relationship remains a separate Guardians command.",
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
