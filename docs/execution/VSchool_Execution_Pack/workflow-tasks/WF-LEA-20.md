# WF-LEA-20 — Check assessment and report readiness

Source workflow: LEA-20. Workspace: VSchool_Principal_Leadership_Workflows. Source area: academics. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-20",
  "area": "academics",
  "title": "Check assessment and report readiness",
  "phase": 4,
  "trigger": "School approaches a report publication milestone.",
  "actors": "Principal; authorized Academics + Learning + Assessments owner",
  "preconditions": "Assessment readiness projection and explicit branch oversight grant.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose assessment cycle.",
      "result": "Show configured requirements and source cutoff."
    },
    {
      "actor": "Principal",
      "action": "Inspect missing marks, unresolved outcomes or pending moderation.",
      "result": "Different readiness blockers remain distinct."
    },
    {
      "actor": "Principal",
      "action": "Assign coordination to the responsible owner.",
      "result": "No fabricated marks or implicit publication rights."
    },
    {
      "actor": "System / owner",
      "action": "Recheck owner evidence.",
      "result": "Ready means prerequisites satisfied, not Published."
    }
  ],
  "fields": [
    {
      "name": "Cycle",
      "rule": "Exact scheme/version."
    },
    {
      "name": "Readiness rule",
      "rule": "Owner-defined; optional assessments labelled."
    },
    {
      "name": "Coordinator",
      "rule": "Eligible assessment lead."
    }
  ],
  "outcome": "An explainable readiness checklist and remaining blockers.",
  "exceptions": [
    "Absent, Exempt and Not entered cannot collapse into numeric zero.",
    "Revised scheme invalidates stale readiness snapshot."
  ],
  "authorization": "Leadership read does not imply mark entry, moderation approval or publication.",
  "reads": "Assessment scheme; outcome completeness; moderation state; publication prerequisites.",
  "writes": "Coordination actions only unless separately delegated.",
  "acceptance": "100% readiness cannot be displayed while a mandatory outcome is unresolved.",
  "priority": "Later",
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
