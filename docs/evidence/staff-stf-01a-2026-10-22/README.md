# STF-01A People-native Staff directory evidence

Reference authority: frozen Staff prototype at `docs/execution/STAFF_REVIEW/prototype/STAFF_WORKFLOWS.html` and `STAFF_WORKFLOWS.js`, commit `ad78b1c95102ed33ecaa938f9a4b29e2c854d0e7`.

Direct reference capture: [`directory-open-desktop-1440x1000.png`](../../execution/STAFF_REVIEW/prototype/evidence-operation-recovery/directory-open-desktop-1440x1000.png). The reference demonstrates Teaching and Access controls over four local fictional rows; production intentionally omits those two unsupported owner predicates under STF-01B.

Current application captures:

- `application-directory-chromium.png` — production 1440×1000 desktop after Employee-code descending sort.
- `application-directory-mobile.png` — production 390×844 mobile project in the same query state.
- `application-filter-chromium.png` and `application-filter-mobile.png` — production filter drawer with applied query state left unchanged until Apply.

Direct visual inspection confirmed the approved compact one-row search toolbar at desktop and the two-row control composition at mobile. The People-only directory retains the existing production shell and Forest tokens. Teaching and Access have not been split into the reference columns, and the row action remains `Manage`; those differences belong to STF-01B and STF-03A respectively and are not claimed complete by this checkpoint.

Verified behavior:

- server-wide name/Employee-code search, category/employment filter, and name/code/employment sort before the page limit;
- stable People-owned ordering and signed forward/reverse cursors;
- actor, token version, scope, branch configuration and normalized query binding;
- URL state, Back/Forward, draft-only drawer changes, Cancel and Escape;
- live protected query on every navigation; no page-local filtering or sorting.

Commands and results:

- `pnpm exec tsc --noEmit --pretty false` — PASS.
- changed-file ESLint — PASS.
- `pnpm exec vitest run --config vitest.config.ts test/unit/people.test.ts` — 4/4 PASS.
- `pnpm test:functional test/functional/people-employees.test.ts` — 11/11 PASS against real PostgreSQL.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/people-employees.spec.ts --project=chromium` — corrected current-build test run 2/2 PASS.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/people-employees.spec.ts --project=mobile` — 2/2 PASS.

Human visual acceptance is PENDING. Native accessibility and TEN-03 remain release gates.
