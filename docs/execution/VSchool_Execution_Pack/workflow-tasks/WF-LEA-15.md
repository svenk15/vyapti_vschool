# WF-LEA-15 — Resolve an incorrect or duplicate scheduled session

Source workflow: LEA-15. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-15",
  "area": "attendance",
  "title": "Resolve an incorrect or duplicate scheduled session",
  "phase": 1,
  "trigger": "Coverage appears wrong because the underlying session setup is wrong.",
  "actors": "Principal; authorized Academic/Attendance administrator",
  "preconditions": "Source session read grant; administrative lifecycle command owned elsewhere.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open suspected session and related evidence.",
      "result": "See timing, offering and current roster/submission state."
    },
    {
      "actor": "Principal",
      "action": "Send setup review to the authorized administrator.",
      "result": "Do not delete the row from a leadership dashboard."
    },
    {
      "actor": "Administrator",
      "action": "Apply allowed correction/cancellation under owner rules.",
      "result": "Submitted sessions and referenced evidence receive extra protection."
    },
    {
      "actor": "System",
      "action": "Refresh coverage with explicit exclusion/revision.",
      "result": "Historical totals disclose the applicable as-of policy."
    }
  ],
  "fields": [
    {
      "name": "Concern",
      "rule": "Wrong time, offering, duplication or other bounded reason."
    },
    {
      "name": "Reference",
      "rule": "Exact sessions; never name-only matching."
    }
  ],
  "outcome": "Correct source setup or an explained rejection.",
  "exceptions": [
    "Already submitted: cannot casually cancel/delete to improve coverage.",
    "Related reports changed: surface revision rather than silently alter prior exported snapshot."
  ],
  "authorization": "Principal can inspect/route only within separate capabilities.",
  "reads": "Session/offering/schedule revisions and receipts.",
  "writes": "Request only from leadership; source change through owning administrator.",
  "acceptance": "Removing a dashboard exception cannot erase a submitted attendance record.",
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
