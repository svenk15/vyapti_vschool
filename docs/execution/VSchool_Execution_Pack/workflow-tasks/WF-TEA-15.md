# WF-TEA-15 — Use offline-assisted attendance

Source workflow: TEA-15. Workspace: VSchool_Teacher_Design. Source area: attendance. Catalog phase: 2.

Status: DESIGN_RECONCILIATION_REQUIRED. This coverage card is not a claim of implementation readiness or completion. Find the matching owner task; do not build the same business operation again for another workspace. Wave A may cover the existing-operation subset; record the exact subset and remaining gaps.

## Original contract (unaltered)
```json
{
  "id": "TEA-15",
  "area": "attendance",
  "title": "Use offline-assisted attendance",
  "phase": 2,
  "capability": "attendance.mark + approved offline capability",
  "entry": "flow/TEA-15",
  "steps": [
    {
      "title": "Prepare an authorized session",
      "help": "Offline access needs a separately approved privacy and device design.",
      "fields": [
        {
          "name": "session",
          "label": "Assigned session",
          "type": "select",
          "options": [
            "Mathematics · Grade 6 A · 8 Oct, 09:00",
            "Mathematics · Grade 6 B · 8 Oct, 11:15"
          ],
          "required": true,
          "value": ""
        },
        {
          "name": "device",
          "label": "This device meets the school’s approved offline policy.",
          "type": "checkbox",
          "options": [],
          "required": true,
          "value": ""
        }
      ]
    },
    {
      "title": "Reconnect and reconcile",
      "help": "Queued does not mean submitted.",
      "fields": [
        {
          "name": "next",
          "label": "Sync action",
          "type": "select",
          "options": [
            "Review pending intent",
            "Resolve server conflict",
            "Check acknowledged receipt"
          ],
          "required": true,
          "value": ""
        }
      ]
    }
  ],
  "outcome": "An authorized queued intent is reconciled explicitly and then acknowledged.",
  "rule": "Phase 1 remains online-first. Any later durable queue needs expiry, minimization, device protection and reauthorization before replay.",
  "recovery": "Permission revocation, lost device, changed roster, expired queue and competing submission must not silently sync.",
  "data": "Proposed offline intent metadata + protected local payload; owner submission/receipt unchanged. Storage/security design required before coding.",
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
