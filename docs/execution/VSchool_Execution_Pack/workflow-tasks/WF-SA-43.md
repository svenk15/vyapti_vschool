# WF-SA-43 — Review learning readiness and follow-up

Source workflow: SA-43. Workspace: VSchool_School_Admin_Design. Source area: planning. Catalog phase: 3.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-43",
  "module": "planning",
  "title": "Review learning readiness and follow-up",
  "phase": 3,
  "capability": "learning.overview; content authority delegated",
  "steps": [
    {
      "title": "Choose the class",
      "help": "Show completion and workload within explicit school authority.",
      "fields": [
        {
          "name": "section",
          "label": "Class",
          "type": "select",
          "options": [
            "Grade 6 · A",
            "Grade 6 · B",
            "Grade 7 · A"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "view",
          "label": "View",
          "type": "select",
          "options": [
            "Upcoming assignments",
            "Unpublished feedback",
            "Student follow-up"
          ],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Coordinate support",
      "help": "Teachers remain authors of lesson content and feedback.",
      "fields": [
        {
          "name": "owner",
          "label": "Responsible teacher",
          "type": "select",
          "options": [
            "Ananya Rao",
            "Rohan Das"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "request",
          "label": "Requested follow-up",
          "type": "textarea",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An authorized follow-up points to the owning learning record.",
  "rule": "Do not reveal draft feedback to guardians or auto-score missing work as zero.",
  "edge": "Revoked enrollment or assignment restricts content; attachments remain private and scanned.",
  "data": "Learning read projection of Assignment/SubmissionRevision/Feedback; follow-up command does not publish teacher drafts."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
