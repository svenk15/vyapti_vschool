# WF-SA-60 — Review emergency access and restricted case handling

Source workflow: SA-60. Workspace: VSchool_School_Admin_Design. Source area: health. Catalog phase: 6.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-60",
  "module": "health",
  "title": "Review emergency access and restricted case handling",
  "phase": 6,
  "capability": "health.break_glass / safeguarding.review (restricted)",
  "steps": [
    {
      "title": "Exceptional access",
      "help": "Available only to explicitly authorized emergency roles.",
      "fields": [
        {
          "name": "case",
          "label": "Restricted case reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "justification",
          "label": "Emergency access justification",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Accountable review",
      "help": "Access is time bounded and independently reviewed.",
      "fields": [
        {
          "name": "ack",
          "label": "The approved emergency access procedure applies.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "Authorized emergency access has an expiry, audit and independent review.",
  "rule": "No blanket administrator access; this workflow requires a separate sensitive-data design and deployment approval.",
  "edge": "Denied or expired emergency authority must not reveal case contents.",
  "data": "RestrictedNoteGrant/break-glass event and specialist record access audit; no details in general activity."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
