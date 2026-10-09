# WF-LEA-04 — Handle access changes during a leadership action

Source workflow: LEA-04. Workspace: VSchool_Principal_Leadership_Workflows. Source area: access. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-04",
  "area": "access",
  "title": "Handle access changes during a leadership action",
  "phase": 1,
  "trigger": "Role, branch permission or module availability changes while a page is open.",
  "actors": "Leader; Access and source owner",
  "preconditions": "All protected operations and receipt lookups use current server authorization.",
  "steps": [
    {
      "actor": "Leader",
      "action": "Open an item from the current screen.",
      "result": "The owner checks live scope before returning its contents."
    },
    {
      "actor": "System",
      "action": "Detect revoked/expired access.",
      "result": "Sensitive content is removed; generic unavailable state is shown."
    },
    {
      "actor": "Leader",
      "action": "Use school support or another permitted context.",
      "result": "No client-side override is offered."
    },
    {
      "actor": "System",
      "action": "Reauthorize any saved status reference later.",
      "result": "Receipt identity is not itself access permission."
    }
  ],
  "fields": [
    {
      "name": "Recovery destination",
      "rule": "Only a currently permitted context or school contact."
    }
  ],
  "outcome": "No unauthorized read or write following permission loss.",
  "exceptions": [
    "Outcome of a previous command is unknown: keep a non-sensitive reference, not the hidden item details.",
    "Disabled module does not erase owner records or obligations."
  ],
  "authorization": "Apply to reads, downloads, exports, retries and exact replay, not only navigation.",
  "reads": "Current grants/module policy; owner command status under access policy.",
  "writes": "Only safe audit of denial; no protected record mutation.",
  "acceptance": "A command checked after revocation is denied; denied page does not disclose private details.",
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
