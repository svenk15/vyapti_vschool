# WF-TEA-18 — Prepare a class message

Source workflow: TEA-18. Workspace: VSchool_Teacher_Design. Source area: communication. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-18",
  "area": "communication",
  "title": "Prepare a class message",
  "phase": 2,
  "capability": "communication.compose; send requires delegated scope",
  "entry": "communication/compose",
  "steps": [
    {
      "title": "Message",
      "help": "Keep sensitive details out of notification previews.",
      "fields": [
        {
          "name": "class",
          "label": "Assigned class",
          "type": "select",
          "options": [
            "Grade 6 · A · Mathematics",
            "Grade 6 · B · Mathematics",
            "Grade 7 · A · Science"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "subject",
          "label": "Subject",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "body",
          "label": "Message",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Audience review",
      "help": "Show eligible verified recipients and exclusions without exposing private family restrictions.",
      "fields": [
        {
          "name": "audience",
          "label": "Audience",
          "type": "select",
          "options": [
            "Approved guardians of this class",
            "Assigned school staff"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "audienceReviewed",
          "label": "I have reviewed the intended audience.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Submit for approval",
      "help": "Direct send is available only when explicitly granted.",
      "fields": [
        {
          "name": "next",
          "label": "Action",
          "type": "select",
          "options": [
            "Send to authorized approver",
            "Save draft"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A message draft or approval request has a visible status.",
  "rule": "Teacher role is not a blanket send grant. Recheck relationship, purpose, consent and module access at actual delivery.",
  "recovery": "Provider failure/unknown is distinct from sent/delivered. Revoked relationships are suppressed, not retried.",
  "data": "Communication owns MessageCampaign, recipient snapshot and delivery attempts; Guardians supplies live purpose grants via a minimal contract.",
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
