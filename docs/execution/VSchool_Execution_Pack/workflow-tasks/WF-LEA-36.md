# WF-LEA-36 — Run a family or staff meeting with follow-up actions

Source workflow: LEA-36. Workspace: VSchool_Principal_Leadership_Workflows. Source area: communication. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-36",
  "area": "communication",
  "title": "Run a family or staff meeting with follow-up actions",
  "phase": 3,
  "trigger": "A permitted discussion needs coordination.",
  "actors": "Principal; authorized Communication + Requests owner",
  "preconditions": "Meeting scheduling scope approved; participant permissions and availability policy.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Define purpose and permitted participants.",
      "result": "No unrestricted contact search or hidden addition of guardians."
    },
    {
      "actor": "Principal",
      "action": "Propose/confirm a time and agenda.",
      "result": "Acceptance state distinct from invitation delivery."
    },
    {
      "actor": "Principal",
      "action": "Record agreed non-sensitive actions.",
      "result": "Each action has owner, due date and permitted evidence."
    },
    {
      "actor": "System / owner",
      "action": "Share authorized summary and review progress.",
      "result": "Private notes stay separate; closure uses actual results."
    }
  ],
  "fields": [
    {
      "name": "Participants",
      "rule": "Current purpose-authorized identities."
    },
    {
      "name": "Time",
      "rule": "Explicit timezone and availability."
    },
    {
      "name": "Agenda/actions",
      "rule": "Bounded and visible only to intended participants."
    }
  ],
  "outcome": "Confirmed meeting and accountable next steps.",
  "exceptions": [
    "Declined invitation does not mean meeting occurred.",
    "A participant loses access: remove future visibility and recheck sharing."
  ],
  "authorization": "Meeting membership does not transfer access to full student/HR/case records.",
  "reads": "Permitted participant references; meeting state; source action references.",
  "writes": "Meeting owner and coordination records only.",
  "acceptance": "Sharing the summary excludes private staff/case notes.",
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
