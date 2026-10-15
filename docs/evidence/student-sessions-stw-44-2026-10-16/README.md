# STW-44 — Manage my sessions

Engineering verification completed on 16 October 2026. Human review remains **PENDING**.

## Delivered outcome

The Student Account workspace now opens a dedicated two-stage session-management flow at `/student/account/sessions`. It lists at most 20 active sessions for the authenticated global account, exposes only a server-derived `DESKTOP_WEB` or `MOBILE_WEB` label and safe timestamps, retains the selected session across Back/Continue, and revokes only on final confirmation. Current-session sign-out remains a separate Account action. Account-wide password recovery still invalidates all sessions through `token_version`.

Every protected provider session carries a server-created session ID. The Access use case rechecks active account status, token version, ownership, expiry and revocation. Selective revocation locks the account before the session, appends one redacted security event in the same transaction, and returns the existing result on a repeated or concurrent revoke. Foreign session IDs are indistinguishable from missing IDs.

## Schema and migrations

- `20261016110000_access_account_sessions` creates `vs_access_account_session` with the account FK, allowed-label/date/version checks, scoped uniqueness and active-session index.
- `20261016111000_access_account_session_metadata` is a forward metadata correction for the Path A/TEN-03 registry contract. Both migrations are applied to `vyapti_vschool` and `vyapti_vschool_test`; 61 migrations are present in each database.
- RLS enforcement remains deferred to TEN-03. Application authorization and verified account context remain active for every read/write.

## Verification

- Focused ESLint and `pnpm typecheck`: passed.
- Unit: `test/unit/access-sessions.test.ts` — 3/3 passed.
- Real PostgreSQL: `test/functional/access-sessions.test.ts` — 2/2 passed, including foreign-account isolation, concurrent idempotent revoke with one event, expiry and token-version invalidation.
- Production-mode build for browser verification: passed.
- Playwright, one worker: desktop Chromium 1/1 and mobile Chromium 1/1 passed. The journey creates two real browser sessions, verifies privacy-safe inventory, Back retention, final-only revoke, persistence after reload, denial of the revoked browser, current sign-out and browser-Back protection.
- `pnpm check`: passed, including lint, TypeScript, documentation, 96-table database design, extraction boundaries, portable backend compilation and 161/161 unit tests.
- Focused shared-auth PostgreSQL regression: 11/11 passed across existing Access and new session cases; both databases reported all 61 migrations applied.
- Existing shared-auth Chromium regression: five unaffected cases passed initially. The Administrator sign-out case exposed a stale locator that still expected the pre-existing direct button after the accepted staged workspace-exit change. Its trace was inspected, the test was updated to execute the real three-stage flow, and that single changed case then passed 1/1. No assertion or timeout was weakened.
- Final `pnpm build`: passed and includes `/student/account/sessions` plus both session API routes.

## Visual comparison

Approved state: `VSchool_Student_Review.html#/flow/STW-44` in the approved Student pack. The reference and implementation were served separately and directly inspected at matching desktop and mobile viewports.

| State | Reference | Application |
|---|---|---|
| Review | `reference-review-chromium.png`, `reference-review-mobile.png` | `application-chromium.png`, `application-mobile.png` |
| Confirm | `reference-confirm-chromium.png`, `reference-confirm-mobile.png` | `application-confirm-chromium.png`, `application-confirm-mobile.png` |

The implementation follows the dedicated title, two-step primary card, supporting outcome/recovery/boundary cards and responsive action placement. It replaces the prototype's generic text input with the authorized real-session selector and selected-session summary. The established font portability exception remains; native VoiceOver/NVDA evidence remains outstanding.

## Manual walkthrough

1. Sign in as the synthetic Student in two separate browsers using the ignored Student credential file.
2. In the first browser open **My account → Manage sessions**. Expect two privacy-safe session entries and no raw browser, network or device identifier.
3. Select the other session, choose **Continue**, then **Back**. Expect the choice to remain. Continue again and choose **Sign out this session**.
4. Reload the first browser. Expect only its current session. Return to the second browser and open a protected Student page; expect sign-in rather than protected data.
5. Use **Sign out** on the Account page to end the current session separately.

No seed changes are required: sessions are created by real successful sign-ins. Use `pnpm demo:seed` for the existing fictional Student persona. Credentials remain outside source control.
