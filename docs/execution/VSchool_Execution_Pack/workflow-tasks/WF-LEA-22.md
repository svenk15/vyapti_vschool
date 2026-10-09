# WF-LEA-22 — Authorize or hand off report publication

Source workflow: LEA-22. Workspace: VSchool_Principal_Leadership_Workflows. Source area: academics. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-22",
  "area": "academics",
  "title": "Authorize or hand off report publication",
  "phase": 4,
  "trigger": "Reports are approved and ready for release.",
  "actors": "Principal; authorized Academics + Learning + Assessments owner",
  "preconditions": "Explicit publication delegation, audience and required separation of duties.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Inspect exact approved report version and audience.",
      "result": "Show release date, affected population and unresolved blockers."
    },
    {
      "actor": "Principal",
      "action": "Preview permitted publication effects.",
      "result": "No default all-branch or all-family audience."
    },
    {
      "actor": "Principal",
      "action": "Publish only if explicitly authorized; otherwise hand off.",
      "result": "Fresh prerequisites and conflict rules rechecked."
    },
    {
      "actor": "System / owner",
      "action": "Inspect owner publication receipt and delivery status.",
      "result": "Published is distinct from every recipient having received/read it."
    }
  ],
  "fields": [
    {
      "name": "Version",
      "rule": "Exact immutable approved publication."
    },
    {
      "name": "Audience",
      "rule": "Purpose-authorized student/guardian recipients."
    },
    {
      "name": "Release time",
      "rule": "Explicit timezone and owner scheduling policy."
    }
  ],
  "outcome": "Owner-confirmed publication or a pending handoff.",
  "exceptions": [
    "Duplicate publish returns same result.",
    "Post-publication correction uses new revision/withdrawal policy, not silent overwrite."
  ],
  "authorization": "Principal role alone cannot publish or access all guardian recipients.",
  "reads": "Report readiness; approved version; authorized publication audience.",
  "writes": "Assessment publication command and approved communication handoff.",
  "acceptance": "Stale or unapproved report cannot be published.",
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
