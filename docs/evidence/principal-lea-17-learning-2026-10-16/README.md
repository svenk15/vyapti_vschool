# LEA-17 Principal assignment-completion evidence

## Scope and source

- Implemented source: `2e03897933b53e2843be4df6b5157d59ee941b32`.
- Application route: `/leadership/learning`.
- Immutable approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, `WorkflowReview.read('LEA-17')`.
- No schema or migration change; development and test retain 64 migrations.

## Verification

- `pnpm exec eslint …` — passed for the changed Learning/Principal files.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm test:functional test/functional/learning-publication.test.ts` — 15/15 passed against `vyapti_vschool_test`, including denominator arithmetic, private-content exclusion, stable pagination, changed-query cursor rejection, cross-scope denial and revocation.
- Focused Access unit — 10/10 passed for the Principal capability set.
- `pnpm build` — passed; `/leadership/learning` is in the production route inventory.
- `pnpm test:e2e test/e2e/principal-learning.spec.ts --project=chromium --workers=1` — 2/2 passed after building the isolated `.next-e2e` target.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/principal-learning.spec.ts --project=mobile --workers=1` — 2/2 passed against that same isolated build.
- `pnpm demo:seed` — completed against guarded `vyapti_vschool`; repeat runs preserve existing records and credentials while verifying one submitted and one awaiting fictional due pair. Earlier optional TEN-02, ACA-01 and BRD-02 refreshes reported their preserved pre-existing unavailable/conflict states and did not block the required LEA-17 seed.
- `pnpm check` — passed: lint, Next route/type generation, documentation (30 tasks), database design (96 contracts), extraction boundaries, portable-backend compilation and 164/164 unit tests.

The first desktop browser attempt used `VSCHOOL_E2E_BUILT=1` before rebuilding `.next-e2e` and truthfully returned 404 for the new route. The test was not weakened: the harness was rebuilt once, then desktop and mobile passed.

## Direct visual comparison

- [Approved reference desktop](reference-chromium.png)
- [Application desktop](application-chromium.png)
- [Approved reference mobile](reference-mobile.png)
- [Application mobile](application-mobile.png)

All four captures were opened and directly inspected. The application retains the production Principal shell while matching the reference's class/subject/period selection and completion hierarchy. At 1440×1000 it shows a compact filter bar, three reconciled metrics and a readable assignment table. At 390×844 the form becomes one column, metrics remain grouped and table rows become labelled responsive records without horizontal overflow. Keyboard focus was verified on the class filter; the mobile drawer closes with Escape and returns focus.

## Deliberate limits and manual walkthrough

The current owner contract has no extensions, excused work, permitted pupil drill-down or teaching follow-up lifecycle. The page labels those limits and presents no dead actions. This is a supported partial LEA-17 workflow, not full reference completion. Font portability, native VoiceOver/NVDA, TEN-03, production controls and human acceptance remain pending.

1. Run `pnpm demo:seed`; credentials remain only in ignored mode-0600 `artifacts/leadership-01/private-demo.json`.
2. Open `http://127.0.0.1:3400/sign-in`, sign in with that Principal persona and select the Principal workspace.
3. Open **Assignment completion**. Expected: submitted, awaiting and future fictional assignments; expected due equals submitted plus awaiting.
4. Apply a class or subject filter. Expected: URL-backed state and only matching owner rows, with the same stated server cutoff.
5. Confirm that no Student name, response or private draft appears. Human review remains PENDING.
