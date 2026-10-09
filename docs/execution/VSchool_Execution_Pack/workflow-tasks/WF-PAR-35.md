# WF-PAR-35 — Request a school document

Source workflow: PAR-35. Workspace: VSchool_Parent_Guardian_Design. Source area: requests. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-35",
  "area": "requests",
  "title": "Request a school document",
  "phase": 3,
  "purpose": "document.request for allowed child purpose",
  "steps": [
    {
      "title": "Document type",
      "help": "Only school-offered documents appear.",
      "fields": [
        {
          "name": "kind",
          "label": "Document",
          "type": "select",
          "options": [
            "Enrollment confirmation",
            "Attendance statement",
            "School-issued certificate"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Purpose",
      "help": "The school verifies eligibility and any approval requirement.",
      "fields": [
        {
          "name": "purpose",
          "label": "Purpose of request",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The request progresses to approved/declined/issued, then an authorized download.",
  "invariant": "Request receipt is not an issued certificate. Templates, signatory authority, retention and any fee depend on the document owner.",
  "recovery": "Expired/revoked links require reauthorization. Keep approval and document-generation failures distinct.",
  "data": "DocumentRequest → approved versioned artifact; explicit child/purpose access at generation and download.",
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
