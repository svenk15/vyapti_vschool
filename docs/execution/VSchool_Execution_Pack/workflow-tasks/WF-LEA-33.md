# WF-LEA-33 — Approve or return a proposed communication

Source workflow: LEA-33. Workspace: VSchool_Principal_Leadership_Workflows. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-33",
  "area": "communication",
  "title": "Approve or return a proposed communication",
  "phase": 2,
  "trigger": "A staff-authored notice is awaiting delegated review.",
  "actors": "Principal; authorized Communication + Requests owner",
  "preconditions": "Assigned reviewer, permitted content/audience and publication policy.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open the exact draft revision.",
      "result": "Show intended audience, author, channels and schedule."
    },
    {
      "actor": "Principal",
      "action": "Review accuracy, clarity and required permissions.",
      "result": "Flag confidential content in broad communication."
    },
    {
      "actor": "Principal",
      "action": "Approve or return with actionable changes.",
      "result": "Versioned owner command; author may need to resubmit changed content."
    },
    {
      "actor": "System / owner",
      "action": "Inspect actual release state.",
      "result": "Approval is separate from scheduled publication and delivery."
    }
  ],
  "fields": [
    {
      "name": "Decision",
      "rule": "Approve/return/reject per policy."
    },
    {
      "name": "Reason",
      "rule": "Required for return; bounded and actionable."
    },
    {
      "name": "Revision",
      "rule": "Exact reviewed content/audience version."
    }
  ],
  "outcome": "Approved version or clear revision request.",
  "exceptions": [
    "Author edits during approval: conflict, re-review.",
    "Self-approval prohibited by school rule: independent reviewer."
  ],
  "authorization": "Only current delegated publishing/approval authority can act.",
  "reads": "Notice draft version, audience preview and approval rule.",
  "writes": "Communication approval state/receipt; publication follows owner contract.",
  "acceptance": "Approval of version 2 cannot publish unseen version 3.",
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
