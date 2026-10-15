# EV-01 one-off Calendar/Events evidence

## Scope and authority

EV-01 is the bounded Calendar/Events slice authorized by the 15 October 2026 Parent/Student programme. It delivers an explicitly designated branch publisher, one-off all-day or timed events, branch/class frozen audiences, immutable published versions, cancellation visibility and independent Parent/Student calendar purposes. It does not claim full PAR-18 or STW-31 completion.

Approved references opened unchanged:

- Parent: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/flow/PAR-18`
- Student: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/flow/STW-31`
- Administrator publisher: no exact reference state exists; the screen is a narrow design extension using the approved shared staged-form, directory, shell and responsive recipes.

## Functional/security evidence

- `pnpm test:functional test/functional/events-calendar.test.ts` — PASS, 3/3 against `vyapti_vschool_test`. It verifies exact recipient provenance, replay, later-grant non-retroactivity, versioned revision, cancellation retention, stale handling, live purpose revocation, cross-school/cross-child denial, concurrent update serialization and revoked publisher denial.
- `pnpm test:e2e test/e2e/events-calendar.spec.ts --project=chromium` — PASS at 1440×1000 with one worker.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/events-calendar.spec.ts --project=mobile` — PASS at 390×844 with one worker.
- `pnpm check:db-design`, `pnpm check:boundaries`, `pnpm check:backend`, `pnpm check:docs`, `pnpm lint` and `pnpm build` — PASS on the final application source prepared for the EV-01 checkpoint. The documentation check is repeated after the final evidence-only update.
- The first E2E attempt used the normal `.next` build while the harness serves `.next-e2e` and therefore returned a stale-route 404. The isolated E2E build was then produced and both projects passed. This harness failure is not counted as application evidence.

## Visual comparison

Reference captures are `reference-{parent,student}-{desktop,mobile}.png`; application captures are `{admin-compose,admin-published,parent-calendar,student-calendar}-{chromium,mobile}.png`. `reference-capture.json` records the reference viewport and overflow observations. All final images were opened and directly inspected.

The application follows the existing portal shell, role context, title hierarchy, cards, actions, status treatment and mobile navigation. Direct inspection found an initially cramped administrator directory row; EV-01 now gives the event, date, audience, status and action stable columns on desktop and a labeled card composition on mobile.

The approved Parent screen is a broader date/category agenda workflow, while the EV-01 Parent page lists real frozen-audience events. The approved Student screen combines events with assessments and prototype interest language, while EV-01 exposes published events only. Those are recorded remaining workflow gaps, not accepted full-fidelity deviations. The documented body-font portability exception remains. Native VoiceOver/NVDA and actual browser zoom were not performed.

## Demo fixture

`pnpm demo:seed` calls `scripts/demo-events.ts`. Repeated runs preserve the same private idempotency keys and existing event identifiers, add no duplicates, and do not overwrite manually created records. The private scenario metadata is stored in ignored `artifacts/events-01/private-demo.json`; credentials remain in the existing ignored persona files.

The integrated seed run completed the Calendar scenario. Independent legacy TEN-02, ACA-01 and BRD-02 refresh steps emitted preservation warnings and continued; no existing data was reset or overwritten, and those refreshes are not claimed as successful evidence for EV-01.

Human acceptance: **PENDING**. TEN-03, native accessibility, font portability and production readiness remain separate gates.
