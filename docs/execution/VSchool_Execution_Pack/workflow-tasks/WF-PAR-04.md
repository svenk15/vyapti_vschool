# WF-PAR-04 — Review my verified child links

Source workflow: PAR-04. Workspace: VSchool_Parent_Guardian_Design. Source area: access. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "PAR-04",
  "area": "access",
  "title": "Review my verified child links",
  "phase": 2,
  "purpose": "relationship self-read with purpose-filtered child summary",
  "steps": [
    {
      "title": "My children",
      "help": "A separate grant exists for each child, school and purpose.",
      "fields": [
        {
          "name": "view",
          "label": "Review",
          "type": "select",
          "options": [
            "Active linked children",
            "Access purposes for selected child"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Access question",
      "help": "A relationship label does not imply every capability.",
      "fields": [
        {
          "name": "next",
          "label": "Next step",
          "type": "select",
          "options": [
            "Open permitted child dashboard",
            "Ask the school about access"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The parent understands the children and purposes they can access.",
  "invariant": "No unrestricted household or co-guardian directory. Do not reveal private reasons for restrictions or compare children.",
  "recovery": "Revoked/ended links disappear from protected lists; old deep links fail without leaking details.",
  "data": "GuardianRelationship → effective PurposeGrant → child/enrollment summary, constrained by institution and branch.",
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
