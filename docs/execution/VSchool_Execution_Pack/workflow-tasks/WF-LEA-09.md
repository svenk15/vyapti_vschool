# WF-LEA-09 — Create an accountable missing-register follow-up

Source workflow: LEA-09. Workspace: VSchool_Principal_Leadership_Workflows. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-09",
  "area": "attendance",
  "title": "Create an accountable missing-register follow-up",
  "phase": 2,
  "trigger": "A due session is still awaiting submission.",
  "actors": "Principal; operational coordinator; responsible teacher",
  "preconditions": "Fresh missing-session evidence, internal follow-up capability and eligible assignee.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Open missing session and choose Follow up.",
      "result": "Preview teacher, class, due state and any existing active follow-up."
    },
    {
      "actor": "Principal",
      "action": "Choose coordinator, due time and brief note.",
      "result": "Assignee must be eligible; this does not reassign teaching authority."
    },
    {
      "actor": "Principal",
      "action": "Review and confirm.",
      "result": "System rechecks source; inserts one follow-up or returns an existing one."
    },
    {
      "actor": "System",
      "action": "Return reference and assignment/delivery state separately.",
      "result": "Assigned does not mean the recipient read a message."
    },
    {
      "actor": "Coordinator",
      "action": "Follow the school’s operational process.",
      "result": "Only an eligible teacher submits attendance through the Attendance owner."
    }
  ],
  "fields": [
    {
      "name": "Assignee",
      "rule": "Eligible staff in same permitted school; no general account lookup."
    },
    {
      "name": "Due time",
      "rule": "Explicit time, timezone and school working policy."
    },
    {
      "name": "Note",
      "rule": "Max proposed 500 characters; no pupil/health detail."
    },
    {
      "name": "Source",
      "rule": "Exact session ID/revision; server verified."
    }
  ],
  "outcome": "One scoped, assigned follow-up with due time and evidence rule.",
  "exceptions": [
    "Teacher submitted before confirmation: do not create obsolete work; show current receipt.",
    "Existing open follow-up: open it or explicitly request authorized reassignment.",
    "Network uncertainty: check same intent before retry."
  ],
  "authorization": "Assigning a follow-up grants no attendance marking, correction or new student data access.",
  "reads": "Session status/version; active staff eligibility; existing open follow-up.",
  "writes": "Coordination follow-up, intent receipt and minimal audit; optional approved delivery event.",
  "acceptance": "Duplicate click makes one follow-up; session submission remains untouched.",
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
