# WF-LEA-11 — Verify, close or reopen a follow-up

Source workflow: LEA-11. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-11",
  "area": "attendance",
  "title": "Verify, close or reopen a follow-up",
  "phase": 2,
  "trigger": "Assignee reports completion or underlying session changes.",
  "actors": "Assignee; principal/verifier; Coordination and Attendance owners",
  "preconditions": "Current follow-up scope; explicit close/reopen capability; fresh evidence read.",
  "steps": [
    {
      "actor": "Assignee",
      "action": "Mark Evidence ready with a permitted source reference.",
      "result": "This is a completion claim, not closure."
    },
    {
      "actor": "Principal",
      "action": "Open Verify resolution.",
      "result": "Re-read the exact Attendance receipt and follow-up version."
    },
    {
      "actor": "Principal",
      "action": "Confirm closure only if evidence rule is satisfied.",
      "result": "System records verifier, source version and closed time."
    },
    {
      "actor": "Principal",
      "action": "Reopen with a reason if later authorized evidence invalidates closure.",
      "result": "History remains; active assignee/due time chosen again."
    }
  ],
  "fields": [
    {
      "name": "Evidence",
      "rule": "Exact source receipt/revision or approved evidence type."
    },
    {
      "name": "Closure note",
      "rule": "Optional bounded operational note."
    },
    {
      "name": "Reopen reason",
      "rule": "Required; does not edit prior closure event."
    }
  ],
  "outcome": "Verified closure or explicit continued work.",
  "exceptions": [
    "Source still missing: cannot verify closure merely from assignee text.",
    "Stale follow-up version: show new owner/status before deciding.",
    "Source inaccessible: block verification and route to authorized verifier."
  ],
  "authorization": "No closure from a broad role alone; no privilege escalation through evidence links.",
  "reads": "Follow-up lifecycle/version; fresh owner evidence and current access.",
  "writes": "Versioned closure/reopen event and audit; no Attendance mutation.",
  "acceptance": "Teacher submission changes source to received; follow-up closes only under documented verification rule.",
  "priority": "First release",
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
