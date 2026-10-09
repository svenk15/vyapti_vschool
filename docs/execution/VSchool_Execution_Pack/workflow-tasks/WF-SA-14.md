# WF-SA-14 — Grant staff sign-in access

Source workflow: SA-14. Workspace: VSchool_School_Admin_Design. Source area: staff. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-14",
  "module": "staff",
  "title": "Grant staff sign-in access",
  "phase": 1,
  "capability": "user.manage",
  "steps": [
    {
      "title": "Select staff",
      "help": "Access is a separate operation from creating an employee.",
      "fields": [
        {
          "name": "employee",
          "label": "Employee",
          "type": "select",
          "options": [
            "Ananya Rao · EMP-001",
            "Rohan Das · EMP-002",
            "Meera Iyer · EMP-003"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "email",
          "label": "Account email",
          "type": "email",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Verify and scope",
      "help": "A non-sensitive reference records the out-of-band verification.",
      "fields": [
        {
          "name": "verification",
          "label": "Identity verification reference",
          "type": "text",
          "options": [],
          "required": true,
          "value": ""
        },
        {
          "name": "role",
          "label": "Branch role",
          "type": "select",
          "options": [
            "Teacher",
            "School administrator"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Issue access",
      "help": "The trust mode selects the allowed invitation path.",
      "fields": [
        {
          "name": "grant",
          "label": "I confirm the verified identity and selected branch role.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A pending membership/grant is created and the permitted activation path is shown.",
  "rule": "Preserve operator-issued IAM paths; invite email does not prove employee identity. Last-admin safeguards remain.",
  "edge": "A failed delivery is visible to the authorized manager; resend revokes the old token.",
  "data": "Access owns UserAccount, SchoolMembership, RoleGrant and Invite/AccountActivation; People binding is checked through its published contract."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
