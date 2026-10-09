# WF-LEA-19 — Coordinate an evidence-based learning concern

Source workflow: LEA-19. Workspace: VSchool_Principal_Leadership_Workflows. Source area: academics. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-19",
  "area": "academics",
  "title": "Coordinate an evidence-based learning concern",
  "phase": 3,
  "trigger": "A teacher or authorized academic review identifies a learning concern.",
  "actors": "Principal; authorized Academics + Learning + Assessments owner",
  "preconditions": "Approved learning-support purpose; school process and authorized coordinator.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Review permitted task/assessment evidence.",
      "result": "Describe observable facts, not a diagnosis or predictive score."
    },
    {
      "actor": "Principal",
      "action": "Choose an educational follow-up.",
      "result": "Owner, review date and intended improvement are explicit."
    },
    {
      "actor": "Principal",
      "action": "Include family/student only through authorized channels.",
      "result": "Relationship and communication purposes rechecked."
    },
    {
      "actor": "System / owner",
      "action": "Review progress against agreed evidence.",
      "result": "Close or revise the support action; private specialist records remain separate."
    }
  ],
  "fields": [
    {
      "name": "Concern",
      "rule": "Factual, bounded description."
    },
    {
      "name": "Evidence",
      "rule": "Permitted published/returned source references."
    },
    {
      "name": "Review date",
      "rule": "Explicit; no indefinite unresolved action."
    }
  ],
  "outcome": "Human-owned learning support with a review checkpoint.",
  "exceptions": [
    "Sensitive care concern routes to the specialist workspace.",
    "No access to evidence: assign authorized reviewer without exposing it."
  ],
  "authorization": "No automatic mental-health inference, grading change or disciplinary action.",
  "reads": "Authorized learning evidence and minimal student/class context.",
  "writes": "Restricted educational follow-up only; separate specialist referral if needed.",
  "acceptance": "General school dashboards never reveal confidential support narrative.",
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
