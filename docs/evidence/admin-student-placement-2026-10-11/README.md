# SA-19 Administrator student enrollment and placement

Engineering comparison captured 11 October 2026. Human visual acceptance remains **PENDING**.

## Authority and routes

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-19`.
- Embedded contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/workflows/SA-19.md` and `screens/SA-19-entry.md`.
- Production routes: `/admin/students/enroll` for scoped standalone selection and `/admin/students/[id]/enrollment` for the fixed-Student workflow reached from the directory or Student record.

## Implemented comparison

- Moved enrollment from the lower portion of the multi-purpose Student record to a dedicated authorized page matching the reference composition.
- Added Enrollment, Class placement, Review placement and Confirm states with the approved labels, action hierarchy, guidance cards and responsive layout.
- Supports both approved entry modes without broadening identity lookup: the standalone selector lists up to 100 active Students from the current authorized branch in deterministic name order, while directory/record entry fixes the already authorized Student. Larger branches continue through the paginated directory and its Manage action.
- Uses real open Academic years/classes, inclusive effective dates and optional text roll number.
- Step changes focus the new heading. Cancel returns to the validated internal Students URL. Draft remains visibly disabled because no accepted persistence/resume contract exists.
- The review acknowledgement gates the final confirmation. The existing Students command remains the only write path; authorization, branch/module checks, scoped transaction, replay, overlap/frozen-roster rules and inclusive-to-exclusive date conversion are unchanged.
- Success renders a persisted enrollment receipt with links to the directory and dated history. Deterministic conflicts link to the Student history or attendance-session monitor. An unavailable/unknown response retains the exact payload and idempotency key for safe replay before another request can start.

## Verification

- Focused ESLint and TypeScript checks passed.
- `pnpm test:e2e test/e2e/students-enrollment.spec.ts` passed 2/2 desktop/mobile against guarded real PostgreSQL `vyapti_vschool_test`; 38 migrations were current. It proves scoped standalone selection, fixed contextual entry, persistence/history, exact directory search, duplicate rejection and wrong-year section rejection.
- The final shared-receipt visual checkpoint passed 4/4 desktop/mobile across SA-18 and SA-19 after the receipt composition changed.
- The focused Playwright run performed a production build and captured entry/final review states at 1440 × 1000 and 390 × 844. The screenshots were visually inspected for hierarchy, spacing, wrapping and overflow.
- No schema, migration, seed, backend contract or development-database row changed.

## Evidence

- `reference-sa-19-entry-desktop.png`, `reference-sa-19-entry-mobile.png`
- `application-sa-19-entry-chromium.png`, `application-sa-19-entry-mobile.png`
- `application-sa-19-review-chromium.png`, `application-sa-19-review-mobile.png`
- `application-sa-19-receipt-chromium.png`, `application-sa-19-receipt-mobile.png`

## Remaining deviations

- Production uses the enabled route set and real account/school data, so prototype-only navigation, review banner and fictional identities are absent.
- The standalone selector is intentionally capped at the server-supported first 100 active Students; branches beyond that use the existing paginated/searchable directory before entering the same workflow. Draft persistence/resume remains unimplemented because its lifecycle contract is unresolved. Human comparison and acceptance are pending.
