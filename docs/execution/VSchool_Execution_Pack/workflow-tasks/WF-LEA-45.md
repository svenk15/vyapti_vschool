# WF-LEA-45 — Review a source-linked leadership draft

Source workflow: LEA-45. Workspace: VSchool_Principal_Leadership_Workflows. Source area: assistant. Catalog phase: 7.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-45",
  "area": "assistant",
  "title": "Review a source-linked leadership draft",
  "phase": 7,
  "trigger": "Leader asks for a summary of permitted school evidence.",
  "actors": "Principal; authorized AI application + source owners owner",
  "preconditions": "Approved AI provider/data policy, source access and evaluation gates.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose a bounded question and scope.",
      "result": "Preview permitted sources and source cutoff."
    },
    {
      "actor": "Principal",
      "action": "Generate an advisory draft.",
      "result": "Citations link to authorized source versions; gaps stated explicitly."
    },
    {
      "actor": "Principal",
      "action": "Review and edit every proposed conclusion/action.",
      "result": "No opaque pupil risk score, staff ranking or sensitive inference."
    },
    {
      "actor": "System / owner",
      "action": "Choose a separate authorized action if useful.",
      "result": "AI never publishes, approves, changes attendance or sends a message autonomously."
    }
  ],
  "fields": [
    {
      "name": "Question",
      "rule": "Bounded; no secrets or unnecessary personal detail."
    },
    {
      "name": "Sources",
      "rule": "Permission-filtered at retrieval and open time."
    },
    {
      "name": "Action",
      "rule": "Explicit human-owned command with normal guards."
    }
  ],
  "outcome": "Human-reviewed, evidence-linked assistance.",
  "exceptions": [
    "Missing/contradictory evidence: say uncertain, do not invent a policy or causal explanation.",
    "Untrusted source text cannot alter permissions or tool instructions."
  ],
  "authorization": "Principal role does not widen AI retrieval; output is not a new authority source.",
  "reads": "Minimized permitted published/operational sources and provenance.",
  "writes": "Approved draft/evaluation metadata; no consequential automatic write.",
  "acceptance": "A model-generated suggested approval cannot call the owner approval command.",
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
