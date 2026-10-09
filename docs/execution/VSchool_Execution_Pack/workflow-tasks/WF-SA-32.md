# WF-SA-32 — Verify and link a parent or guardian

Source workflow: SA-32. Workspace: VSchool_School_Admin_Design. Source area: families. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-32",
  "module": "families",
  "title": "Verify and link a parent or guardian",
  "phase": 2,
  "capability": "guardian.relationship.manage",
  "steps": [
    {
      "title": "Student & adult",
      "help": "Select a student from the authorized branch and the independently verified adult.",
      "fields": [
        {
          "name": "student",
          "label": "Student",
          "type": "select",
          "options": [
            "Branch student by exact authorized ID"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "relationship",
          "label": "Relationship",
          "type": "select",
          "options": [
            "Parent",
            "Legal guardian",
            "Authorized caregiver"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "adult",
          "label": "Adult’s full name",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "email",
          "label": "Verified email address",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Verify & choose access",
      "help": "Mailbox possession is not proof. Record school verification and dates; select at least one independent purpose.",
      "fields": [
        {
          "name": "reference",
          "label": "School verification reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "from",
          "label": "Access starts",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "to",
          "label": "Last day of access (inclusive)",
          "type": "date",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "verified",
          "label": "I have verified the relationship and checked restrictions.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "attendance",
          "label": "Attendance · read only",
          "type": "checkbox",
          "options": [],
          "required": false,
          "value": ""
        },
        {
          "name": "notices",
          "label": "School notices · independently selected",
          "type": "checkbox",
          "options": [],
          "required": false,
          "value": ""
        }
      ]
    },
    {
      "title": "Review",
      "help": "Review child, adult, purpose and dates before approval. Approval creates an inactive grant.",
      "fields": [
        {
          "name": "confirm",
          "label": "Approve connection",
          "type": "confirmation",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A verified child-specific relationship and inactive selected purpose grants are approved. Intended-account acceptance activates only those approved purposes.",
  "rule": "No mailbox-only or sibling-inherited authorization. Each child-purpose link has verified identity, scope and dates; a draft never grants access.",
  "edge": "Invalid dates, duplicates, disputed identity, lost authorization and unfinished drafts have explicit recovery. Contact, fee, pickup and consent permissions remain separate.",
  "data": "Guardians owns Guardian and dated StudentGuardianGrant; references organization Person/Student and optional global UserAccount binding.",
  "subjourneys": [
    "new connection",
    "student-record entry",
    "save/resume draft",
    "school access-request review"
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
