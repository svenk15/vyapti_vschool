# WF-LEA-01 — Enter the correct leadership workspace

Source workflow: LEA-01. Workspace: VSchool_Principal_Leadership_Workflows. Source area: access. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-01",
  "area": "access",
  "title": "Enter the correct leadership workspace",
  "phase": 1,
  "trigger": "Principal signs in or holds more than one role.",
  "actors": "Principal; Access service",
  "preconditions": "Active account, leadership assignment and at least one explicit branch grant; required foundations released.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Use school-branded sign-in.",
      "result": "Existing trust and authentication policy applies."
    },
    {
      "actor": "System",
      "action": "Resolve permitted roles and branches from the current account.",
      "result": "Leadership appears only with a grant; no student/finance access inferred."
    },
    {
      "actor": "Principal",
      "action": "Choose Leadership and a permitted branch.",
      "result": "Header shows institution, branch, role and school-local date."
    },
    {
      "actor": "System",
      "action": "Load only enabled and authorized navigation.",
      "result": "A complete attendance-only experience is possible."
    }
  ],
  "fields": [
    {
      "name": "Workspace",
      "rule": "Only server-returned roles."
    },
    {
      "name": "Branch",
      "rule": "Only currently granted branches; never inferred from institution ownership."
    }
  ],
  "outcome": "Correct branch-scoped leadership home.",
  "exceptions": [
    "No leadership grant: show permitted workspace choices, not a broken dashboard.",
    "Session expiry: clear protected content and return through sign-in."
  ],
  "authorization": "Principal role is not a wildcard. Protected reads and mutations reauthorize independently.",
  "reads": "UserAccount; active role/grant; organization/school state; released/entitled/branch-enabled modules.",
  "writes": "Existing session/context selection only; no role creation.",
  "acceptance": "Unrelated branch, school-slug forgery and revoked role cannot open the workspace.",
  "priority": "First release",
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
