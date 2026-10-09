# WF-LEA-35 — Handle an escalated family concern or complaint

Source workflow: LEA-35. Workspace: VSchool_Principal_Leadership_Workflows. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-35",
  "area": "communication",
  "title": "Handle an escalated family concern or complaint",
  "phase": 2,
  "trigger": "A school request reaches the principal under escalation policy.",
  "actors": "Principal; authorized Communication + Requests owner",
  "preconditions": "Explicit case purpose and independent route for conflicts.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open only assigned, permitted case evidence.",
      "result": "See concern, timeline, desired outcome and authorized participants."
    },
    {
      "actor": "Principal",
      "action": "Acknowledge receipt through approved channel.",
      "result": "Do not promise a decision or confidentiality the school cannot guarantee."
    },
    {
      "actor": "Principal",
      "action": "Assign investigation/review to eligible owner.",
      "result": "Need-to-know access, action dates and participant boundaries set."
    },
    {
      "actor": "System / owner",
      "action": "Review owner finding and communicate permitted outcome.",
      "result": "Appeal/reopen route follows school policy; restricted notes stay private."
    }
  ],
  "fields": [
    {
      "name": "Category/urgency",
      "rule": "Factual school-defined classification."
    },
    {
      "name": "Owner/review date",
      "rule": "Eligible person and explicit checkpoint."
    },
    {
      "name": "Outcome message",
      "rule": "Student/family-safe version, separate from internal notes."
    }
  ],
  "outcome": "Owned, trackable resolution process.",
  "exceptions": [
    "Complaint concerns principal: route independently without revealing narrative to implicated user.",
    "Another guardian lacks purpose: not added automatically.",
    "Urgent safety issue: invoke designated school protocol, not ordinary queue promises."
  ],
  "authorization": "Leadership hierarchy does not grant all case content.",
  "reads": "Assigned request/case; permitted timeline and relationship-purpose participant grants.",
  "writes": "Case-owner coordination and public outcome events; controlled communication.",
  "acceptance": "General home, search, export and audit omit restricted complaint narrative.",
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
