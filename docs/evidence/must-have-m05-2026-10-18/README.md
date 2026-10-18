# M05 notice to acknowledgement — current-source evidence

Date: 18 October 2026 (Asia/Kolkata)

Tested source: checkpoint parent `dae79cf`, including the Communication responsive-table correction committed with this evidence.

Human acceptance: **PENDING**.

## Demonstrated journey

- The School Administrator Communication workspace exposes proposal authoring and final publication without granting review authority.
- A separately authenticated Teacher account enters the Principal workspace with the exact Communication `REVIEW` designation and sees only assigned immutable proposal revisions.
- Principal coverage reports frozen eligible recipients, portal reads and explicit acknowledgements as separate facts.
- A Communication-specific Parent fixture with `communication.notice.read` sees only notices frozen for the exact authorized child context.
- The Student fixture with `communication.notice.read_self` sees only its own frozen notices.
- The main Guardian demo fixture was deliberately not broadened: it has no Communication purpose. The dedicated idempotent Communication fixture proves the purpose boundary.

## Verification

- `pnpm test:functional test/functional/communication-notices.test.ts test/functional/communication-student-notices.test.ts` — **8/8 passed** against real PostgreSQL; 117 migrations, none pending.
- `pnpm exec eslint app/admin/communication/page.tsx app/leadership/notices/review/page.tsx` — **passed**.
- Focused current-source browser smoke at 1440×1000 and 390×844 — **10/10 role/viewport surfaces reached**.
- Direct screenshot inspection found root horizontal overflow on the Administrator and reviewer mobile tables. The tables now use the shared responsive directory-card composition; a focused DOM measurement confirmed `clientWidth=390`, `scrollWidth=390`, and no element beyond the viewport.

The browser smoke initially timed out twice because the newly started development server had not hydrated the sign-in client before the click. The harness was changed to wait for network idle; the unchanged journey then completed. This was a harness timing issue, not a product authorization relaxation.

## Captures

- Administrator author/publisher: `m05-admin-communication-{desktop,mobile}.png`
- Independent reviewer: `m05-notice-reviews-{desktop,mobile}.png`
- Principal coverage: `m05-notice-coverage-{desktop,mobile}.png`
- Parent recipient: `m05-parent-messages-{desktop,mobile}.png`
- Student recipient: `m05-student-messages-{desktop,mobile}.png`
- Route/heading record: `m05-smoke.json`

The captures were inspected directly for hierarchy, card/table composition, action placement and mobile overflow. Font portability, native accessibility, TEN-03, production messaging/provider review and human acceptance remain open release gates.
