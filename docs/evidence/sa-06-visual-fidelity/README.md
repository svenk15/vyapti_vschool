# SA-06 branch information visual fidelity

> Superseded for visual comparison by the owner-requested [SA-06 visual recheck](../sa-06-visual-recheck/README.md). The owner did not accept this earlier comparison.

Date: 10 October 2026. Human visual acceptance: **PENDING**.

## Comparison

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-06`, step 1 “School information”, with step 2 also inspected.
- Application route: `/admin/school`.
- Captures: [reference desktop](reference-desktop.png), [reference mobile](reference-mobile.png), [application desktop](application-desktop.png), [application review desktop](application-review-desktop.png), and [application mobile](application-mobile.png).

This was the first comparison checkpoint. It was subsequently found to retain visible composition differences and is preserved only as historical evidence. See the recheck above for the corrected implementation and current captures.

## Preserved behavior and deviations

The existing `school.manage` guard, expected-version conflict, idempotent retry, server-side immutable-timezone rejection, redacted activity evidence and scoped campus operation are unchanged. Campuses remain available in a collapsed secondary disclosure because they are an existing supported operation outside the SA-06 reference body. Refresh remains a header action for explicit recovery. The prototype’s “Save draft and leave” control is not implemented because no accepted draft ownership, persistence, validation or resume contract exists; no fake browser-only draft was added.

## Verification

- `pnpm exec eslint components/access-management.tsx` passed.
- `pnpm typecheck` passed.
- `pnpm test:e2e test/e2e/access-management.spec.ts --grep "settings persist"` passed 2/2 across desktop and mobile against guarded `vyapti_vschool_test` with all 38 migrations applied. The journey covers the step transition, forged timezone denial, lost-response replay, stale comparison/retry, campus persistence and duplicate rejection.
- `pnpm build` passed for the captured application source.
- Desktop and mobile captures were visually inspected. No horizontal overflow was detected. Native VoiceOver/NVDA and human visual acceptance remain outstanding.

No schema, migration, backend contract, seed or development-database data changed in this presentation slice.
