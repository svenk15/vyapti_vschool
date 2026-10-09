# WF-SA-35 — Compose and send a school message

Source workflow: SA-35. Workspace: VSchool_School_Admin_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-35",
  "module": "communication",
  "title": "Compose and send a school message",
  "phase": 2,
  "capability": "communication.send",
  "steps": [
    {
      "title": "Message",
      "help": "Write a clear text notice. Acknowledgement is deliberate receipt, not consent.",
      "fields": [
        {
          "name": "title",
          "label": "Subject (up to 120 characters)",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "body",
          "label": "Message (up to 5,000 characters)",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "ack",
          "label": "Ask recipients to acknowledge",
          "type": "checkbox",
          "options": [],
          "required": false,
          "value": ""
        },
        {
          "name": "due",
          "label": "Acknowledge by (required when requested)",
          "type": "date",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    },
    {
      "title": "Recipients",
      "help": "Resolve accounts from live approved purpose grants or staff membership; attendance alone is insufficient.",
      "fields": [
        {
          "name": "audience",
          "label": "Audience",
          "type": "select",
          "options": [
            "Parents / guardians of a class",
            "Parents / guardians in this branch",
            "Active staff in this branch"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "className",
          "label": "Class (when class audience chosen)",
          "type": "select",
          "options": [
            "Authorized branch class"
          ],
          "required": false,
          "value": ""
        },
        {
          "name": "email",
          "label": "Also send a verified-email notification",
          "type": "checkbox",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    },
    {
      "title": "Review",
      "help": "Teacher submits for approval; an authorized school publisher confirms current draft and audience.",
      "fields": [
        {
          "name": "when",
          "label": "Publish",
          "type": "select",
          "options": [
            "Now",
            "At a scheduled time"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "scheduled",
          "label": "School-local scheduled date/time (when scheduled)",
          "type": "datetime-local",
          "options": [],
          "required": false,
          "value": ""
        },
        {
          "name": "reviewed",
          "label": "I reviewed the message, audience, timing and acknowledgement.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A draft is approved, published or scheduled with a stable notice identity and exact immutable version. Recipients read and explicitly acknowledge through their own workspace.",
  "rule": "Explicit school-notice purpose and current scope control the audience. Teacher role has no blanket send authority. Read, provider acceptance and acknowledgement remain separate.",
  "edge": "Changed audience/draft requires renewed review. Lost publication response uses the existing receipt. Scheduled delivery rechecks the approved manifest without silently adding accounts.",
  "data": "Communication Notice/Draft/Version/Recipient/Binding, transaction receipt and initial outbox; Guardians/Access/Students resolve current account/purpose/enrollment.",
  "subjourneys": [
    "draft/resume",
    "audience preview",
    "publish",
    "schedule/cancel",
    "teacher approval",
    "parent/staff inbox",
    "version-specific acknowledgement"
  ]
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
