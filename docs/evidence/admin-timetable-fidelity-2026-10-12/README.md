# Administrator timetable reference-fidelity checkpoint

Date: 12 October 2026. Human acceptance: **PENDING**.

## Authority and compared states

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-41`
- Implementation specification: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/workflows/SA-41.md`
- Application route: `/admin/timetable`
- Compared states: populated weekly draft, published timetable, publication receipt and Attendance reconciliation/manual-conflict follow-up. School-day editing, review/confirmation, stale recovery and empty/error states retain their focused TT-01–TT-05 evidence.

The comparison used 1440 × 1000 desktop and 390 × 844 mobile viewports. Reference and application captures use equivalent timetable states, while the fictional records differ because the application renders persisted scoped seed data. The screenshots were opened and inspected directly; the overlay is supporting evidence rather than an automated fidelity score.

## Evidence

- Reference draft: [desktop](reference-draft-desktop.png), [mobile](reference-draft-mobile.png)
- Application before correction: [desktop](application-before-desktop.png)
- Corrected draft: [desktop](application-draft-desktop.png), [mobile](application-draft-mobile.png)
- Corrected published view: [desktop](application-published-desktop.png), [mobile](application-published-mobile.png)
- Corrected receipt/reconciliation: [desktop](application-receipt-desktop.png), [mobile](application-receipt-mobile.png)
- Direct comparison aids: [desktop overlay](overlay-draft-desktop.png), [desktop pixel difference](diff-draft-desktop.png), [mobile side-by-side](comparison-draft-mobile.png)
- Overflow probes: [desktop](final-metrics-desktop.json), [mobile](final-metrics-mobile.json); both report no horizontal viewport overflow.

## Corrected differences

- Replaced the generic timetable composition with the approved heading, Timetables/Daily changes tabs, draft status bar, compact class/week controls, previous/next actions, weekly grid, legend and one-day-change guidance.
- Added the approved mobile day selector and single-day cards instead of shrinking or horizontally scrolling the desktop table.
- Aligned title, button, tab, table, cell, card, spacing, radius, icon and responsive dimensions with the ordered reference CSS and shared tokens.
- Defined the missing shared subtle-surface and warning tokens that had made draft/conflict surfaces render transparent.
- Made the latest authorized published timetable reachable from the normal route and its receipt reachable from the published view; no publication identifier needs to be entered manually.
- Kept the immutable publication receipt separate from the reconciliation follow-up and labelled the seven-day reconciliation window explicitly.
- Preserved the normal route through draft → review → confirmation → receipt → published timetable → receipt, including scoped live data and existing recovery controls.

## Verification evidence

- Focused real-PostgreSQL publication suite: 3/3 passed, including the scoped published projection used by the normal route. The dedicated test database reported all 46 migrations applied.
- Sequential one-worker timetable Playwright suite: Chromium 3/3 and mobile 3/3 passed. After the normal-route receipt correction, the affected publication journey passed 1/1 in Chromium and 1/1 on mobile.
- `pnpm check` passed on the final source: lint, TypeScript, documentation, database design, extraction boundaries, portable backend and 142/142 unit tests. The final production build passed with build ID `Pd1V2W3fcaIeK9AgbIHQ8`.
- The final production build was authenticated and captured at both viewports. Draft, published and receipt routes reported no horizontal overflow.

## Remaining differences and gates

- The approved reference declares Inter but does not include a licensed portable Inter body-font asset. The application retains its documented Arial/Helvetica/system fallback, so exact glyph metrics are not claimed.
- The static review reference includes review-only chrome, a context strip and fictional high-density rows. The live application retains the approved shared portal shell and real authorized synthetic data. The overlay therefore is not expected to be pixel-identical in those areas.
- The reference does not specify the TT-05 manual-session conflict receipt. The implementation uses the smallest shared-card extension and keeps its human visual review pending.
- Two-week cycles and rooms retain their recorded timetable deferrals. Native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production gates were not established by this checkpoint.
- Human visual acceptance remains pending and is separate from the functional/security evidence above.

No schema or migration changed in this presentation checkpoint. Development and test databases remain at the existing 46-migration state.
