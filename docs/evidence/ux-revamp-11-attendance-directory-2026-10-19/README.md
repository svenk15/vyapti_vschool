# UX-11 Administrator Attendance directory

Date: 19 October 2026 (Asia/Kolkata)

## Scope and authority

- Application route: `/admin/attendance/sessions?view=monitor`.
- Exact approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/attendance`.
- Screen contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/module-attendance.md`.
- Candidate source: focused commit containing this record, based on `c8658d6`.
- Production build ID: `3GSSQ2ciukY0XWp2I-MGec`.
- Schema/migrations: unchanged; development and test retain 118 applied migrations.

## Implemented composition

The monitor now uses the approved Attendance module hierarchy: one `Attendance` page heading, one primary `Schedule session` action, Sessions/Attendance reports/Absence explanations tabs, a compact URL-backed school-date/class toolbar, and a semantic session table. The mobile table becomes labelled cards with readable subject, time, class, status and one state-specific action. Existing scheduling, review, correction and cancellation destinations and all server authorization remain unchanged.

The real owner projection exposes date and class filters and one bounded result set. It does not expose subject search, server sort, summary denominators or pagination. Those prototype controls and summary cards were not simulated client-side and remain explicit owner-query gaps. The teacher field is also absent from the session record and is omitted rather than invented.

## Direct comparison

| Capture | State |
|---|---|
| `reference-desktop.png` | Exact approved `#/attendance` reference, 1440px CSS viewport |
| `reference-mobile.png` | Exact approved reference, 390px CSS viewport; prototype responsive state |
| `application-before-desktop.png` | Previous application list composition, 1440×1000 |
| `application-before-mobile.png` | Previous application mobile composition, 390×844 |
| `application-after-desktop.png` | Corrected current application, populated synthetic session, 1440×1000 |
| `application-after-mobile.png` | Corrected current application, populated synthetic session, 390×844 |

The first corrected mobile capture exposed a cascade-order defect that constrained the subject header to the desktop 28% width. The final capture follows the mobile card geometry and keeps `Mathematics Demo` readable. Horizontal tabs remain keyboard reachable and scroll when the labels exceed the mobile width.

## Verification

- Focused ESLint for the changed page, component and journey: PASS.
- TypeScript: PASS.
- `pnpm test:e2e test/e2e/attendance-sessions.spec.ts --project=chromium --workers=1`: PASS (1/1, real PostgreSQL test database; recorded before the final CSS-only mobile width correction).
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/attendance-sessions.spec.ts --project=mobile --workers=1`: PASS (1/1, real PostgreSQL test database, 118 migrations). Two stale test assertions were aligned to the approved 24px mobile page-title token after they correctly measured 24px; application typography was unchanged.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: PASS after the final CSS correction; build ID `3GSSQ2ciukY0XWp2I-MGec`.
- Final desktop/mobile screenshots were inspected directly for heading/action hierarchy, tab placement, control alignment, row density, readable mobile labels, root overflow and state-action clarity.

Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production release remain PENDING.
