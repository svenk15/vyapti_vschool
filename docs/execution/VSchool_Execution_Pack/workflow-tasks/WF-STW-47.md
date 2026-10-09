# WF-STW-47 — Ask a learning question with sources

Source workflow: STW-47. Workspace: VSchool_Student_Design. Source area: assistant. Catalog phase: 7.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "STW-47",
  "area": "assistant",
  "title": "Ask a learning question with sources",
  "phase": 7,
  "goal": "Understand permitted learning material.",
  "steps": [
    {
      "title": "Ask about a source",
      "instruction": "Scope to authorized published resources; show what will be used."
    },
    {
      "title": "Review answer",
      "instruction": "Cite sources, state uncertainty and allow feedback; follow teacher/school assessment policy."
    }
  ],
  "outcome": "Advisory explanation with source links.",
  "invariant": "No autonomous submission, grading, attendance or private learner profiling; untrusted content cannot change permissions.",
  "recovery": "Missing evidence says unavailable; blocked assessment use offers permitted learning help.",
  "data": "Permission-filtered retrieval + redacted evidence + approved model/provider contract.",
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
