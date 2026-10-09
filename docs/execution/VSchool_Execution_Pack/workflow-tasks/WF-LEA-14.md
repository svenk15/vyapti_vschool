# WF-LEA-14 — Review an attendance correction request

Source workflow: LEA-14. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-14",
  "area": "attendance",
  "title": "Review an attendance correction request",
  "phase": 2,
  "trigger": "Teacher, student or parent flags a potential record error.",
  "actors": "Delegated attendance reviewer; principal as coordinator",
  "preconditions": "Correction capability separately granted to actual decision maker; source version available.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Inspect minimal request and route to authorized reviewer.",
      "result": "No edit action appears without correction grant."
    },
    {
      "actor": "Reviewer",
      "action": "Compare original mark and allowed evidence.",
      "result": "Source revision, reason and current conflict checks are visible."
    },
    {
      "actor": "Reviewer",
      "action": "Review and confirm correction through Attendance owner.",
      "result": "Expected-version command appends correction evidence."
    },
    {
      "actor": "System",
      "action": "Update permitted report/read projections.",
      "result": "History retains original and corrected outcome; notifications follow owner policy."
    }
  ],
  "fields": [
    {
      "name": "Record",
      "rule": "Exact student/session reference."
    },
    {
      "name": "New outcome",
      "rule": "Attendance policy allowlist; no bulk default."
    },
    {
      "name": "Reason",
      "rule": "Required bounded reason, evidence reference if policy requires."
    }
  ],
  "outcome": "Authorized corrected revision or reasoned rejection.",
  "exceptions": [
    "Submitted record changed during review: re-read before correction.",
    "Insufficient evidence: request clarification or reject, preserving history."
  ],
  "authorization": "Coordination does not confer correction permission; no principal mark-all shortcut.",
  "reads": "Current attendance revision; request; authorized evidence.",
  "writes": "Owner correction command plus audit/receipt, if explicitly permitted.",
  "acceptance": "Concurrent correction does not overwrite a newer revision.",
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
