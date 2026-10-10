# Students embedded-spec visual checkpoint

Captured and inspected on 10 October 2026. Executable source: `8bf3dc9`. Human visual acceptance remains **PENDING**.

## Source identity

- Approved screen: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/students` in normal, populated and Sort-open states.
- Application: `/admin/students` with authorized PostgreSQL-backed data.
- Administrator source SHA-256: `c3d9b82941491abd83f7eff935ec099b310459d26da28a1be3dbedc317588d17`.
- The HTML SHA-256 and workflow-catalog count for every manifest workspace were recalculated. All six HTML files matched `SOURCE_MANIFEST.json`; all counts matched: Operator 18, Student 47, School Administrator 63, Parent/Guardian 52, Teacher 42 and Principal 46. No edition mismatch was found and no reference file was overwritten.
- Ordered visual source: `implementation-spec/sources/VSchool_School_Admin_Design/style-00.css`, then `style-01.css`; implementation contracts: `TYPOGRAPHY.md`, `COMPONENTS.md` and `administrator/STUDENTS.md`.

## Compared evidence

| State | Approved reference | Before | Corrected application |
|---|---|---|---|
| Directory desktop | [reference](reference-directory-desktop.png) | — | [after](application-directory-after-chromium.png) |
| Directory mobile | [reference](reference-directory-mobile.png) | — | [after](application-directory-after-mobile.png) |
| Sort desktop | [reference](reference-sort-desktop.png) | [before](application-sort-before-desktop.png) | [after](application-sort-after-chromium.png) |
| Sort mobile | [reference](reference-sort-mobile.png) | — | [after](application-sort-after-mobile.png) |
| Manage desktop/mobile | — | — | [desktop](application-manage-after-chromium.png) / [mobile](application-manage-after-mobile.png) |

[Measured corrected geometry and rendered fonts](after-metrics.json) records the actual macOS Chromium result. The Students heading, names and Sort title render with `.SF NS` through the approved body stack. The unchanged enhanced sidebar renders Arial; the extracted reference navigation font was not bundled because the specification records no redistribution licence.

## Corrections

- Scoped the Students page and Sort drawer to the approved body declaration. The heading is 28px/650/35px and table content is 13px; this replaces the inherited Arial 30px/14px result.
- Matched desktop table density: 12px header text with 13px × 18px padding and 44px height; 13px cells with 17px × 18px padding and 75.5px rows; 11px status badges and 12px row actions.
- Matched the Sort panel at 420 × 1000 CSS pixels, 85px header, measured disclosure/option spacing, fixed bottom actions and an unblurred backdrop. Mobile is the measured 356px-wide panel at 390px viewport.
- Restored the approved visible sort label **Reference** while retaining the implemented `admissionNumber` query field. Sorting remains server-side over the complete authorized result set with deterministic pagination.
- Kept Cancel/Escape draft discard, Apply URL state, Back/Forward restoration, keyboard focus return, branch scope and current server authorization intact.

## Remaining deviations

- **My drafts remains an implementation gap.** Ownership, durable persistence, validation, retention, conflict and resume rules are not accepted. No fake zero-count tab was added.
- The approved enhanced production sidebar is 248px and contains the real server-filtered route set; the prototype source sidebar is 240px and includes fictional review navigation. This leaves the production content area 8px narrower at 1440px.
- The approved navigation font remains licence-gated as described above. This is an open visual difference, not an accepted exclusion.
- Real school, Student, class and count data differ from the fictional reference. The hierarchy and equivalent states were compared without hardcoded display data.

## Verification

- Focused ESLint: passed for all changed TS/TSX files.
- `pnpm typecheck`: passed after Prisma generation and Next route type generation.
- `pnpm check:docs`: passed for the installed specification pointer and live documentation.
- `pnpm test:e2e test/e2e/students-directory-gaps.spec.ts`: passed 2/2 desktop/mobile against `vyapti_vschool_test`; the Playwright web server production build passed.
- Final measured desktop run, `--project=chromium`: passed 1/1 after the row-height correction. It verified search attributes, server sort, URL/Back/Forward state, Cancel/Escape, focus restoration, Manage destinations and no horizontal overflow.
- No backend contract, schema, migration, seed or database row changed. Existing persistence evidence was not rerun for a presentation-only correction.

Functional engineering verification, visual comparison and human acceptance are separate. Human visual acceptance is still **PENDING**.
