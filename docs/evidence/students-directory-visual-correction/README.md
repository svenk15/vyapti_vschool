# Students directory visual correction

Captured and visually inspected on 10 October 2026. Executable source: `d1b69ebcc458e7410f92059387d54e7754d6e413` on `work/stu-01-after-per02-wip`. Human visual acceptance remains **PENDING** after the prior comparison was explicitly rejected.

## Exact comparison

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/students`, opened unchanged. Its directory and Sort states match the supplied approved screenshots. The prototype review banner is excluded from the product layout.
- Application: `/admin/students`, using authorized PostgreSQL-backed Student, Enrollment and effective SectionPlacement data.
- Viewports: 1440 × 1000 and 390 × 844 CSS pixels at browser zoom 100%.

| State | Approved reference | Corrected application |
|---|---|---|
| Directory desktop | [reference](reference-directory-chromium.png) | [application](application-directory-chromium.png) |
| Directory mobile | [reference](reference-directory-mobile.png) | [application](application-directory-mobile.png) |
| Sort desktop | [reference](reference-sort-chromium.png) | [application](application-sort-chromium.png) |
| Sort mobile | [reference](reference-sort-mobile.png) | [application](application-sort-mobile.png) |
| Manage desktop | Existing accepted interaction state | [application](application-manage-chromium.png) |
| Manage mobile | Existing accepted interaction state | [application](application-manage-mobile.png) |

## Corrected mismatches

- Sort now uses the reference-width full-height flex drawer with a fixed header, scrollable body, inset dividers, right chevrons, compact radios, unblurred dim backdrop and bottom footer. Its explanatory text remains available only to assistive technology.
- Search, Filter and Sort use the reference proportions, shared control height and icons. The visible Sort summary was removed while its applied value remains an accessible description and in the drawer.
- Register student includes the reference plus icon. Table columns, padding, separators, avatar hierarchy, pill statuses and Manage icon/alignment now follow the reference at desktop and mobile sizes.
- The **Class** column is no longer a relabelled academic year. A single scoped page query projects the effective Grade/Section as of school-local today through the existing half-open Enrollment and SectionPlacement contracts. `Not enrolled` and `No current class` remain distinct.
- The shared shell now shows authorized institution/school identity below the brand and the active route name in the top bar. Existing server-filtered routes remain available.

## Remaining differences

- The approved prototype says `Reference`; the accepted directory contract names the real field `Admission number`.
- The prototype supplies a fictional personal name and academic-year header. `AdminHome` currently exposes account ID, role capabilities and school context, but no authorized account display name or current AcademicYear projection. The application therefore shows the honest role/school identity and omits an invented year.
- The enhanced server-filtered navigation contains additional implemented routes. No authorized capability was removed to imitate the screenshot.
- Drafts, guardian linking and broader lifecycle operations remain separately tracked functional gaps. This correction does not accept or complete them.

## Verification

- `pnpm check` passed all lint, generated type, documentation, database-design, boundary and backend gates plus 128/128 unit tests.
- `pnpm test:functional test/functional/students-registration.test.ts` passed 14/14 against `vyapti_vschool_test` with 38 applied migrations and none pending. It covers current placement, future placement without a current class, Academic-module hiding and the existing query/security cases.
- Final `pnpm test:e2e test/e2e/students-directory-gaps.spec.ts` passed 2/2 desktop/mobile and its production build passed. It verifies search/URL history, Sort Apply/Cancel/Escape/focus restoration, Manage destinations and the Class column while producing the corrected captures.
- No schema, migration, seed or development-database row changed.
