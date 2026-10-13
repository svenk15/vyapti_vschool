# TEA-04 Teacher self-account evidence

Engineering status: IMPLEMENTED_AND_VERIFIED. Human review: PENDING.

## Contract and source

- Approved state: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html#/flow/TEA-04`.
- Application routes: `/account` and `/account/review`.
- Access owns the current account and authorized memberships. `lib/server` decodes only current JWT timing. No People, salary, guardian, administrator record or other-session inventory is joined.
- No schema or migration changed. All 46 test migrations were current.
- Overnight window was resumed at approximately 10:45 IST on 13 October 2026; the requested six-hour handover target is approximately 16:45 IST. This checkpoint completed before opening another large slice.

## Verification

- `pnpm exec vitest run test/unit/access.test.ts --reporter=default`: 9/9 passed.
- `pnpm test:functional test/functional/access.test.ts`: 9/9 passed against `vyapti_vschool_test`, including safe self fields and stale-token denial.
- Focused Playwright with one worker: Chromium 1/1 and mobile 1/1 passed sequentially after a fresh isolated build. It covers all three safe views, authorized-only branches, exact eight-hour session duration, Back/Continue retention, focus, administrator handoff, password-recovery routing, current-session sign-out and responsive containment.
- `pnpm check` passed all documentation, database-design, boundary, backend, lint/type and 147/147 unit gates. `pnpm build` passed with build ID `rOPwhl__T18pzWgo9khZI` and includes `/account/review`.

The first browser run reused an old `.next-e2e` build and returned 404; it is not passing evidence. After a fresh isolated build, the first application run exposed a 30-day JWT default despite the intended eight-hour session policy. The final source explicitly configures both lifetimes, and the browser test asserts the eight-hour issued-to-expiry interval.

## Visual comparison

- `reference-details-chromium.png`, `reference-details-mobile.png`
- `reference-confirm-chromium.png`, `reference-confirm-mobile.png`
- `application-details-chromium.png`, `application-details-mobile.png`
- `application-confirm-chromium.png`, `application-confirm-mobile.png`

The reference and application were directly inspected at 1440×1000 and 390×844. Stage order, labels, stepper, cards, actions, two-column/stacked behavior and confirmation composition match the approved flow. The application adds live safe details beneath the selected view because the approved outcome requires the Teacher to understand the account/session; the fictional prototype only echoes its select value. Enabled My timetable navigation is retained because it is a real authorized capability. The existing font-portability deviation remains.

## Demo walkthrough

Use the ignored Teacher credentials in `artifacts/people-02/private-demo.json`; never print their values. Open `/account`, choose **Account help**, then review Account details, Authorized branches and Session information. Continue, choose a permitted action, use Back to verify state retention, and confirm. Password recovery opens the existing recovery route; contact guidance performs no write or message; sign-out ends the current browser session.

Native VoiceOver/NVDA, human visual acceptance and TEN-03 remain pending release gates.
