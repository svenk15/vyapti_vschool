# WF-LEA-30 — Recuse and route a conflict of interest

Source workflow: LEA-30. Workspace: VSchool_Principal_Leadership_Workflows. Source area: decisions. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-30",
  "area": "decisions",
  "title": "Recuse and route a conflict of interest",
  "phase": 2,
  "trigger": "Principal is the requester, subject or otherwise prohibited decision maker.",
  "actors": "Principal; authorized Each owning module owner",
  "preconditions": "Source-owner separation-of-duty policy and independent eligible escalation role.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Detect or declare a conflict.",
      "result": "Decision controls are unavailable where policy prohibits self-approval."
    },
    {
      "actor": "Principal",
      "action": "Choose permitted independent route.",
      "result": "Recipient is eligible and not selected from a public directory."
    },
    {
      "actor": "Principal",
      "action": "Record minimal recusal reason.",
      "result": "Confidential allegation details stay restricted."
    },
    {
      "actor": "System / owner",
      "action": "Track reassignment status.",
      "result": "Original principal does not gain continuing case access from routing it."
    }
  ],
  "fields": [
    {
      "name": "Conflict category",
      "rule": "Owner allowlist plus bounded optional note."
    },
    {
      "name": "Recipient",
      "rule": "Policy-defined independent role/person."
    }
  ],
  "outcome": "Independent authorized decision ownership.",
  "exceptions": [
    "No eligible approver: retain pending state and route to designated steward.",
    "Complaint is about principal: confidential route avoids sending narrative back to subject."
  ],
  "authorization": "No self-delegation trick or role switch to bypass separation of duties.",
  "reads": "Assignment and conflict rules; eligible independent roles.",
  "writes": "Source-owner recusal/reassignment event.",
  "acceptance": "Requester cannot approve own prohibited item through alternate workspace.",
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
