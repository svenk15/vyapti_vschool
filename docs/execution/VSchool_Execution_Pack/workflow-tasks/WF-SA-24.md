# WF-SA-24 — Confirm, resume and reconcile an import

Source workflow: SA-24. Workspace: VSchool_School_Admin_Design. Source area: imports. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-24",
  "module": "imports",
  "title": "Confirm, resume and reconcile an import",
  "phase": 1,
  "capability": "import.upload",
  "steps": [
    {
      "title": "Confirm preview",
      "help": "Confirmation pins source hash, context, preview revision and referenced versions.",
      "fields": [
        {
          "name": "job",
          "label": "Import",
          "type": "select",
          "options": [
            "IMP-1042 · 5 rows"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Review partial results",
      "help": "Successful rows stay committed; failed rows keep their row number and reason.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "Confirm valid preview",
            "Resume unprocessed rows",
            "Download redacted error report"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Each row reports created, unchanged, failed or remaining with durable receipts.",
  "rule": "Create-only plus exact no-change re-import in Phase 1; corrections and transfers use explicit workflows.",
  "edge": "Stale previews require re-preview; lost responses query receipts before retry; avoid replaying successes.",
  "data": "Per-row transaction: Person, Student, Enrollment/Placement, external mapping, row receipt, audit and outbox. Bounded batch processing, no assumed worker."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
