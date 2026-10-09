# WF-LEA-25 — Decide an assigned staff request

Source workflow: LEA-25. Workspace: VSchool_Principal_Leadership_Workflows. Source area: staff. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-25",
  "area": "staff",
  "title": "Decide an assigned staff request",
  "phase": 6,
  "trigger": "A leave/resource/staff request reaches an authorized approver.",
  "actors": "Principal; authorized People + Timetable + Requests owner",
  "preconditions": "Request type is released; principal explicitly assigned and permitted.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open assigned request.",
      "result": "Minimal purpose-specific detail and policy are shown."
    },
    {
      "actor": "Principal",
      "action": "Inspect operational impact and conflicts.",
      "result": "Sensitive attachments require separate access."
    },
    {
      "actor": "Principal",
      "action": "Choose an allowed decision or request information.",
      "result": "Review reason and consequence."
    },
    {
      "actor": "System / owner",
      "action": "Commit through the request owner.",
      "result": "Receipt shows decision; downstream roster/payroll actions keep their own state."
    }
  ],
  "fields": [
    {
      "name": "Request type",
      "rule": "Existing allowed owner category."
    },
    {
      "name": "Decision",
      "rule": "Per-type transition allowlist."
    },
    {
      "name": "Reason",
      "rule": "Required for refusal/return when policy says so."
    }
  ],
  "outcome": "Attributed staff-request decision.",
  "exceptions": [
    "Principal is requester or has a prohibited conflict: route to independent approver.",
    "Approval does not automatically update payroll or timetable."
  ],
  "authorization": "No blanket HR, salary or medical authority.",
  "reads": "Assigned request; policy/version; permitted operational impact.",
  "writes": "People/service request decision only.",
  "acceptance": "Same inbox cannot approve a type the principal is not delegated for.",
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
