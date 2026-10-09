# WF-LEA-37 — Refer a concern to an authorized specialist

Source workflow: LEA-37. Workspace: VSchool_Principal_Leadership_Workflows. Source area: support. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-37",
  "area": "support",
  "title": "Refer a concern to an authorized specialist",
  "phase": 6,
  "trigger": "A factual observation requires specialist support.",
  "actors": "Principal; authorized Specialist support owner owner",
  "preconditions": "School-defined referral channel and purpose grant; designated specialist service enabled.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Read allowed referral context.",
      "result": "Do not search for a broad student health/case history."
    },
    {
      "actor": "Principal",
      "action": "Record minimum factual concern.",
      "result": "Show who will receive it and the limits of this channel."
    },
    {
      "actor": "Principal",
      "action": "Route to designated specialist.",
      "result": "Receipt confirms referral, not diagnosis, intervention or accepted treatment."
    },
    {
      "actor": "System / owner",
      "action": "Track permitted handoff status only.",
      "result": "Case narrative and specialist notes remain restricted."
    }
  ],
  "fields": [
    {
      "name": "Concern",
      "rule": "Observed facts, no automated diagnosis."
    },
    {
      "name": "Recipient",
      "rule": "Designated specialist route."
    },
    {
      "name": "Urgency",
      "rule": "School-defined routing, not automated medical triage."
    }
  ],
  "outcome": "Restricted referral with an accountable recipient.",
  "exceptions": [
    "Specialist channel unavailable: school-approved contact route shown.",
    "Principal lacks case access after referral: status-only projection if permitted."
  ],
  "authorization": "Referral capability does not grant case-read or health-record access.",
  "reads": "Minimal student identity/purpose context; authorized referral route.",
  "writes": "Specialist referral and safe status evidence.",
  "acceptance": "No detailed health/support narrative appears in school-wide dashboard or analytics.",
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
