# WF-LEA-34 — Follow up delivery or acknowledgement gaps

Source workflow: LEA-34. Workspace: VSchool_Principal_Leadership_Workflows. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-34",
  "area": "communication",
  "title": "Follow up delivery or acknowledgement gaps",
  "phase": 2,
  "trigger": "Important published notice has incomplete delivery or requested acknowledgement.",
  "actors": "Principal; authorized Communication + Requests owner",
  "preconditions": "Purpose-scoped delivery/acknowledgement projection; manual resend policy.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open notice coverage.",
      "result": "Separate eligible audience, accepted sends, failed deliveries and explicit acknowledgements."
    },
    {
      "actor": "Principal",
      "action": "Inspect permitted failed/unacknowledged group.",
      "result": "Unread, unacknowledged and failed delivery are not synonyms."
    },
    {
      "actor": "Principal",
      "action": "Preview a targeted reminder/resend.",
      "result": "Current recipient grants and deduplication rechecked."
    },
    {
      "actor": "System / owner",
      "action": "Record per-recipient outcomes.",
      "result": "No repeated send to already excluded or successfully handled recipients."
    }
  ],
  "fields": [
    {
      "name": "Notice/version",
      "rule": "Exact publication."
    },
    {
      "name": "Reminder audience",
      "rule": "Explicit purpose-filtered subset."
    },
    {
      "name": "Message",
      "rule": "Bounded context; no private case details."
    }
  ],
  "outcome": "Honest delivery/acknowledgement follow-up.",
  "exceptions": [
    "No acknowledgement requirement: do not manufacture an engagement deficit.",
    "Revoked guardian purpose: stop future contact under that purpose."
  ],
  "authorization": "No visibility into another guardian’s private relationship restrictions.",
  "reads": "Published recipient snapshot plus current grants; delivery attempts; explicit acknowledgements.",
  "writes": "Approved manual reminder/send intent and safe outcomes.",
  "acceptance": "Delivery accepted does not increment acknowledgement count.",
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
