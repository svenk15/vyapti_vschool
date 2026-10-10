# SA-06 branch information visual recheck

Date: 10 October 2026. Human visual acceptance: **PENDING**.

## Exact comparison

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-06`, step 1 “School information”.
- Application route: `/admin/school`.
- Reference captures: [desktop](reference-desktop.png) and [mobile](reference-mobile.png).
- Corrected application captures: [desktop](application-desktop.png) and [mobile](application-mobile.png).
- Typography/density follow-up captures: corrected application [desktop](application-typography-corrected-desktop.png) and [mobile](application-typography-corrected-mobile.png), with the matching [mobile reference](reference-typography-mobile.png).

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

## Typography and density follow-up

After the owner reported that the font and form/table sizing still differed, a computed-style comparison confirmed that the application inherited the roomier portal defaults. The SA-06 composition now uses the approved workflow values without changing unrelated portal pages:

| Element | Approved reference | Corrected application |
|---|---:|---:|
| Workflow font | Inter/system, 14px/21px | Inter/system, 14px/21px |
| Page title | 28px/35px, weight 650 | 28px/35px, weight 650 |
| Step label | 12px/18px | 12px/18px |
| Main form card | 760px, 22px padding | 760px, 22px padding |
| Field label | 13px/19.5px | 13px/19.5px |
| Text input | 14px, 43px high | 14px, 43px high |
| Address field | 714×96px | 714×96px |
| Desktop primary action | 13px, 40px high | 13px, 40px high |

The focused real-database Playwright journey passed 2/2 again on desktop and mobile after this correction. The application screenshots were inspected directly against the reference captures. Human visual acceptance remains **PENDING**.
