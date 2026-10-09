# WF-TEA-23 — Accept and perform a cover assignment

Source workflow: TEA-23. Workspace: VSchool_Teacher_Design. Source area: planning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-23",
  "area": "planning",
  "title": "Accept and perform a cover assignment",
  "phase": 3,
  "capability": "explicit cover/dated assignment grant",
  "entry": "flow/TEA-23",
  "steps": [
    {
      "title": "Cover request",
      "help": "Show class, period and responsibilities before acceptance.",
      "fields": [
        {
          "name": "cover",
          "label": "Cover",
          "type": "select",
          "options": [
            "Grade 6 B · Mathematics · 12 Oct, 11:15"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Confirm availability",
      "help": "Eligibility and clashes are rechecked before making access effective.",
      "fields": [
        {
          "name": "decision",
          "label": "Response",
          "type": "select",
          "options": [
            "Accept availability",
            "Decline with reason"
          ],
          "required": true,
          "value": ""
        },
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
  "outcome": "An authorized cover assignment grants only the exact required session scope.",
  "rule": "Accepting a message alone grants nothing. No shared credentials, administrator impersonation or permanent roster access.",
  "recovery": "Clash, stale request, revoked eligibility and already-opened session follow the approved substitution contract.",
  "data": "Academics owns Substitution/Assignment changes; attendance assignment resolver checks dated scope at every action.",
  "proposal": false,
  "timetable_contract": {
    "release": "TT-01",
    "owner": "academics / timetable",
    "entry": "planning",
    "specification": "docs/timetable/README.md",
    "phase": 3,
    "implementation": "NOT_ASSESSED"
  }
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
