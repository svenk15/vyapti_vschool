# WF-LEA-38 — Follow the school’s urgent safety escalation procedure

Source workflow: LEA-38. Workspace: VSchool_Principal_Leadership_Workflows. Source area: support. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-38",
  "area": "support",
  "title": "Follow the school’s urgent safety escalation procedure",
  "phase": 6,
  "trigger": "An urgent safety concern is raised through an approved channel.",
  "actors": "Principal; authorized Specialist support owner owner",
  "preconditions": "Approved school procedure, authorized emergency roles and actual contact configuration.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Show the school’s urgent-contact instruction.",
      "result": "Ordinary software queue is not represented as continuously monitored."
    },
    {
      "actor": "Principal",
      "action": "Contact the designated responsible person through the approved process.",
      "result": "No autonomous notification to all staff or guardians."
    },
    {
      "actor": "Principal",
      "action": "Record minimum permitted handoff evidence after appropriate action.",
      "result": "Access remains need-to-know."
    },
    {
      "actor": "System / owner",
      "action": "Review restricted incident follow-up under owner policy.",
      "result": "Emergency access, if supported, is explicit, time-limited and independently reviewed."
    }
  ],
  "fields": [
    {
      "name": "Handoff reference",
      "rule": "Minimum safe information."
    },
    {
      "name": "Emergency access",
      "rule": "Not a default principal capability; reason/expiry/review required where designed."
    }
  ],
  "outcome": "Human-led authorized safety handoff.",
  "exceptions": [
    "No configured procedure: show school contact gap, do not invent emergency policy.",
    "Complaint implicates a leader: use designated independent channel."
  ],
  "authorization": "No default break-glass, diagnosis or confidential case visibility.",
  "reads": "Approved procedure/contact configuration and explicit emergency-role rules.",
  "writes": "Restricted handoff/event only under incident owner.",
  "acceptance": "The portal never claims it has provided emergency assistance merely because a form was saved.",
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
