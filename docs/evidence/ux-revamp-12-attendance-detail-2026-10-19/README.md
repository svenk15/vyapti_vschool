# UX-12 Attendance detail regression

Date: 19 October 2026 (Asia/Kolkata)

- Source: `d8ebad1`; standard build `W4fweDwPT7U_tJ7747JKm`.
- Application: `/admin/attendance/sessions/[id]` using the existing fictional submitted-register fixture.
- Approved authority: `VSchool_School_Admin_Review.html#/flow/SA-27`.
- Viewports: `1440×1000` and `390×844`, DPR 1. Playwright viewport emulation is not actual browser zoom.

The current submitted-register page retains the approved three-stage Select record → Record evidence → Confirm composition, two-column desktop/support layout, linear mobile layout, compact form controls, final-only correction and explicit disabled Save draft. Existing links to immutable revision history and guarded cancellation remain in the support rail. The exact reference and application were directly inspected; the application uses real authorized session/roster/history data and therefore does not reproduce prototype sample values.

No presentation defect was found after the shared shell and Student-detail work. The current source changes only Student-specific selectors, so the prior SA-27 functional/security evidence remains applicable. That evidence covers retained in-flow values, required reason, final confirmation, exact-key lost-response recovery, stale revision, immutable history, cancellation access and owner acceptance of the staged layout/normal correction journey. This checkpoint adds current-source desktop/mobile visual regression evidence only; it does not extend the scope of that acceptance.

Files: `reference-sa-27-{desktop,mobile}.png`, `application-{desktop,mobile}.png`, and `metrics.json`. Root overflow is zero. Human review for this current revamp remains pending; forced recovery/cancellation visual states, native accessibility, actual browser zoom, TEN-03 and production release remain separate gates.
