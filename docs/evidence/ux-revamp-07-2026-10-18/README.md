# UX-07 cross-workspace presentation evidence

Date: 18 October 2026 (Asia/Kolkata)

Implementation source: `21f3a805f5e882be29c39989b13bd0311af9779a`

Isolated E2E build ID: `ac6dW5CgZ3zgI80yzsZH6`

## Outcome

Teacher content now uses the approved 1120px task workspace while Principal, Parent/Guardian and Student pages use the shared 1440px protected composition. Parent and Student frames consume semantic theme values, share the 64px responsive shell geometry, retain their authorized context ribbons and keep their permission-filtered bottom navigation. Both mobile drawers are modal, lock background scroll, trap focus, close with Escape/backdrop activation and return focus to the opening control. Student mobile navigation now provides a **More** control so permission-filtered destinations hidden from the bottom row remain reachable.

The direct visual pass found a clipped Parent **Current child** label at 390px. The final mobile context composition gives the native select sufficient width without hiding the child identity; the corrected image below was inspected after its final passing run.

No business use case, route, authorization rule, persistence contract, schema, migration or seed changed. The browser journeys continued to prove live owner authorization, exact permitted contexts and revocation behavior through the existing gateways.

## Approved sources and comparison classification

- Student source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html`. The My day body and shell are a direct equivalent-state comparison; fictional counts and unavailable later capabilities are not copied.
- Parent source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html`. The child timetable body, context selector and shell are a direct equivalent-state comparison. The application renders the effective six-day publication supplied by the owner rather than prototype sample lessons.
- Teacher source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html`. The supplied Today image is used as a shared shell/type/control pattern review for the current timetable capture; it is not labelled an exact same-page match.
- Principal source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`. Its activity catalogue is a workflow explorer, so the comparison is labelled a shared pattern review rather than an exact dashboard match.

## Directly inspected captures

| Workspace | Approved/pattern | Current desktop | Current mobile |
|---|---|---|---|
| Student | [approved My day](student-reference-desktop.png) | [application](student-application-desktop.png) | [application](student-application-mobile.png) |
| Parent/Guardian | [approved timetable](parent-reference-desktop.png) | [application](parent-application-desktop.png) | [application](parent-application-mobile.png) |
| Teacher | [approved shell/task pattern](teacher-reference-pattern-desktop.png) | [application timetable](teacher-application-desktop.png) | [application timetable](teacher-application-mobile.png) |
| Principal | [approved workflow pattern](principal-reference-pattern-desktop.png) | [application dashboard](principal-application-desktop.png) | [application dashboard](principal-application-mobile.png) |

The final captures were inspected for shell/content width, heading hierarchy, card and table spacing, context visibility, selected navigation, clipping, root overflow, mobile bottom-navigation coverage and primary-action placement. The Parent selector defect was corrected before this record. Different real session counts, authorized destinations and owner-backed empty states are data/contract differences rather than visual defects.

## Verification

- `pnpm exec eslint app/globals.css components/family-portal-frame.tsx components/student-portal-frame.tsx test/e2e/principal-foundation.spec.ts`: exit 0; CSS is outside the ESLint file matcher and was visually/browser verified.
- `pnpm typecheck`: passed.
- `pnpm check:boundaries`: passed.
- `pnpm check:backend`: passed.
- Student Playwright, Chromium and mobile separately, one worker: 1/1 each passed. It covers Student activation, authorized context switching, stale-context clearing, per-context revocation, timetable/attendance navigation, mobile More drawer focus and Escape focus return.
- Parent/Guardian Playwright, Chromium and final mobile separately, one worker: 1/1 each passed. It covers invitation/activation, permitted child data, timetable, account/sign-out, delivery-failure handling, revocation, mobile drawer focus and the corrected context selector.
- Teacher timetable Playwright, Chromium and mobile separately, one worker: 1/1 each passed in the batched workspace runs. It covers the published owner projection, effective extra teaching day, break/unassigned periods, trusted register link and absence of planning authority.
- Principal foundation Playwright, Chromium and mobile separately, one worker: 1/1 each passed after reconciling two stale assertions with already-approved copy and modal drawer semantics. It covers workspace selection, scoped context switching, immediate revocation, mobile Escape/focus return and overflow.
- The final focused browser build used the established 4 GiB Node heap and real `vyapti_vschool_test` PostgreSQL database. All 118 forward migrations were already applied.

The first Student command used Node's default 2 GiB heap and stopped in the web-server build before tests; it was rerun with the established 4 GiB setting. Initial Principal checks exposed stale expected copy (`not released` versus the current user-facing `unavailable`) and the old complementary role versus the shared modal-dialog contract; the assertions were corrected and both viewports passed. These runs did not expose a business or authorization failure.

## Remaining gates

Human visual acceptance is PENDING. Native VoiceOver/NVDA, actual browser 200% zoom, font portability, TEN-03 restricted-role/RLS proof and production release remain pending. No production-readiness claim is made.
