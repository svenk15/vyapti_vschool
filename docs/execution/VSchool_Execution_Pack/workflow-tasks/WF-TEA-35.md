# WF-TEA-35 — Review result publication and correct an error

Source workflow: TEA-35. Workspace: VSchool_Teacher_Design. Source area: assessments. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-35",
  "area": "assessments",
  "title": "Review result publication and correct an error",
  "phase": 4,
  "capability": "own-subject result preview; correction request, not default publish",
  "entry": "flow/TEA-35",
  "steps": [
    {
      "title": "Published version",
      "help": "Read the approved result and its provenance.",
      "fields": [
        {
          "name": "publication",
          "label": "Publication",
          "type": "select",
          "options": [
            "Grade 6 · Term 1 · Approved version"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Error handoff",
      "help": "A published result is corrected through reviewed republication.",
      "fields": [
        {
          "name": "student",
          "label": "Student in assigned class",
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
          "name": "reference",
          "label": "Result reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "reason",
          "label": "Correction request reason",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An authorized publisher reviews any correction; the teacher sees the linked disposition.",
  "rule": "No editing a published PDF or overwriting published mark history. Guardian access remains separately permitted.",
  "recovery": "Withdrawn approval or changed underlying marks blocks publication until reconciled.",
  "data": "ResultPublicationManifest references approved revisions; proposed correction request routes to assessment owner, preserving original publication.",
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
