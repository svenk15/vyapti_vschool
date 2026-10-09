# WF-LEA-03 — Work under a temporary leadership delegation

Source workflow: LEA-03. Workspace: VSchool_Principal_Leadership_Workflows. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-03",
  "area": "access",
  "title": "Work under a temporary leadership delegation",
  "phase": 2,
  "trigger": "Approved acting principal or deputy covers a defined period.",
  "actors": "Delegator; acting leader; Access owner",
  "preconditions": "School-approved delegation policy, eligible delegate and bounded grant management authority.",
  "steps": [
    {
      "actor": "Delegator",
      "action": "Choose eligible colleague, branch, allowed actions and effective window.",
      "result": "Preview excludes authorities the delegator cannot delegate."
    },
    {
      "actor": "Authorized approver",
      "action": "Confirm purpose and expiry.",
      "result": "Access owner records a dated delegation."
    },
    {
      "actor": "Acting leader",
      "action": "Enter delegated workspace.",
      "result": "Visible Acting role, scope and expiry; no misleading permanent title."
    },
    {
      "actor": "System",
      "action": "Recheck expiry on every protected action.",
      "result": "Expired or revoked authority stops new decisions."
    }
  ],
  "fields": [
    {
      "name": "Delegate",
      "rule": "Active eligible school staff identity."
    },
    {
      "name": "Scope",
      "rule": "Specific actions/branch; no wildcard."
    },
    {
      "name": "Window",
      "rule": "Starts before ends; maximum determined by approved policy."
    },
    {
      "name": "Reason",
      "rule": "Bounded non-sensitive note."
    }
  ],
  "outcome": "Time-limited delegated authority with clear accountability.",
  "exceptions": [
    "Self-delegation or privilege expansion: deny.",
    "Pending work outlives delegation: route to currently authorized owner."
  ],
  "authorization": "Grant issuance and delegated operation are different capabilities; originator identity remains visible.",
  "reads": "Access grant/delegation rules; active staff assignment.",
  "writes": "Delegation through Access owner, safe audit, approved recipient notification if enabled.",
  "acceptance": "Delegate cannot approve outside scope or after expiry; existing receipts remain attributable.",
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
