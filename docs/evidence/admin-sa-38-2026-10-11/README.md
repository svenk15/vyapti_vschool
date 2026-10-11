# SA-38 Admissions application-start evidence

Captured 11 October 2026 from the approved Administrator reference `VSchool_School_Admin_Review.html#/flow/SA-38` and the production route `/admin/admissions` at 1440×1000 and 390×844 CSS-pixel viewports. Human review remains PENDING.

## Direct comparison

- `reference-applicant-chromium.png` / `application-applicant-chromium.png`
- `reference-applicant-mobile.png` / `application-applicant-mobile.png`
- `reference-confirm-chromium.png` / `application-confirm-chromium.png`
- `reference-confirm-mobile.png` / `application-confirm-mobile.png`

The images were directly inspected. The application now matches the approved three-stage hierarchy, 760px workflow and 352px guidance columns, 24px gap, field grid, exact helper/guidance copy, original confirmation labels, compact review composition, action placement and 40px desktop/44px mobile buttons. The real shell filters unavailable destinations and displays real scope/account data. The reference-only review banner and “Phase 3 design” label are not product UI. The application top bar names the active Admissions area rather than repeating the workflow title. Durable **Save draft and leave** remains disabled because SA-38 supplies no approved draft ownership, persistence, retention or resume contract. The previously documented body-font substitution, native VoiceOver/NVDA and human visual review remain pending.

## Verification

- Unit: `test/unit/admissions.test.ts` plus access policy, 15/15 passed.
- PostgreSQL: `pnpm test:functional test/functional/admissions.test.ts`, 3/3 passed on `vyapti_vschool_test`; 39 migrations. It proves live scope/release/module guards, exact replay, changed-input conflict, duplicate rollback and zero Person/Student writes.
- Browser: `pnpm test:e2e test/e2e/admissions.spec.ts`, 2/2 passed on desktop Chromium and mobile. It proves retained Back values, final-only creation, response-loss retry with the same intent key, a single Application/Applicant and no horizontal overflow.
- Repository: focused ESLint, `pnpm typecheck`, `pnpm check:docs`, `pnpm check:db-design`, `pnpm check:boundaries`, `pnpm check:backend` passed. The E2E gate also completed the production build.
- Development: migration `20261011170000_admissions_inquiry_application` applied forward to `vyapti_vschool`; `pnpm demo:seed` completed the required SA-38 seed without replacing existing records. Stale TEN-02, ACA-01 and BRD-02 artifact refreshes were reported and preserved rather than treated as refreshed evidence.

## Remaining gates

TEN-03 restricted-role RLS/context proof, production retention policy, native accessibility, the accepted font decision and human review remain incomplete. Admissions was activated only for the existing fictional local demo branch; no existing real-client branch was changed.
