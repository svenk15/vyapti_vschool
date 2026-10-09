# WF-TEA-19 — Reply in a permitted family conversation

Source workflow: TEA-19. Workspace: VSchool_Teacher_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-19",
  "area": "communication",
  "title": "Reply in a permitted family conversation",
  "phase": 2,
  "capability": "communication.reply + child/conversation grant",
  "entry": "communication/thread/t1",
  "steps": [
    {
      "title": "Conversation context",
      "help": "The family and child relationship is checked on every read.",
      "fields": [
        {
          "name": "student",
          "label": "Student in assigned class",
          "type": "select",
          "options": [
            "Aarav Mehta · GW-26001",
            "Diya Rao · GW-26002",
            "Kabir Shah · GW-26003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "thread",
          "label": "Conversation",
          "type": "select",
          "options": [
            "Class learning question"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Reply",
      "help": "Use the approved conversation; do not reveal other children or private contact lists.",
      "fields": [
        {
          "name": "reply",
          "label": "Reply",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A reply appears in the authorized thread with its actual delivery state.",
  "rule": "No teacher-created guardian relationship or invitation. A household contact or payer is not automatically a portal guardian.",
  "recovery": "Removed participant or revoked child grant prevents further disclosure; report safely to the school office.",
  "data": "ConversationGrant/Message version references exact child and participants; queued delivery rechecks current grants.",
  "proposal": false
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
