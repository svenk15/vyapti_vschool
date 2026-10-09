# WF-PAR-15 — Reply to a permitted conversation

Source workflow: PAR-15. Workspace: VSchool_Parent_Guardian_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-15",
  "area": "communication",
  "title": "Reply to a permitted conversation",
  "phase": 2,
  "purpose": "communication.reply_child + conversation grant",
  "steps": [
    {
      "title": "Conversation",
      "help": "Use the school-approved child-specific thread.",
      "fields": [
        {
          "name": "topic",
          "label": "Conversation",
          "type": "select",
          "options": [
            "Fractions practice · Ananya Rao",
            "School office query"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Reply",
      "help": "Do not include other pupils or private family restrictions.",
      "fields": [
        {
          "name": "message",
          "label": "Your message",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The reply has its real sending/delivery state in the permitted thread.",
  "invariant": "Recipient identities are server-resolved. No unrestricted teacher address book or co-guardian visibility. Parent cannot add participants.",
  "recovery": "Access removed before send stops delivery. Failed or unknown send remains distinct from sent; reconcile before retry.",
  "data": "ConversationGrant → Message → delivery attempt, bound to selected child and live participants.",
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
