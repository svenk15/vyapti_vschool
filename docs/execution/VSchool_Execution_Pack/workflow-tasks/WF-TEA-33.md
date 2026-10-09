# WF-TEA-33 — Enter and validate marks

Source workflow: TEA-33. Workspace: VSchool_Teacher_Design. Source area: assessments. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-33",
  "area": "assessments",
  "title": "Enter and validate marks",
  "phase": 4,
  "capability": "assessment.mark.write for exact assigned assessment",
  "entry": "assessments/gradebook/as1",
  "steps": [
    {
      "title": "Student outcome",
      "help": "Not entered, scored, absent and exempt are distinct.",
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
          "name": "outcome",
          "label": "Outcome",
          "type": "select",
          "options": [
            "Scored",
            "Absent",
            "Exempt",
            "Not entered"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "score",
          "label": "Score if scored",
          "type": "number",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    },
    {
      "title": "Review before saving",
      "help": "Validate bounds and completeness using the pinned scheme.",
      "fields": [
        {
          "name": "review",
          "label": "I have reviewed the marks and explicit non-score states.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A draft mark revision is saved without publishing results to families.",
  "rule": "Exact validated score scale; zero is a legitimate score, not a stand-in for missing. Exemption authority may be separately required.",
  "recovery": "Two-editor conflict, changed scheme, missing evidence and withdrawn enrollment do not silently overwrite.",
  "data": "Assessment MarkRevision with state, exact score and expected version; draft save receipt/audit, no ResultPublication change.",
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
