# WF-SA-07 — Review branding and school sign-in

Source workflow: SA-07. Workspace: VSchool_School_Admin_Design. Source area: settings. Catalog phase: 1.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "SA-07",
  "module": "settings",
  "title": "Review branding and school sign-in",
  "phase": 1,
  "capability": "branding.read; branding.write requires explicit delegation",
  "steps": [
    {
      "title": "Preview school identity",
      "help": "Use constrained tokens so accessibility and layout remain consistent.",
      "fields": [
        {
          "name": "palette",
          "label": "Palette",
          "type": "select",
          "options": [
            "Forest",
            "Indigo",
            "Clay"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "display",
          "label": "School display name",
          "type": "text",
          "options": [],
          "required": true,
          "value": "Greenwood Schools"
        },
        {
          "name": "welcome",
          "label": "Welcome message",
          "type": "text",
          "options": [],
          "required": true,
          "value": "A clear start to every school day."
        }
      ]
    },
    {
      "title": "Review before publication",
      "help": "Preview desktop and mobile. Publication requires the institution’s branding permission.",
      "fields": [
        {
          "name": "review",
          "label": "I have reviewed the school name, sign-in URL and palette.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "A delegated publisher can publish; other school administrators can request a branding update.",
  "rule": "Branding never changes authorization, status semantics, layout or external redirect destinations.",
  "edge": "Reject unsafe assets, unreadable colors and an already claimed public slug; keep the published revision unchanged.",
  "data": "BrandProfile / revision owned by Branding, linked to Organization and authorized School. Public projection contains no private settings."
}
```

## Required implementation handoff
1. Map source workflow to canonical module and task ID, actual gateway method, endpoint, capability, table/owner read model and approved reference route. Mark existing/partial/new with file evidence.
2. Preserve every original authorization/invariant/recovery condition above. Resolve missing fields and owner contracts in module DESIGN.md before implementation; do not invent fictional persistence or use an admin wildcard.
3. Implement one usable end-to-end slice through owner facade → scoped persistence → gateway → screen. Reuse shared shell and controls from Wave A.
4. Add incremental synthetic seeds via existing pnpm demo:seed when new data scenarios are required; no teardown.
5. Acceptance: demonstrate the specified outcome, its stated alternate/recovery condition, cross-scope denial, and version/replay where a mutation exists. Persisted changes survive reload.
6. Update module evidence with tested commit, commands/results, demo URL/steps, pending human review and exact next task. Promote this card's coverage only when the full source contract is satisfied.
