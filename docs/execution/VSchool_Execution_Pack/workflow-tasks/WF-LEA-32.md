# WF-LEA-32 — Prepare a targeted school notice

Source workflow: LEA-32. Workspace: VSchool_Principal_Leadership_Workflows. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "LEA-32",
  "area": "communication",
  "title": "Prepare a targeted school notice",
  "phase": 2,
  "trigger": "Leadership needs to communicate a school update.",
  "actors": "Principal; authorized Communication + Requests owner",
  "preconditions": "Draft/publish grants separate; recipient-purpose model active.",
  "steps": [
    {
      "actor": "Principal",
      "action": "Choose purpose and allowed audience.",
      "result": "Preview branch/class/role and recipient count without exposing unnecessary contacts."
    },
    {
      "actor": "Principal",
      "action": "Write notice and permitted attachments.",
      "result": "Required acknowledgement is optional and distinct from consent."
    },
    {
      "actor": "Principal",
      "action": "Preview content, timing and audience.",
      "result": "School timezone, channels and changed recipient scope visible."
    },
    {
      "actor": "System / owner",
      "action": "Save draft or submit for approval/publish if granted.",
      "result": "No send until explicit authorized confirmation."
    }
  ],
  "fields": [
    {
      "name": "Audience",
      "rule": "Explicit authorized groups; no default all-institution."
    },
    {
      "name": "Title/body",
      "rule": "Bounded content; plain, action-oriented language."
    },
    {
      "name": "Acknowledgement",
      "rule": "Explicit toggle with explanation."
    },
    {
      "name": "Schedule",
      "rule": "Optional owner-supported future release."
    }
  ],
  "outcome": "Prepared notice or owner-confirmed publication.",
  "exceptions": [
    "Audience changes before send: regenerate preview.",
    "Not authorized to publish: draft/approval handoff, not hidden direct send."
  ],
  "authorization": "Broadcast authority is separate from reading private family conversations.",
  "reads": "Allowed audience rules; current recipient purposes; attachment scan state.",
  "writes": "Communication draft/approval/publication via owner.",
  "acceptance": "No message is sent merely by selecting audience or saving a draft.",
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
