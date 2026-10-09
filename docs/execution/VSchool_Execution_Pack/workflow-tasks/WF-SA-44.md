# WF-SA-44 — Collect and review a document

Source workflow: SA-44. Workspace: VSchool_School_Admin_Design. Source area: documents. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-44",
  "module": "documents",
  "title": "Collect and review a document",
  "phase": 3,
  "capability": "document.review + owning module capability",
  "steps": [
    {
      "title": "Request context",
      "help": "A document needs a purpose, owner and permitted audience.",
      "fields": [
        {
          "name": "student",
          "label": "Student",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "type",
          "label": "Document type",
          "type": "select",
          "options": [
            "Enrollment evidence",
            "Transfer document",
            "Consent form"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Upload and review",
      "help": "Uploads stay unavailable until their safety checks complete.",
      "fields": [
        {
          "name": "file",
          "label": "Document",
          "type": "file",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "decision",
          "label": "Review decision",
          "type": "select",
          "options": [
            "Pending checks",
            "Accept verified document",
            "Request replacement"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The document version and review state are visible to authorized users.",
  "rule": "No public object URLs; scan failure never becomes a successful upload; expiry and retention follow approved policy.",
  "edge": "Interrupted upload resumes or retries safely; expired access links reauthorize.",
  "data": "Documents owns FileAsset, ScanResult, DocumentVersion and grant. Owning module references the immutable approved version."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
