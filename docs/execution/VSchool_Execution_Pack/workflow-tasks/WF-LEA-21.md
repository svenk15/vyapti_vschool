# WF-LEA-21 — Perform an explicitly delegated moderation decision

Source workflow: LEA-21. Workspace: VSchool_Principal_Leadership_Workflows. Source area: academics. Catalog phase: 4.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-21",
  "area": "academics",
  "title": "Perform an explicitly delegated moderation decision",
  "phase": 4,
  "trigger": "Assessment owner assigns a moderation item to the principal.",
  "actors": "Principal; authorized Academics + Learning + Assessments owner",
  "preconditions": "Distinct moderation grant; conflict-of-interest rule and current evidence version.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open assigned moderation item.",
      "result": "View only permitted mark/rubric evidence and recorded checks."
    },
    {
      "actor": "Principal",
      "action": "Declare conflict or request missing information.",
      "result": "No self-approval of own prohibited work."
    },
    {
      "actor": "Principal",
      "action": "Review approve/reject/return consequences.",
      "result": "Reason and impact preview use the owner contract."
    },
    {
      "actor": "System / owner",
      "action": "Confirm through Assessment owner.",
      "result": "Versioned decision receipt; result publication remains separate."
    }
  ],
  "fields": [
    {
      "name": "Decision",
      "rule": "Only currently allowed transitions."
    },
    {
      "name": "Reason",
      "rule": "Required where policy mandates; returned items need actionable explanation."
    },
    {
      "name": "Evidence version",
      "rule": "Server rechecked."
    }
  ],
  "outcome": "One attributable moderation decision.",
  "exceptions": [
    "Changed marks or assignment after preview: conflict, re-review.",
    "Unknown response: status check before a new intent."
  ],
  "authorization": "Moderation and result publication are separate grants.",
  "reads": "Assigned assessment decision and permitted evidence.",
  "writes": "Assessment-owned moderation command, receipt and audit.",
  "acceptance": "Decision inbox cannot bypass the assessment owner’s guards.",
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
