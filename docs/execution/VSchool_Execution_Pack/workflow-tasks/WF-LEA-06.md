# WF-LEA-06 — Recognize stale, incomplete or unavailable information

Source workflow: LEA-06. Workspace: VSchool_Principal_Leadership_Workflows. Source area: daily. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-06",
  "area": "daily",
  "title": "Recognize stale, incomplete or unavailable information",
  "phase": 1,
  "trigger": "An owner service cannot refresh or some records are not yet submitted.",
  "actors": "Principal; source projection",
  "preconditions": "Freshness and completeness are available as separate metadata.",
  "steps": [
    {
      "actor": "System",
      "action": "Label source cutoff and current refresh outcome.",
      "result": "Last known data is visibly stale; unavailable is not zero."
    },
    {
      "actor": "Principal",
      "action": "Inspect what is missing.",
      "result": "Show source/type/count only within authority."
    },
    {
      "actor": "Principal",
      "action": "Retry or open a safe source view.",
      "result": "Retry uses current scope; input/filter state is retained."
    },
    {
      "actor": "System",
      "action": "Reconcile after recovery.",
      "result": "New cutoff/version is visible; pending decisions need fresh evidence."
    }
  ],
  "fields": [
    {
      "name": "Cutoff",
      "rule": "Server-generated instant with school timezone."
    },
    {
      "name": "Completeness",
      "rule": "Due/received/unknown counts, never a vague confidence score."
    }
  ],
  "outcome": "Leader can judge whether information supports a decision.",
  "exceptions": [
    "Partial source failure: show available sections with explicit gaps.",
    "Stale evidence for mutation: block and re-review before decision."
  ],
  "authorization": "Do not expose withheld cases through error counts or hidden-widget totals.",
  "reads": "Owner projection watermark; source availability; exact metric definition.",
  "writes": "None apart from bounded refresh telemetry.",
  "acceptance": "Unavailable source does not appear as 0; approval cannot consume stale expected version.",
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
