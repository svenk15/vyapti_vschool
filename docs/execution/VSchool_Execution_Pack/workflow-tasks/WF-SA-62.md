# WF-SA-62 — Review activity, privacy or support access

Source workflow: SA-62. Workspace: VSchool_School_Admin_Design. Source area: settings. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-62",
  "module": "settings",
  "title": "Review activity, privacy or support access",
  "phase": 1,
  "capability": "school.audit.read; privacy/support actions need separate authority",
  "steps": [
    {
      "title": "Find activity",
      "help": "Show only safe events in this branch.",
      "fields": [
        {
          "name": "category",
          "label": "Category",
          "type": "select",
          "options": [
            "School settings",
            "Staff access",
            "Student change",
            "Attendance correction"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "from",
          "label": "From date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "To date",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Inspect evidence",
      "help": "Use a request reference for support; do not expose credentials or raw imported data.",
      "fields": [
        {
          "name": "action",
          "label": "Action",
          "type": "select",
          "options": [
            "View safe event detail",
            "Copy support reference"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A safe branch-scoped event is available for review.",
  "rule": "The administrator cannot delete audit history, grant operator impersonation or run an unrestricted data export.",
  "edge": "Restricted events show permitted metadata only; unsupported privacy requests route to the designated authority.",
  "data": "Append-only audit read model scoped by branch and capability; safe diff and request IDs only."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
