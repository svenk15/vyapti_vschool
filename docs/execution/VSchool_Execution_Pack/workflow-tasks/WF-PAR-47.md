# WF-PAR-47 — Read an authorized school care note

Source workflow: PAR-47. Workspace: VSchool_Parent_Guardian_Design. Source area: wellbeing. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-47",
  "area": "wellbeing",
  "title": "Read an authorized school care note",
  "phase": 6,
  "purpose": "explicit care.read_child purpose and document audience",
  "steps": [
    {
      "title": "Shared note",
      "help": "Only information intentionally released to this signer/account appears.",
      "fields": [
        {
          "name": "reference",
          "label": "School-shared note reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Next step",
      "help": "Read the school’s instructions within the permitted scope.",
      "fields": [
        {
          "name": "action",
          "label": "Next action",
          "type": "select",
          "options": [
            "Acknowledge receipt",
            "Contact the designated school team"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent reads a specifically shared note and its requested response.",
  "invariant": "No automatic access to internal safeguarding cases, third-party reports, private staff notes or another guardian’s restricted data.",
  "recovery": "Withdrawn sharing, changed version or confidential follow-up uses a safe school handoff.",
  "data": "Care owner supplies versioned shared artifact and audience grant, not a broad Student 360 join.",
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
