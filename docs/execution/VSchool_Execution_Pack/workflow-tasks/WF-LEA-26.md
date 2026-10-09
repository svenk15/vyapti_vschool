# WF-LEA-26 — Hand over open work when leadership changes

Source workflow: LEA-26. Workspace: VSchool_Principal_Leadership_Workflows. Source area: staff. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-26",
  "area": "staff",
  "title": "Hand over open work when leadership changes",
  "phase": 2,
  "trigger": "Principal/delegate leaves, delegation expires or responsibilities change.",
  "actors": "Principal; authorized People + Timetable + Requests owner",
  "preconditions": "Authorized handover coordinator; recipient grants verified independently.",
  "steps": [
    {
      "actor": "Principal",
      "action": "List transferable open work in permitted scope.",
      "result": "Separate operational actions from confidential cases and source-owner decisions."
    },
    {
      "actor": "Principal",
      "action": "Preview new eligible owners and retained evidence.",
      "result": "No access grant is bundled into reassignment."
    },
    {
      "actor": "Principal",
      "action": "Confirm reassignment by item.",
      "result": "Per-item version/eligibility and outcomes recorded."
    },
    {
      "actor": "System / owner",
      "action": "Retire old delegation through Access owner.",
      "result": "No orphaned live actions; inaccessible cases routed to specialist steward."
    }
  ],
  "fields": [
    {
      "name": "Items",
      "rule": "Explicit bounded selection."
    },
    {
      "name": "New owner",
      "rule": "Eligible for each purpose."
    },
    {
      "name": "Effective time/reason",
      "rule": "Recorded in handover evidence."
    }
  ],
  "outcome": "Traceable ownership transfer and access expiry.",
  "exceptions": [
    "New owner lacks authority: item fails/awaits qualified owner.",
    "Unknown transfer result: reconcile, do not duplicate."
  ],
  "authorization": "Reassignment cannot transfer private source access by implication.",
  "reads": "Current open work, delegation expiry, current eligible assignees.",
  "writes": "Versioned ownership events; separate Access delegation revoke.",
  "acceptance": "Old owner cannot act after revocation; new owner cannot read unrelated confidential material.",
  "priority": "Later",
  "extension": true
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
