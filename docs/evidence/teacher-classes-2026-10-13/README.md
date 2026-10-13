# Teacher assigned classes and minimal roster — 13 October 2026

## Scope and authority

- Workflows: TEA-07 assigned classes and TEA-08 minimal dated roster.
- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html`, states `#/classes` and `#/classes/c1`.
- Implementation specification: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/`, especially `COMPONENTS.md`, `TYPOGRAPHY.md`, and the ordered Teacher source CSS.
- Parent source: `f69325f0497897338ec32279c614e77b418c18be` (verified TT-06 Teacher projection). The executable checkpoint commit is reported in the handover after this evidence is committed.

## Implemented behavior

`/teacher/classes` lists only dated offerings assigned through the signed-in account's current Person, active Employee and active Teacher identity. Search attribute, text, academic-year filter, sort field and order are URL-backed. The shell shows **My classes** only after the same protected read succeeds; a hidden item is not used as endpoint authorization.

`/teacher/classes/[id]` reauthorizes the requested offering and obtains its roster through a Students-owned port within the same repeatable-read transaction. It returns at most 200 effective pupils and only Student ID, display name, branch school reference and roll number. Foreign offerings/branches, revoked membership and an ended assignment disclose no roster. No mutation, lock, table or migration was added.

TEA-08 is engineering verified. TEA-07 remains partial because the approved class detail includes an Attendance-owned assigned-session/history projection. The current page links to the authorized teaching-day view and does not fabricate that projection.

## Verification evidence

- Focused ESLint and `tsc --noEmit`: passed.
- Focused unit: 2/2 passed for Teacher timetable/classes application validation.
- Real PostgreSQL: `test/functional/timetable-reconciliation.test.ts` passed 6/6 against `vyapti_vschool_test`, with all 46 migrations applied and none pending. It covers the assigned roster, exact minimal DTO, foreign offering, foreign branch and revoked membership.
- Playwright, one worker and sequential projects: the dedicated assigned-classes journey passed 1/1 Chromium desktop and 1/1 mobile. It covers navigation eligibility, populated counts, Enter-committed search, Sort drawer and URL state, class selection, minimal roster, assignment boundary denial, keyboard-operable controls and no viewport overflow.
- `pnpm check` passed: lint, generated route types/TypeScript, documentation, 63-table database design, boundaries, portable backend compile and 144/144 unit tests.
- Production build `ZlV-HWEWs9Vlm_sDN617N` and the dedicated `.next-e2e` build passed.

The first Playwright diagnostic accidentally included the full-suite separator and was interrupted immediately when it enumerated 128 tests. A later stale `.next-e2e` build explained the initially missing navigation item. The final focused runs rebuilt that target from current source. Neither interrupted diagnostic is represented as passed evidence.

## Direct visual comparison

- Approved directory, desktop: `reference-chromium.png`
- Application directory, desktop: `application-directory-chromium.png`
- Approved class detail, mobile: `reference-mobile.png`
- Application class detail, mobile: `application-detail-mobile.png`
- Additional application states: `application-directory-mobile.png` and `application-detail-chromium.png`

The compared directory uses the measured combined search composition, Filter and Sort buttons/drawers, three class cards, 22px card padding, book SVG, status badge, divider and outlined action. The mobile detail uses padded cards, the compact three-column roster, definition-list context and visible return path.

Remaining visual/contract differences are explicit: the application retains the TEA-08 roster-date control; the reference body shows an assigned-session card and Session history tab that depend on the unfinished Attendance history projection; institution/branch names are real synthetic fixture values; reference review chrome is prototype-only; and the previously documented font-portability deviation remains. These are not recorded as accepted visual deviations.

## Pending gates

Human review is PENDING. Native VoiceOver/NVDA checks, actual browser 200% zoom, font portability, TEN-03 restricted-role/RLS proof, provider review and other production-release gates remain pending.
