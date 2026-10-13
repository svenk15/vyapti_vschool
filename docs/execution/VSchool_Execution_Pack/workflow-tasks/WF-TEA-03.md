# WF-TEA-03 — Switch branch or leave the workspace

Source workflow: TEA-03. Workspace: VSchool_Teacher_Design. Source area: access. Catalog phase: 1.

Status: IMPLEMENTED_AND_VERIFIED. The live Access owner contract is reconciled in `docs/modules/access/DESIGN.md`; current-source evidence is in `docs/evidence/teacher-account-context-2026-10-13/README.md`. Human review remains PENDING.

## Original contract (unaltered)
```json
{
  "id": "TEA-03",
  "area": "access",
  "title": "Switch branch or leave the workspace",
  "phase": 1,
  "capability": "active target-branch grant / own session",
  "entry": "account",
  "steps": [
    {
      "title": "Destination",
      "help": "Only authorized branches appear.",
      "fields": [
        {
          "name": "destination",
          "label": "Destination",
          "type": "select",
          "options": [
            "Whitefield",
            "Indiranagar",
            "Sign out"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Unsaved work",
      "help": "An unsubmitted attendance draft is held in memory only in Phase 1.",
      "fields": [
        {
          "name": "leave",
          "label": "I have reviewed unsaved work before leaving.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Context switches after authorization, or the current session ends.",
  "rule": "Warn before discarding input; clear old-branch protected state/caches. A saved or submitted record belongs to its original branch.",
  "recovery": "Permission lost during switch shows a safe destination. Unknown submission must be resolved before the draft is discarded.",
  "data": "Access resolves target scope or revokes session. Business commands and request receipts remain owner-scoped.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
