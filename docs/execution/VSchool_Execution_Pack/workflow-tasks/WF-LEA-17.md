# WF-LEA-17 — Review assignment completion with the right denominator

Source workflow: LEA-17. Workspace: VSchool_Principal_Leadership_Workflows. Source area: academics. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-17",
  "area": "academics",
  "title": "Review assignment completion with the right denominator",
  "phase": 3,
  "trigger": "Leader reviews work completion for a class or subject.",
  "actors": "Principal; authorized Academics + Learning + Assessments owner",
  "preconditions": "Learning oversight grant and published assignment audience/extension rules.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose class, subject and period.",
      "result": "Show expected learner-assignment pairs due by cutoff."
    },
    {
      "actor": "Principal",
      "action": "Open submitted, awaiting or excused group.",
      "result": "Latest accepted attempt per pair counts once; private drafts remain private."
    },
    {
      "actor": "Principal",
      "action": "Inspect permitted evidence and context.",
      "result": "Extensions and missing audience data are explicit."
    },
    {
      "actor": "System / owner",
      "action": "Create a scoped teaching follow-up if justified.",
      "result": "Action names class/task, owner and evidence goal; no bulk student penalty."
    }
  ],
  "fields": [
    {
      "name": "Period/cutoff",
      "rule": "Explicit school time."
    },
    {
      "name": "Population",
      "rule": "Published assignment audience as of documented snapshot."
    },
    {
      "name": "Follow-up",
      "rule": "Optional, distinct from grade/discipline."
    }
  ],
  "outcome": "Accurate completion review and an authorized educational next step.",
  "exceptions": [
    "Unavailable submission data is not non-completion.",
    "A second attempt does not count as a second pupil."
  ],
  "authorization": "Default leadership oversight does not expose private drafts or all student response content.",
  "reads": "Published assignment recipients; accepted attempts; extensions/excused policy.",
  "writes": "Optional internal coordination action.",
  "acceptance": "Extended/not-yet-due and excused pairs follow the documented denominator policy.",
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
