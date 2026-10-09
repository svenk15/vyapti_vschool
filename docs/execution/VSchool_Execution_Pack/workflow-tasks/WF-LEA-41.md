# WF-LEA-41 — Prepare a leadership review brief

Source workflow: LEA-41. Workspace: VSchool_Principal_Leadership_Workflows. Source area: reports. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-41",
  "area": "reports",
  "title": "Prepare a leadership review brief",
  "phase": 2,
  "trigger": "Leader needs an evidence-backed meeting or management summary.",
  "actors": "Principal; authorized Reporting + source owners owner",
  "preconditions": "Approved audience and access-filtered report sources.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose period, purpose and audience.",
      "result": "Only permitted source sections included."
    },
    {
      "actor": "Principal",
      "action": "Review key changes and unresolved actions.",
      "result": "Every claim links to a source/cutoff; distinguish fact from interpretation."
    },
    {
      "actor": "Principal",
      "action": "Edit and approve the narrative.",
      "result": "Exclude confidential cases and unsupported causal claims."
    },
    {
      "actor": "System / owner",
      "action": "Export or share only through authorized action.",
      "result": "Audience preview and delivery/receipt remain explicit."
    }
  ],
  "fields": [
    {
      "name": "Audience",
      "rule": "Approved role/person set."
    },
    {
      "name": "Narrative",
      "rule": "Human reviewed; no student/teacher labels unsupported by evidence."
    },
    {
      "name": "Source versions",
      "rule": "Retained in report metadata."
    }
  ],
  "outcome": "Reviewable brief with evidence and next actions.",
  "exceptions": [
    "Missing baseline: no invented trend.",
    "A restricted source cannot be exposed through an apparently harmless summary."
  ],
  "authorization": "Brief generation and external sharing are separate grants.",
  "reads": "Source metric snapshots; action status; publication-safe narrative.",
  "writes": "Report draft/version; approved sharing command only on explicit confirmation.",
  "acceptance": "Reviewer can trace each number to the same permitted snapshot.",
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
