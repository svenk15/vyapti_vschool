# SA-19 Administrator student enrollment and placement

Engineering comparison captured 11 October 2026. Human visual acceptance remains **PENDING**.

## Authority and routes

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-19`.
- Embedded contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/workflows/SA-19.md` and `screens/SA-19-entry.md`.
- Production route: `/admin/students/[id]/enrollment`, reached from the Students Manage dialog and Student record.

## Implemented comparison

- Moved enrollment from the lower portion of the multi-purpose Student record to a dedicated authorized page matching the reference composition.
- Added Enrollment, Class placement, Review placement and Confirm states with the approved labels, action hierarchy, guidance cards and responsive layout.
- Uses the currently authorized Student selected in the directory/record entry path, real open Academic years/classes, inclusive effective dates and optional text roll number.
- Step changes focus the new heading. Cancel returns to the validated internal Students URL. Draft remains visibly disabled because no accepted persistence/resume contract exists.
- The review acknowledgement gates the final confirmation. The existing Students command remains the only write path; authorization, branch/module checks, scoped transaction, replay, overlap/frozen-roster rules and inclusive-to-exclusive date conversion are unchanged.

## Verification

- Focused ESLint and TypeScript checks passed.
- `pnpm test:e2e test/e2e/students-enrollment.spec.ts` passed 2/2 desktop/mobile against guarded real PostgreSQL `vyapti_vschool_test`; 38 migrations were current. It proves persistence/history, exact directory search, duplicate rejection and wrong-year section rejection.
- The focused Playwright run performed a production build and captured entry/final review states at 1440 × 1000 and 390 × 844. The screenshots were visually inspected for hierarchy, spacing, wrapping and overflow.
- No schema, migration, seed, backend contract or development-database row changed.

## Evidence

- `reference-sa-19-entry-desktop.png`, `reference-sa-19-entry-mobile.png`
- `application-sa-19-entry-chromium.png`, `application-sa-19-entry-mobile.png`
- `application-sa-19-review-chromium.png`, `application-sa-19-review-mobile.png`

## Remaining deviations

- The approved fictional review can choose any prototype Student in step 1. Production enters from an already authorized real Student and renders that choice disabled, avoiding a second identity-search contract inside the mutation workflow.
- Production uses the enabled route set and real account/school data, so prototype-only navigation, review banner and fictional identities are absent.
- A conflict is reported without a partial write, but the generic reference’s dedicated recovery link/receipt composition is not yet implemented. Existing retry/history recovery remains available. Human comparison and acceptance are pending.
