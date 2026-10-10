# SA-06 branch information visual recheck

Date: 10 October 2026. Human visual acceptance: **PENDING**.

## Exact comparison

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-06`, step 1 “School information”.
- Application route: `/admin/school`.
- Reference captures: [desktop](reference-desktop.png) and [mobile](reference-mobile.png).
- Corrected application captures: [desktop](application-desktop.png) and [mobile](application-mobile.png).

The earlier comparison in `docs/evidence/sa-06-visual-fidelity/` did not normalize the reference prototype chrome correctly and retained visible differences. The owner rejected that result. This recheck uses the same workflow state and content density, while excluding only the reference pack's prototype review banner and reviewer controls from application geometry.

## Corrections

- Removed the extra header **Refresh** action that is absent from the approved body.
- Removed an empty feedback wrapper that inserted a full page-stack gap before the stepper.
- Matched the approved full content width, 248 px production sidebar offset, stepper spacing, two-column card/rail composition and form-card padding.
- Matched the field grouping, address span, bottom action divider, **Cancel** / **Continue** placement and mobile stack.
- Kept the approved **Save draft and leave** affordance visible but disabled, with an accessible explanation, because no accepted ownership, persistence or resume contract exists.
- Moved the separate campus operation out of step 1. It remains available after a confirmed save and retains its existing server authorization and persistence behavior.
- Constrained the page and campus disclosure so populated mobile states do not widen the document.

## Remaining deviations

- The production shell uses the approved enhanced 248 px sidebar, real server-filtered navigation, signed-in school context and fictional development data. The static reference uses prototype-only review chrome and fixed sample values.
- Draft persistence/resume remains an implementation gap. The disabled control does not claim a successful draft operation.
- Native VoiceOver/NVDA evidence and owner visual acceptance remain outstanding.

No backend contract, authorization rule, schema, migration, seed or development-database data changed.

## Verification

- Desktop and mobile final captures were visually inspected for geometry, hierarchy, action placement and overflow.
- `pnpm test:e2e test/e2e/access-management.spec.ts --grep "settings persist"` passed 2/2 on desktop and mobile against guarded `vyapti_vschool_test` with all 38 migrations applied. It covers the real guarded save, immutable-timezone rejection, lost-response replay, stale-version comparison, confirmed campus operation and mobile overflow.
- Focused ESLint, `pnpm typecheck`, `pnpm check:docs` and `git diff --check` passed.
- `pnpm build` passed for the captured source before the documentation-only evidence update; the executable checkpoint is rebuilt after its focused commit.
