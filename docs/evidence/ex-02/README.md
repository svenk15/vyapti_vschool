# EX-02 shared portal navigation evidence

Implementation completed 9 October 2026 from baseline `b0f9288`. The focused commit containing this record is the executable checkpoint; human review is PENDING.

## Demo outcome

Administrator and teacher routes now share one production shell. Desktop keeps a 248px theme-aware dark sidebar with grouped authorized links, consistent outline icons, selected/focus states, an account identity link and a separate real sign-out. Mobile uses the same navigation as a collapsible drawer with a backdrop, initial link focus, Tab/Shift+Tab containment, Escape/close recovery and trigger-focus return. The branch switcher remains in a compact sticky header.

The administrator wrapper still receives server-filtered groups. The teacher wrapper supplies only the implemented teaching-day destination. No prototype route, role, count or business result was added. The module-eligibility memo now keys both module and capability; its unit test proves that a permitted `student.read` result cannot be reused for `student.manage`.

No owner use case, API contract, table, migration, transaction, seed record or database row changed. The root TypeScript compiler now excludes only the immutable execution-pack `engineering/source-reference` snapshot, which had otherwise been mistaken for live source after EX-00.

## Verification executed

- `pnpm check`: passed lint, typecheck, documentation, 51-table database design, boundaries, backend compilation and 105 unit tests. The unit report includes the new capability-aware memoization case.
- `pnpm test:e2e test/e2e/access.spec.ts`: 12/12 passed across desktop and 390px mobile using `vyapti_vschool_test`; it covered signed-out redirects, real sign-in, current/foreign scope, grouped navigation, sign-out, generic credential failure, CSRF, token-version revocation and membership suspension. Its build and all 31 migrations passed before the run.
- `pnpm test:e2e test/e2e/attendance-sessions.spec.ts --project=mobile`: the first run found two buttons with the same “Close navigation” accessible name. The drawer-close name was made distinct; the required rerun passed 1/1. The journey used real PostgreSQL for administrator scheduling, teacher navigation, frozen roster submission/recovery, cross-teacher denial, report/export, correction, cancellation and audit authorization.
- A focused Playwright pass against `http://127.0.0.1:3400` verified administrator and teacher desktop/mobile shells, identity/footer reachability, absence of administrator navigation for the teacher, focus containment/return and no desktop page overflow. [Machine observation](browser-observation.json).
- The four screenshots in this directory were inspected. The shared hierarchy, sidebar proportion, selected/focus state, footer placement and mobile overlay are aligned and readable. The teacher capture honestly shows the current schedule-unavailable state on 9 October; it does not fabricate sessions.

The repository in-app browser launcher still points to a missing runtime module, so repository Playwright produced the browser evidence. Native VoiceOver, NVDA and native 200% zoom remain outstanding DS-02 gates. TEN-03 remains incomplete and blocks production/real-client data.

## Manual demo

Entry URL: `http://127.0.0.1:3400/sign-in`. Private fictional credentials remain in ignored `artifacts/iam-01/private-demo.json` for the administrator and `artifacts/people-02/private-demo.json` for the teacher. Do not copy their values into evidence or source control.

1. Sign in as the administrator. Expect the dark grouped sidebar, only authorized destinations, the current institution/branch in the header, and the account/sign-out footer.
2. Narrow the browser below 760px, open navigation, press Tab/Shift+Tab and Escape. Expect focus to remain in the drawer and return to the menu trigger; reopen it and follow School settings.
3. Open the administrator account link, return, then sign out from the distinct footer action. Expect `/sign-in`; revisiting `/admin` redirects to sign-in.
4. Sign in as the teacher and open My teaching day. Expect only Teaching navigation, no administrator groups, and the same identity/sign-out behavior. The current 9 October fixture may show Schedule unavailable; the preserved populated demo date is documented separately in Attendance evidence.

Known limitation: the shell uses the available role label and school name because `AdminHome` has no verified personal display-name projection. The account link is truthful and reachable; no name was inferred from contact email or prototype data.
