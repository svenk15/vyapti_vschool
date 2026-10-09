# WF-LEA-31 — Recover an uncertain or outdated decision

Source workflow: LEA-31. Workspace: VSchool_Principal_Leadership_Workflows. Source area: decisions. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-31",
  "area": "decisions",
  "title": "Recover an uncertain or outdated decision",
  "phase": 2,
  "trigger": "A decision response is lost or evidence changes mid-review.",
  "actors": "Principal; authorized Each owning module owner",
  "preconditions": "Stable intent, expected version and authorized status use case exist.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Keep intent and show Confirmation pending.",
      "result": "Do not offer another different decision while unresolved."
    },
    {
      "actor": "Principal",
      "action": "Check status under current authorization.",
      "result": "Accepted receipt, still pending or verified not-found returned."
    },
    {
      "actor": "Principal",
      "action": "If evidence changed, reopen review.",
      "result": "Display new permitted state and require fresh confirmation."
    },
    {
      "actor": "System / owner",
      "action": "Resolve the original operation.",
      "result": "No duplicate downstream effect and no false failure label."
    }
  ],
  "fields": [
    {
      "name": "Reference",
      "rule": "Original opaque intent key."
    },
    {
      "name": "New decision",
      "rule": "Only after original status is known and current policy permits."
    }
  ],
  "outcome": "Known, attributable outcome.",
  "exceptions": [
    "Stale replica absence is not proof of failure.",
    "Permission revoked: safe support reference only, no protected receipt body."
  ],
  "authorization": "Retry/replay/status endpoints apply the same current owner guard.",
  "reads": "Command receipt plus current owner version.",
  "writes": "Exact replay only; no new effect on duplicate.",
  "acceptance": "Lost response followed by status check returns one original decision.",
  "priority": "Second release",
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
