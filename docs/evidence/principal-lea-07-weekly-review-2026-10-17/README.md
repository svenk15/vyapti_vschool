# WF-07 / LEA-07 weekly leadership review evidence

Human review: **PENDING**. Deployment: **SYNTHETIC_ONLY**.

Verified implementation source: recorded after the focused commit. Production build ID: `FgV2cbIPB8CbyorHQPlZc`.

## Scope

The production entry is `/leadership/reviews/new`, with the saved revision at `/leadership/briefs/{id}`. The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow state `LEA-07 — Run the weekly leadership review`; its “Prepare a weekly school summary” explorer story provides the comparable four-step narrative.

The implementation maps that workflow to recipe W: choose a bounded branch-local period and reviewed narrative → select retained source evidence, already-owned Coordination follow-ups and explicit audience → review and save → separately finalize/share. It does not implement a generic meeting/task engine, create unscoped actions, copy private Coordination notes or imply that saving/finalizing completed an action.

## Verification

- Application validation: `test/unit/reporting-leadership-brief.test.ts`, 3/3 passed.
- Real PostgreSQL: `test/functional/coordination-requests.test.ts`, 14/14 passed against `vyapti_vschool_test` with 86 migrations; the LEA-07 case verifies exact replay, append-only linking, live owner authorization and no Coordination lifecycle mutation.
- Browser: `test/e2e/principal-weekly-review.spec.ts`, sequential one-worker Chromium 1/1 and mobile 1/1 against the same production build.
- `pnpm check` passed lint, TypeScript, 30 documentation checks, 135 database contracts, boundaries, portable-backend compilation and 44 unit files / 208 tests. The final production build passed with build ID `FgV2cbIPB8CbyorHQPlZc`.
- The incremental fictional helper passed and is included in `pnpm demo:seed`. The complete guarded seed command exited successfully against `vyapti_vschool`, including the weekly review, without replacing credentials or existing records. It writes only private IDs to `artifacts/leadership-01/private-demo.json`.

The browser deliberately loses a committed save response and recovers the original result with the same payload/key. After finalization, the linked Coordination request remains open and exactly one immutable action reference exists. Reload returns the current live action status and reauthorizing owner link.

## Direct visual comparison

- [Approved reference desktop](reference-chromium.png)
- [Application review desktop](application-review-chromium.png)
- [Application result desktop](application-result-chromium.png)
- [Approved reference mobile](reference-mobile.png)
- [Application review mobile](application-review-mobile.png)
- [Application result mobile](application-result-mobile.png)

The captures were directly inspected for hierarchy, spacing, action placement, responsive table composition and overflow. The approved asset is a workflow-explorer dialog rather than a complete production page. The application preserves its step sequence and labels inside the shared Principal shell and exposes the persisted source/action/audience evidence absent from the catalogue dialog. This is a recorded production-composition deviation, not human visual acceptance. The existing font portability exception remains.

## Database and release limits

Migration `20261018000000_reporting_weekly_review` is forward-only and registered under TEN-ADR-006 Path A. Development and test have 86 migrations. TEN-03 enforcement remains incomplete. Real-data retention, backup deletion and aggregate-disclosure policy remain unresolved, so the workflow stays disabled outside explicit fictional synthetic mode. Native VoiceOver/NVDA and actual browser 200% zoom were not performed.
