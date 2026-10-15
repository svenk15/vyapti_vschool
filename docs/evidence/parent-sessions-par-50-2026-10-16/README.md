# PAR-50 optional cross-session extension

Human review: **PENDING**

## Outcome

The approved Parent **My account → End access → Confirm** journey now includes **Other sessions if supported**. It consumes the Access-owned global account-session directory introduced by ACC-01; the selected child remains page context and never grants account authority. The page exposes only a coarse desktop/mobile web category and start/expiry times. Selection survives Back/Continue, and the selected non-current session is revoked only at final confirmation. Current-session sign-out and account-wide password recovery remain separate.

No schema, migration, seed, role or child-purpose grant changed in this Parent slice. Existing ACC-01 PostgreSQL evidence remains applicable to account ownership, foreign-account denial, expiry, concurrent idempotent repeat and token-version invalidation.

## Verification

- Focused ESLint for the changed Parent page, component and browser journey — passed.
- `pnpm typecheck` — passed.
- `VSCHOOL_E2E=1 pnpm build` — passed before the browser runs.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/parent-sessions.spec.ts --project=chromium --workers=1` — 1/1 passed with 61 test migrations current.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/parent-sessions.spec.ts --project=mobile --workers=1` — 1/1 passed with 61 test migrations current. This is a mobile viewport project; it does not assert a mobile user agent.
- The first two desktop attempts found test-locator mismatches for the focus wrapper and Alert title. The trace/output were inspected and the locators were aligned with the rendered accessible structure; product assertions and timeouts were not weakened.

The browser journey creates two real sessions for one Parent account, retains the chosen other session after Back, revokes it only at final confirmation, verifies the other browser loses protected access, and verifies independent current-session sign-out with protected browser-Back behavior.

## Direct visual comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/flow/PAR-50`.

The approved base entry and confirmation states from `docs/evidence/parent-account-par-50-2026-10-14/` were compared directly with the new desktop and mobile captures:

- `application-review-chromium.png`
- `application-confirm-chromium.png`
- `application-review-mobile.png`
- `application-confirm-mobile.png`

The shell, child context, title, three-step progression, card proportions, action placement and responsive composition follow the approved PAR-50 treatment. The reference names the optional other-session capability but contains no populated selector/receipt state, so the session row and selected-session confirmation are a narrow design extension using the existing Parent card/list language. Prototype review tools and unavailable navigation remain intentionally absent. The documented Inter/system font substitution, native VoiceOver/NVDA checks, TEN-03 and human visual acceptance remain pending.
