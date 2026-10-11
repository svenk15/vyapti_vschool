# SA-07 Administrator branding review composition — 11 October 2026

## Authority and scope

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-07`
- Workflow specification: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/workflows/SA-07.md`
- Production entry: `/admin/branding`
- Existing advanced management: `/admin/branding/manage`
- Backend, database schema, migrations and seed behavior: unchanged

## Implemented checkpoint

The production entry uses the approved Preview school identity → Review before publication → Confirm order. Palette, display name, welcome text and acknowledgement survive Back/Continue navigation. Stage headings receive focus. Confirm invokes the existing scoped Branding preview endpoint and produces a validated private preview; it does not publish or alter authorization. Existing logo, draft, publication, rollback, host and publication-delegation operations remain at the management route.

The catalog outcome that a nonpublisher can “request a branding update” is still a required gap. SA-COMP-14 explicitly introduced no durable publication-request lifecycle, and the current slice does not fake a stored request or receipt. The disabled Save draft and leave control also remains nonfunctional because the catalog does not establish durable wizard-draft ownership or recovery.

## Direct comparison evidence

Desktop reference/application:

- [Preview reference](reference-preview-desktop.png) / [application](application-preview-chromium.png)
- [Review reference](reference-review-desktop.png) / [application](application-review-chromium.png)
- [Confirm reference](reference-confirm-desktop.png) / [application](application-confirm-chromium.png)

Mobile reference/application:

- [Preview reference](reference-preview-mobile.png) / [application](application-preview-mobile.png)
- [Review reference](reference-review-mobile.png) / [application](application-review-mobile.png)
- [Confirm reference](reference-confirm-mobile.png) / [application](application-confirm-mobile.png)

The captures were inspected directly at 1440×1000 and 390×844. Stage hierarchy, field grid, actions, review rows, guidance cards and responsive stacking align. The application uses real authorized context and therefore exposes only fixture-entitled navigation. The previously recorded font substitution remains; native VoiceOver/NVDA and browser-zoom evidence is not supplied by these captures.

## Verification

- Focused ESLint for the changed pages/component/test: PASS.
- TypeScript `tsc --noEmit`: PASS before the final test-only screenshot-scroll refinement; no production TypeScript changed afterward.
- `git diff --check`: PASS before the final documentation record.
- Staged PostgreSQL-backed Playwright journey: desktop/mobile 2/2 PASS before the screenshot-scroll refinement; the refined mobile project PASS. A later isolated refined Chromium refresh failed during fixture sign-in before reaching SA-07, so it is not reported as a workflow pass.
- Relocated full branding create/preview/logo/publish/public-sign-in/rollback journey: Chromium 1/1 PASS.
- No migration or database reset occurred.

## Manual review

1. Sign in with the local synthetic Administrator credential file and open `/admin/branding`.
2. Choose a palette, change the display and welcome text, then Continue.
3. Check the acknowledgement, go Back, and confirm values and acknowledgement are retained after returning to Review.
4. Continue to Confirm and activate Confirm. Expect a server-validated private preview and no publication.
5. Open **Branding controls**. Expect the existing authorized profile, logo, draft, publish, rollback, host and delegation workspace.

Human visual acceptance: **PENDING**.
