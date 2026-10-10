# Administrator attendance lifecycle — 11 October 2026

Human visual acceptance is **PENDING**. Functional verification, direct visual comparison and owner acceptance remain separate. TEN-03, native assistive-technology checks and production release gates remain incomplete.

## Scope and references

- Approved unchanged reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html` at `#/flow/SA-25`, `#/flow/SA-26` and `#/flow/SA-28`.
- Application states: `/admin/attendance/sessions`, `/admin/attendance/sessions?view=monitor`, and `/admin/attendance/sessions/:id`.
- Covered journey: schedule a real synthetic session through the staged review → inspect the persisted scheduled detail → cancel it with a reason → reload the canceled record and immutable history → return to the scoped monitor list.
- Schema/migrations: none. Existing Attendance owner authorization, calendar and overlap checks, optimistic version, receipt, cancellation transaction, history and audit boundaries remain unchanged.

## Implemented alignment

- SA-25 now uses the approved four-stage `Session → Time and teacher → Review schedule → Confirm` composition. Class and subject controls resolve only real authorized offerings; the teacher is the offering's real dated primary assignment.
- The desktop workflow measures 1,136 px overall, with the approved 760 px form card, 24 px gap and 352 px guidance column. The heading is 28 px/650/35 px and the stepper remains on one row. At 390 px the workflow uses a two-column stepper and one-column cards without page overflow.
- SA-26 is a distinct monitor state with server-read date/class URL filters. Apply, browser Back and direct navigation preserve validated query state. Session times explicitly use the authorized branch timezone.
- SA-28 retains the real state-specific detail and reasoned cancellation. The tested session reloaded as `CANCELLED`, retained a `SCHEDULED → Canceled` immutable revision and remained available through `View cancellation`.
- The schedule, monitor and detail pages use the approved shared portal shell and only expose currently authorized routes and enabled modules.

## Verification and evidence

- Focused ESLint for the changed page, components and E2E contract — passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm build` — passed against Next.js 16.3.8.
- Focused production-browser interaction check — passed all four schedule steps, keyboard focus, date/class URL state, browser Back restoration, desktop/mobile overflow and rendered geometry.
- Development PostgreSQL-backed journey — scheduled one fictional 13:00–13:45 occurrence, canceled it with the documented reason, reloaded it, observed one immutable cancellation revision and found the canceled row in the monitor. No reset, deletion, real message or production resource was used.
- Existing Attendance PostgreSQL authorization, overlap, cancellation race/replay and retained-record tests were not repeated because the owner implementation did not change. Their recorded evidence remains in `docs/evidence/ex-10/README.md` and `docs/modules/attendance/CURRENT_STATE.md`.

Reference captures: `reference-sa-25-desktop.png`, `reference-sa-26-desktop.png`, `reference-sa-28-desktop.png`.

Final application captures: `application-sa-25-step-1-desktop.png`, `application-sa-25-step-1-mobile.png`, `application-sa-25-step-2-desktop.png`, `application-sa-25-confirm-desktop.png`, `application-sa-25-scheduled-confirmation-desktop.png`, `application-sa-26-monitor-desktop.png`, `application-sa-26-monitor-with-canceled-desktop.png`, `application-sa-28-scheduled-detail-desktop.png`, `application-sa-28-canceled-history-desktop.png`, and `application-sa-28-canceled-history-mobile.png`.

Measured evidence: `baseline-measurements.json`, `candidate-measurements.json`, and `persistence-result.json`.

## Declared deviations

- Prototype fictional schools, teachers and counts are replaced with authorized synthetic owner data.
- The production monitor is a list rather than the prototype's in-memory session picker; it exposes every real supported session state and routes to the owner detail without pretending to persist a prototype selection.
- Draft persistence is still unavailable, so `Save draft and leave` remains visibly disabled. No draft lifecycle was invented.
- Teacher selection is constrained to the dated primary assignment attached to the selected offering because the existing scheduling contract does not accept an arbitrary teacher override.
- The production cancellation detail shows real summary, retained records and immutable history together after confirmation. The reference's staged review is represented before the irreversible command; the persisted read-only result remains visible afterward.
- Nimbus Sans redistribution authority remains unresolved. No font asset was copied. Native VoiceOver/NVDA evidence remains outstanding.
