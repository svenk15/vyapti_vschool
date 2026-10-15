# EV-03 / STW-31 typed Student upcoming agenda evidence

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / DIRECT_COMPARISON_PARTIAL / HUMAN_REVIEW_PENDING

## Supported outcome

An exactly authorized Student opens School calendar and sees upcoming typed branch/class Events from the current school-local date. Each row shows the immutable category, effective schedule, frozen audience label, description or canceled status, and an independently authorized detail link.

The slice does not invent assessment dates, interest actions, venue fields, capacity or guardian consent. STW-31 remains partial for its Assessment-owned schedule projection.

## Reference and captures

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/flow/STW-31`
- Reference captures: `docs/evidence/events-calendar-2026-10-15/reference-student-desktop.png` and `reference-student-mobile.png`
- Live Student agenda: `student-calendar-chromium.png` and `student-calendar-mobile.png`
- The same journey also records its real Administrator publication and Parent regression states in this directory.

The screenshots were directly inspected at desktop and mobile sizes. The live page matches the approved Student shell, hierarchy, content width, typography scale, card/button treatment and responsive stacking. The approved workflow is a generic guided-review form; the live page is the operational agenda. That structural difference remains explicitly labelled and human acceptance is pending.

## Verification

- TypeScript/Next route types — PASS.
- Focused ESLint — PASS.
- PostgreSQL Events suite — PASS, 3/3, including exact Student From/category filtering.
- Desktop Chromium — PASS, 1/1, one worker.
- Mobile Chromium — PASS, 1/1, one worker.
- Documentation, extraction-boundary and portable-backend checks — PASS.
- Isolated E2E and final normal production builds — PASS.
- Migration state: unchanged at 62 applied migrations in development and test.

The existing non-failing `pg` concurrent-query deprecation warning appeared during browser setup. No assertion or authorization check was removed.

## Pending gates

- Assessment schedule owner/publication projection for the remaining STW-31 outcome.
- Human review of this slice.
- Portable font parity and native VoiceOver/NVDA evidence.
- TEN-03 enforcement/context proof and other production gates.
