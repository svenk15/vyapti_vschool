# Principal navigation regrouping evidence

## Outcome

The Principal shell implements the approved two-level navigation hierarchy while preserving all routed workflows and their server authorization. My day remains direct. Attendance, Teaching & staff, Communication, My work, and Reports & insights are single-open disclosure groups. Finance, Facilities and Restricted support remain independently conditional. Account, acting access and staged sign-out remain utilities.

Timetable & cover, Learning and Assessments open their first currently authorized destination and render independently authorized contextual tabs on the real pages. Narrow owner availability operations determine child visibility without loading protected queues or records. Navigation visibility remains separate from destination authorization.

Human visual acceptance remains **PENDING**.

## Visual comparison

Baseline captures from the flat Principal catalogue:

- `docs/execution/principal-navigation-current/desktop-sidebar.png`
- `docs/execution/principal-navigation-current/desktop-sidebar-lower.png`
- `docs/execution/principal-navigation-current/mobile-navigation.png`
- `docs/execution/principal-navigation-current/mobile-navigation-lower.png`

Implemented captures:

- [Desktop, Learning feedback with Teaching & staff open](after-desktop.png)
- [Mobile, My day with Attendance expanded](after-mobile.png)

The images were directly inspected for group order, hierarchy, active state, spacing, disclosure affordance, conditional areas, utilities and viewport overflow. The existing VSchool theme and typography were retained. No separate UX Studio redesign was applied.

## Verification

- Focused unit: full and restricted catalogues, empty-group removal, independently authorized Cover and Assessments alternatives, and most-specific segment-aware route ownership.
- Focused real PostgreSQL: 42/42 tests across Timetable Cover, Learning publication, Attendance pupil review, Attendance explanations, Attendance correction requests, Requests, Assessments readiness and Assessments publication.
- Architecture: `pnpm check:backend` and `pnpm check:boundaries` passed.
- TypeScript: `pnpm exec tsc --noEmit --pretty false` passed.
- Production browser: seeded full Principal, one-open disclosure, direct entry, exactly one active link, collapse on current route, Back/Forward restoration, contextual tabs, `/leadership/account`, staged sign-out, representative Administrator shell, mobile first-focus, expansion without drawer dismissal, Escape dismissal/focus return and no desktop/mobile overflow. Machine-readable observations: [browser-results.json](browser-results.json).
- Final production build `jCObsKqoFwjNr2pibKzUn` passed with a 4 GiB Node heap and is served at `http://127.0.0.1:3400`. The post-build browser observation was recorded at `2026-10-18T03:47:55.297Z`.

The restricted persona is exercised through the pure declarative catalogue tests so the test does not need protected-record downloads or a second seeded identity. Destination functional/security evidence remains owned by the existing module suites.

## Data and release state

No database schema, migration, fixture or seed changed. Native VoiceOver/NVDA, real-browser 200% zoom, font portability, TEN-03 and production release gates remain pending.
