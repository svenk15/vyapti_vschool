# UX-12 Student record detail checkpoint

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Base source: `3afe266` (`Align Learning directories with presentation recipe`).
- Corrected source: `b01a7a5`.
- Visual-capture build: `qte7IOUhCcq39_z-v_I7p`; final committed-source rebuild: `W4fweDwPT7U_tJ7747JKm`. Both used `NODE_OPTIONS=--max-old-space-size=4096`; application code was unchanged between them.
- Application route: `/admin/students/[id]` using the existing fictional M03 Student fixture.
- Exact approved references: `VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/student/s1` for the record composition and `#/flow/SA-20` for the identity-correction flow.
- Viewports: desktop `1440×1000`, mobile `390×844`, device pixel ratio 1. Captures use Playwright viewport emulation, not actual browser zoom.

## Corrected presentation

The former route stacked name correction, admission date, Parent access, Student access, enrollment history, placement actions and archive controls into one page. It measured 3,759 CSS pixels on desktop and 6,623 on mobile. The corrected default state follows the approved record recipe:

- Student name, admission/class summary and Back/Manage actions appear once in the page header.
- Overview, Enrollment, Family & access and Identity & status are stable URL-addressable sections.
- Overview uses a `2fr / minmax(300px,1fr)` desktop facts/action layout and a single-column mobile layout.
- Enrollment contains the immutable dated history plus existing enrollment and move flows.
- Family & access retains the existing Parent/guardian and Student portal purpose, invitation and revocation controls.
- Identity & status retains the staged SA-20 correction, admission-date verification and guarded archive action.
- Directory Manage, registration, enrollment and transfer handoffs target the appropriate section while retaining the validated directory return URL.

The approved prototype also shows Attendance and Documents tabs. This route currently exposes neither an authorized Student-record Attendance projection nor a Student-document destination. Those tabs are omitted as functional owner gaps; no placeholder action or inferred data was added.

## Visual inspection

`reference-student-record-desktop.png` and `reference-student-record-mobile.png` were compared directly with `application-after-overview-desktop.png` and `application-after-overview-mobile.png`. The result preserves the approved hierarchy, compact fact surface, right-side action rail, mobile linear order, visible selected tab and semantic status. Application Overview measures 1,000 CSS pixels on desktop and 1,393 on mobile with zero root overflow.

The dedicated section captures cover:

- `application-after-enrollment-{desktop,mobile}.png`
- `application-after-access-{desktop,mobile}.png`
- `application-after-identity-{desktop,mobile}.png`
- `reference-sa-20-{desktop,mobile}.png`

Enrollment retains a focusable bounded table scroller on mobile. Family/access is intentionally taller because it renders genuine current and historical access rows. Identity remains the approved staged owner workflow. The application and reference both resolve Inter; `after-metrics.json` records computed font, CSS viewport, DPR, height and overflow. Human visual acceptance remains pending.

## Verification

Passed on the working tree that produced the focused commit:

- `pnpm typecheck`
- focused ESLint for the changed Student page/components and affected browser specifications
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`
- `pnpm test:e2e test/e2e/students-directory-gaps.spec.ts --project=chromium --project=mobile --workers=1 --grep 'restores approved search/sort URL state and opens every implemented Manage destination'` — 2/2 passed
- `pnpm test:e2e test/e2e/students-registration.spec.ts --project=chromium --project=mobile --workers=1 --grep 'registers and searches a student|corrects an exclusive student name'` — 4/4 passed
- `pnpm test:e2e test/e2e/guardians.spec.ts test/e2e/student-portal.spec.ts --project=chromium --workers=1` — 2/2 passed

All browser journeys used the designated real PostgreSQL test database with 118 applied migrations. A sandboxed first attempt could not connect to local PostgreSQL and was not counted as a test result. One initial corrected-filter attempt selected no tests and is not counted as verification. The subsequent commands above are the actual passing evidence.

No backend rule, route-handler contract, authorization check, database schema, migration, seed or development row changed. Existing Parent/Student invitation delivery failure, exact identity, scoped revocation and replay behavior remained covered by the focused journeys.

## Remaining gates

UX-12 remains in progress for the remaining implemented M01–M08 detail/history route families. Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 restricted-role/RLS proof and production release remain pending.
