# PAR-50 Parent account and current-session checkpoint

Implementation commit: `7d52491`

Human review: **PENDING**

## Outcome

`/family/account` now follows the approved **My account → End access → Confirm** composition. It reads only the current account's safe Access projection and current hosting-session timestamps. Back retains selected values; only final confirmation starts verified account recovery or signs out this browser session. Browser Back after sign-out remains at public sign-in. The optional “Other sessions if supported” choice is omitted because no other-session inventory exists.

No schema or migration changed. Existing FAM-01 PostgreSQL evidence remains applicable to guardian/child/purpose scope and revocation. Existing Access PostgreSQL evidence remains applicable to safe-self projection and stale-token denial.

## Verification

- `pnpm typecheck` — passed.
- Focused ESLint for the page, component and Parent E2E — passed.
- `pnpm check:backend` and `pnpm check:boundaries` — passed.
- `VSCHOOL_E2E=1 pnpm build` — passed for the committed application source.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/guardians.spec.ts --project=chromium` — 1/1 passed, one worker, 48 migrations current.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/guardians.spec.ts --project=mobile` — 1/1 passed, one worker, 48 migrations current.
- One intermediate mobile run stopped in setup with `PROVISION_CONFLICT` after a readable fixture name lost uniqueness. The fixture now uses a readable random suffix; the failed project passed on rerun. This was not an application failure.

## Direct visual comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/flow/PAR-50`.

Matched entry and confirmation states were inspected directly at desktop 1440×1000 and mobile 390×844:

- `reference-chromium.png` / `application-entry-chromium.png`
- `reference-mobile.png` / `application-entry-mobile.png`
- `reference-confirm-chromium.png` / `application-confirm-chromium.png`
- `reference-confirm-mobile.png` / `application-confirm-mobile.png`

Corrected differences: staged composition, title/description, column proportions, field width, card height, desktop CTA sizing, mobile inset, focus movement and final confirmation placement. The application uses real authorized school/child/account/session values. It omits prototype review tools and navigation for unavailable Messages, Requests and Calendar owners. The documented Inter/system font substitution remains, and human visual acceptance is pending.
