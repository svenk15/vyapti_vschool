# SA-08 Administrator capability-interest composition — 11 October 2026

## Authority and routes

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-08`
- Workflow specification: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/workflows/SA-08.md`
- Staged production entry: `/admin/modules`
- Existing status/history/activation workspace: `/admin/modules/manage`
- Backend contract: SA-COMP-09 immutable nonbinding capability interest

## Implemented result

The production entry follows Choose a module → Request a change → Confirm. Capability and need survive Back/Continue navigation, each stage heading receives focus, and only final Confirm invokes persistence. The browser keeps one idempotency key for an unchanged intent after an unknown response; changing either field creates a new intent. The success receipt explicitly says no purchase, payment obligation, entitlement or branch activation changed.

The approved disabled **Save draft and leave** control remains disabled because SA-08 does not define durable wizard-draft ownership or recovery. Review outcomes and withdrawal remain outside the accepted submission-only contract. Existing authorized configuration behavior was preserved at the management route.

## Direct comparison

Desktop:

- [Choose reference](reference-choose-desktop.png) / [application](application-choose-chromium.png)
- [Request reference](reference-request-desktop.png) / [application](application-request-chromium.png)
- [Confirm reference](reference-confirm-desktop.png) / [application](application-confirm-chromium.png)

Mobile:

- [Choose reference](reference-choose-mobile.png) / [application](application-choose-mobile.png)
- [Request reference](reference-request-mobile.png) / [application](application-request-mobile.png)
- [Confirm reference](reference-confirm-mobile.png) / [application](application-confirm-mobile.png)

The captures were directly inspected at 1440×1000 and 390×844. Stage hierarchy, card width, field sizing, dividers, actions, review rows, guidance cards and responsive stacking align. The application uses real authorized branch selection and synthetic database values instead of the fictional Greenwood data. The documented font substitution remains.

## Verification

- Focused ESLint: PASS.
- TypeScript `tsc --noEmit`: PASS.
- PostgreSQL-backed Playwright: 2/2 desktop/mobile PASS.
- Browser journey proves Back/Continue retention, final-action-only submission, response-loss retry with the same key, exactly one persisted interest, unchanged entitlement/activation counts, management-route continuity and release/dependency denial.
- Existing SA-COMP-09 real PostgreSQL authorization, scope, replay and transaction evidence remains applicable.
- No schema, migration, seed or backend contract changed.

## Manual walkthrough

1. Sign in as the synthetic School Administrator and open `/admin/modules`.
2. Choose **Transport**, Continue, enter a fictional branch need of at least five characters, then go Back and forward again. Expect both values retained.
3. Continue to Confirm and submit. Expect a nonbinding receipt and no claim that access was purchased or enabled.
4. Open **Review module status**. Expect persisted interest history and existing status/configuration controls according to current authority.
5. Attempt an unavailable module activation from the management route. Expect a release/dependency explanation and no activation.

Human visual acceptance: **PENDING**. Native VoiceOver/NVDA and production TEN-03 gates remain outstanding.
