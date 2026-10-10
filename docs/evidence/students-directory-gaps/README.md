# Students directory approved-control completion

Captured and inspected on 10 October 2026. Executable source: `7d5e67ff15745359b92d2989ed950bf39ecb4dcc` on `work/stu-01-after-per02-wip`. Human visual acceptance remains **PENDING**.

## Compared state

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/students`, served/opened unchanged.
- Application: `/admin/students`, using authorized PostgreSQL-backed Student and Person data.
- Matching viewports: 1440 × 1000 desktop and 390 × 844 mobile CSS pixels.
- Compared states: populated directory, Sort drawer and enrolled Student Manage dialog.

## Evidence

| State | Approved reference | Application |
|---|---|---|
| Directory desktop | [reference](reference-directory-chromium.png) | [application](application-directory-chromium.png) |
| Directory mobile | [reference](reference-directory-mobile.png) | [application](application-directory-mobile.png) |
| Sort desktop | [reference](reference-sort-chromium.png) | [application](application-sort-chromium.png) |
| Sort mobile | [reference](reference-sort-mobile.png) | [application](application-sort-mobile.png) |
| Manage desktop | [reference](reference-manage-chromium.png) | [application](application-manage-chromium.png) |
| Manage mobile | [reference](reference-manage-mobile.png) | [application](application-manage-mobile.png) |

The final application captures were visually inspected. Desktop and mobile retain the approved page hierarchy, compact attribute/search toolbar, adjacent Filter/Sort controls, table/card density and grouped Manage dialog. The Sort drawer preserves separate draft state and fixed actions. The Manage dialog matches the View/Manage grouping and implemented action density. There is no page-width overflow at the tested mobile viewport.

## Completed behavior

- Search explicitly selects Student name or Admission number. Enter commits a server query; Back/Forward restores attribute and text.
- Name and admission searches remain isolated from each other and from exact Person identity resolution.
- Name, Admission number and Status sort ascending or descending in PostgreSQL over the complete authorized result set. Versioned signed cursors bind scope and the full query.
- Sort Apply commits URL state. Cancel and Escape discard draft choices and restore focus to Sort.
- Manage links reach the existing Student record, enrollment history, reasoned display-name correction, enrollment/placement and same-branch class-transfer sections. Direct destinations and mutations retain their existing server authorization and eligibility checks.

## Remaining gaps and visual differences

- **Drafts remains incomplete.** Its durable ownership, persistence, validation, retention and resume lifecycle still needs an accepted contract. No fake or browser-only draft tab was added.
- **Link guardian remains Phase 2 SA-32 work.** The Families owner, verified relationship, purpose grant and invitation dependencies are not implemented.
- **Lifecycle action remains Phase 3 SA-22 work.** Current archive and same-branch transfer do not implement promotion, cross-branch transfer or withdrawal cases.
- The visible Sort label was subsequently corrected to “Reference” without changing the concrete `admissionNumber` query field; see the [embedded-spec checkpoint](../students-implementation-spec/README.md). The application retains the approved enhanced navigation and real institution/branch context rather than the prototype review chrome.
- Application rows show real Enrollment summaries rather than copying the prototype’s fictional Class values. Counts and names therefore differ intentionally.

These are tracked implementation/dependency gaps. Their absence is not accepted functionality or workflow completion. Layout and visual acceptance remain PENDING.

## Verification

- `pnpm check` — passed: lint, generated route/type checks, documentation, 54 database contracts, extraction boundaries, portable backend compilation and 128/128 unit tests.
- `pnpm test:functional test/functional/students-registration.test.ts` — passed 14/14 against `vyapti_vschool_test`; includes attribute isolation, all sort fields/directions, normalized-key ties, keyset continuity, query mismatch/tamper rejection and foreign-branch exclusion.
- `pnpm test:e2e test/e2e/students-directory-gaps.spec.ts` — final run passed 2/2 desktop/mobile through the real application/API. It also ran the production build successfully and verified URL restoration, Sort Apply/Cancel/Escape, focus return, destination links and mobile overflow.
- The first browser attempt failed only because its test locator used a deliberately duplicated display name. The locator was scoped to the admission-number row; no product behavior was weakened. The final source run passed.
- No schema, migration, seed or database-design contract changed. No expression index was added without representative plan evidence.
