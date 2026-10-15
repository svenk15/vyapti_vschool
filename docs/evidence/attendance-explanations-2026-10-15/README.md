# ATT-05 / PAR-11 / PAR-12 / SA-29 evidence — 15 October 2026

## Delivered outcome

An explicitly authorized Parent can explain one submitted `ABSENT` register entry for an authorized child, track the protected case and withdraw it while submitted. A separately designated branch reviewer can accept or decline through a staged review. The disposition never changes the Attendance mark. Protected narrative storage is enabled only for fictional local/test data by explicit injected configuration; real-data release remains blocked until retention is approved.

This evidence verifies the working tree checkpoint based on `02e166dc054d26831be4efe28caa09380e77268e`; the executable checkpoint is the commit containing this file.

## Contracts and persistence

- Forward migration: `20261015140000_attendance_explanations`; applied to development and `vyapti_vschool_test`. Both report 54 migrations and no pending test migration.
- New branch-scoped contracts: `vs_attendance_explanation_reviewer_grant` and `vs_attendance_explanation`, including scoped references, optimistic versioning and one active-or-accepted case per Student/session.
- The independent `attendance.explanation.submit` Guardian purpose is never inferred from Attendance read access or backfilled. Reviewer authority is a separate explicit branch grant.
- Same actor/key/payload replays; changed payload conflicts. Review and withdrawal serialize on current state/version. General audit/receipt evidence excludes the explanation and school response.

## Verification

- `pnpm exec tsc --noEmit` — passed.
- `pnpm check:db-design` — passed with 80 registered table contracts.
- `pnpm test:functional test/functional/attendance-explanations.test.ts` — 2/2 passed against real PostgreSQL with 54 migrations. It covers submit replay/conflict, active-case exclusion, current-purpose revocation, Parent/reviewer projections, decline then new submission, withdrawal, unchanged Attendance record and narrative exclusion from general evidence.
- `pnpm build` — passed after the final staged-review change.
- `node scripts/verify-attendance-explanations-local.mjs` — passed against `http://127.0.0.1:3400` with one browser. It covers Parent Reason → Explanation → Review focus and retained input, persisted submit/reload, Administrator Review disposition → Confirm focus/action, withdrawal and renewed eligibility.

## Direct reference comparison

Approved states:

- Parent: `VSchool_Parent_Guardian_Review.html#/attendance/explain`
- Administrator: `VSchool_School_Admin_Review.html#/flow/SA-29`

The reference is served unchanged from the approved pack. Captures use Chromium, 1440×1000 and 390×844, device scale factor 1, `en-GB`, `Asia/Kolkata` and reduced motion. Reference and application images were directly inspected after correcting an initially invalid reference-server path; the earlier 404 captures were overwritten by the valid matched states in this directory.

- Parent production uses the accepted exact-session contract and three in-page stages instead of the prototype's date-range form plus confirmation modal. This is a required contract difference: eligibility is derived from an existing submitted `ABSENT` session, never an arbitrary browser date range.
- Administrator production now matches the approved three-stage hierarchy for Parent request, disposition review and final confirmation. It additionally shows the authorized exact Student/register facts needed to prevent selecting or reviewing the wrong case. Durable prototype drafts remain absent because ATT-05 does not approve cross-session draft persistence.
- Shared shell, hierarchy, controls, actions, side guidance and responsive stacking are aligned. Real authorized names/context replace prototype fixtures.
- The documented body-font portability exception remains. Native VoiceOver/NVDA and physical browser zoom were not performed.

## Evidence files

- `reference-parent-explanation-{desktop,mobile}.png`
- `application-parent-review-{desktop,mobile}.png`
- `application-parent-submitted-desktop.png`
- `reference-admin-review-{desktop,mobile}.png`
- `application-admin-review-{desktop,mobile}.png`
- `browser-results.json`

## Status and gates

Functional/security verification: **ENGINEERING_COMPLETE** for the authorized fictional-data slice. Reference comparison: **DIRECT_COMPARISON_WITH_CONTRACT_EXTENSION**. Human review: **PENDING**. Protected-text retention for real data, TEN-03 RLS/context proof, native accessibility, font portability and production-provider/release review remain mandatory gates.
