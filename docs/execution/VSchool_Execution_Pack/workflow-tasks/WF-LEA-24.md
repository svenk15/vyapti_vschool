# WF-LEA-24 — Approve temporary cover when delegated

Source workflow: LEA-24. Workspace: VSchool_Principal_Leadership_Workflows. Source area: staff. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-24",
  "area": "staff",
  "title": "Approve temporary cover when delegated",
  "phase": 3,
  "trigger": "Timetable coordinator proposes substitute coverage.",
  "actors": "Principal; authorized People + Timetable + Requests owner",
  "preconditions": "Delegated cover approval; verified teacher eligibility and time overlap checks.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Review proposed teacher, occurrence and effective period.",
      "result": "See alternatives and impact allowed by owner."
    },
    {
      "actor": "Principal",
      "action": "Check current eligibility and conflicts.",
      "result": "No assumption that any staff account can teach."
    },
    {
      "actor": "Principal",
      "action": "Approve, return or reject with reason.",
      "result": "Current source versions and separation rules checked."
    },
    {
      "actor": "System / owner",
      "action": "Confirm published dated assignment.",
      "result": "Teacher access derives from that assignment, not principal notification."
    }
  ],
  "fields": [
    {
      "name": "Occurrence/version",
      "rule": "Exact class/time."
    },
    {
      "name": "Substitute",
      "rule": "Eligible active teacher."
    },
    {
      "name": "Decision/reason",
      "rule": "Owner policy."
    }
  ],
  "outcome": "Valid time-bounded cover assignment or explicit rejection.",
  "exceptions": [
    "Teacher becomes ineligible before commit: deny.",
    "Teacher/date overlap: reject rather than double-book."
  ],
  "authorization": "Approver cannot create teacher identity or bypass eligibility.",
  "reads": "Occurrence; verified teacher identity/eligibility; dated assignment overlap.",
  "writes": "Timetable owner command and audit.",
  "acceptance": "Expired cover grants no continued marking authority.",
  "priority": "Later",
  "extension": false,
  "timetable_contract": {
    "release": "TT-01",
    "owner": "academics / timetable",
    "entry": "timetable",
    "specification": "docs/timetable/README.md",
    "phase": 3,
    "implementation": "NOT_ASSESSED"
  }
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
