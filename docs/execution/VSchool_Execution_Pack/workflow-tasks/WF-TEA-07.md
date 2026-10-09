# WF-TEA-07 — Review my assigned classes

Source workflow: TEA-07. Workspace: VSchool_Teacher_Design. Source area: classes. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-07",
  "area": "classes",
  "title": "Review my assigned classes",
  "phase": 1,
  "capability": "class.read for dated assignments",
  "entry": "classes",
  "steps": [
    {
      "title": "Class context",
      "help": "Choose an assigned offering, not an institution-wide class directory.",
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
        }
      ]
    },
    {
      "title": "Class workspace",
      "help": "Show the relevant year, subject, assignment dates and upcoming sessions.",
      "fields": [
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Roster",
            "Upcoming sessions",
            "Authorized attendance history"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "The class workspace explains what the teacher can do and for which dates.",
  "rule": "Recheck the dated assignment on every protected read. Historical visibility follows the current approved access contract, not lifelong access from one past lesson.",
  "recovery": "Ended or changed assignments show unavailable content and an administrator handoff.",
  "data": "Academics Offering/Assignment/Teacher eligibility compose an authorized class DTO; Students supplies only minimal roster facts.",
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
