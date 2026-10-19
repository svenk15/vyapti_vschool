# UX-16 integrated M01–M08 presentation regression

Status: engineering-verified for the implemented synthetic M01–M08 scope; human acceptance and production gates remain pending.

## Provenance

- Application source: `784c5b9` (`Complete shared workspace landing compositions`).
- Executable build: `KHDj7BWHk8qO5UYriOnkC`, served at `http://127.0.0.1:3400`.
- Database: designated development database and existing fictional `pnpm demo:seed` scenario; no migration or seed mutation was performed in this checkpoint.
- Detailed current-source observations: `persona-verification.json`. It contains routes and synthetic identifiers, but no credentials, tokens, cookies or session state.

## Current-source checks

The sequential one-browser-worker persona check passed all 11 protected/public entry states at 1440×1000 and 390×844. It verified Inter, no root overflow, desktop navigation scroll/footer geometry, mobile drawer focus and focus return, selected Parent/Student contexts and the shared landing layout. The first route-expanded run exposed an asynchronous verifier assertion: focus returns after the drawer close transition. The verifier now waits for the established focus return and the unchanged application passed.

At the desktop checkpoint it also opened these authorized current-source destinations and required an HTTP 200 response, a real page heading, retained workspace access and no `SERVICE_UNAVAILABLE` result:

- M02/M03/M05 Administrator: Academics, Students and Communication.
- M04/M06/M07 Teacher: My teaching day plus Teaching & learning and Enter marks.
- M04/M07/M08 Principal: current Attendance landing plus Assessment and report readiness and Operational follow-ups.
- M03/M04/M06/M07 Parent: Attendance, Learning, Results and timetable for the selected accepted child.
- M03/M04/M06/M07 Student: Assignments, timetable, Attendance and results for the selected accepted Student context.

The current landing screenshots are in [`../ux-revamp-17-landings-2026-10-19/personas/`](../ux-revamp-17-landings-2026-10-19/personas/). Exact workflow-state and owner-security evidence remains in `docs/execution/MUST_HAVE_RELEASE/acceptance-review/COVERAGE.md`; application/domain code for those commands did not change in UX-16, so its PostgreSQL, replay, revocation and transaction evidence is reused rather than rerun.

## Classification

- M01–M08 presentation entry and connected navigation: verified for current source.
- Exact reference comparisons and shared-pattern reviews: retained from UX-06–UX-15 and supplemented by the UX-17 five-workspace landing captures.
- Browser institution creation theme selection: still blocked by the missing authenticated platform-operator browser contract in UX-15; it is outside the M01–M08 protected journey regression.
- Native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, production providers/scanner/storage policies, human acceptance and production release: pending.
