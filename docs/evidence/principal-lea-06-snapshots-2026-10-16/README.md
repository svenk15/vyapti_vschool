# LEA-06 retained aggregate snapshot evidence

Date: 16 October 2026

Implementation parent: `2fcae63` plus the focused LEA-06 files committed with this record

Human review: PENDING

## Contract and routes

- Approved immutable reference: Principal workflow `LEA-06 — Recognize stale, incomplete or unavailable information` in `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`.
- Current source: `/leadership/attendance` and `/leadership/attendance/source/[sessionId]`.
- Retained history: `/leadership/reports/snapshots` and `/leadership/reports/snapshots/[id]`.
- The approved source is a workflow dialog, not an exact retained-snapshot page. The production pages are the smallest shared-shell extension of that cutoff/freshness/recovery contract.

The feature defaults to disabled. `VSCHOOL_REPORTING_SNAPSHOT_MODE=synthetic` enables only fictional local/test use. Current Principal report-read authority gates every list/detail read. The separately operator-designated `reporting.snapshot.manage` grant gates capture/removal; it is never automatic.

## Database and security evidence

- Forward migration `20261016142000_reporting_snapshots` is applied to development and test; each has 67 retained migrations.
- `vs_reporting_snapshot_manager_grant` and `vs_reporting_snapshot` are Path A BRANCH tables registered for the TEN-03 closure gate.
- Real PostgreSQL, 12/12: no automatic manager grant; designation and revocation; current report-read; foreign-scope denial; exact capture replay and changed-payload conflict; immutable payload after source mutation; manager revocation without loss of authorized read; removal and removal replay; stale-link denial; payload/hash nulling; safe audit fields.
- Focused unit, 9/9: exact bounded owner request and rejection when the source has more than 50 evidence rows.
- Snapshot payload excludes pupil identities, roster, marks, explanations, correction history, private responses and feedback. Removal does not alter Attendance source data.

## Browser and visual evidence

- Desktop Chromium, one worker: 6/6 passed.
- Mobile Chromium, one worker: 6/6 passed after changing an ambiguous partial accessible-name locator to the exact drawer label; no product behavior was changed by that retry.
- The Chromium run performed a current-source production build successfully.
- Keyboard evidence includes mobile drawer Escape and focus return. Native VoiceOver/NVDA was not performed.

Directly inspected captures:

- [Approved reference, desktop](reference-chromium.png)
- [Application retained snapshot, desktop](application-retained-chromium.png)
- [Application removal confirmation, desktop](application-remove-chromium.png)
- [Approved reference, mobile](reference-mobile.png)
- [Application retained snapshot, mobile](application-retained-mobile.png)
- [Application removal confirmation, mobile](application-remove-mobile.png)

The application retains the approved information hierarchy: visible cutoff/freshness, separate unavailable/retained meanings, safe source facts, and a current-source recovery action. Its production shell, aggregate cards and destructive confirmation are an extension because the pack has no exact retained-snapshot page. The full-page confirmation images show Playwright's stitched fixed-header position after page scroll; direct page inspection did not treat that composite position as a runtime layout state. Exact Mac font portability and human visual acceptance remain pending.

## Seed and limitations

`pnpm exec tsx scripts/demo-principal-attendance.ts` completed against guarded development PostgreSQL and preserved the connected fictional Principal/export/snapshot scenario. Credentials and the seeded snapshot ID are stored only in ignored mode-0600 `artifacts/leadership-01/private-demo.json`.

Real-data availability remains blocked until retention and backup-deletion policy is approved. TEN-03, native accessibility, production provider/operations and human acceptance remain separate gates.
