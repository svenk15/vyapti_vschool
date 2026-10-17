# F10 / LEA-33 exact-revision Communication review evidence

Date: 17 October 2026. Tested working tree based on `80545f0`; the executable checkpoint is the commit containing this evidence. Human review is **PENDING**.

## Outcome

- One current Administrator AUTHOR prepares a text-only portal proposal. Save and submit publish or send nothing.
- Submission assigns one current, separately designated and independently authorized Principal reviewer on the server.
- Review covers the exact immutable content, class audience, acknowledgement flag, empty attachment digest, portal channel and immediate-after-publication mode.
- Approve, return and reject are immutable exact-revision decisions. Return/reject require an actionable reason; editing after return creates a new revision and invalidates the earlier digest.
- A separately designated Administrator PUBLISH action rechecks the approved digest and current eligible portal purposes before atomically creating the existing Notice/Version/frozen recipient manifest.
- Exact actor/key/payload replay returns one result; changed input conflicts; revoked authority cannot inspect or decide protected work.

## Verification

- `pnpm check`: passed lint, TypeScript, docs, 127-table database design, extraction boundaries, portable backend compile and 202 unit tests.
- Focused unit: `test/unit/communication-review.test.ts`, 2/2 passed.
- Focused real PostgreSQL: `test/functional/communication-notices.test.ts`, 5/5 passed after 83 migrations. The new case proves distinct author/publisher and reviewer identities, no send on save, server assignment, return/revision/resubmission, stale digest denial, approval, exact publication replay, one Notice, immutable decisions and revoked reviewer denial. Existing publication, recipient, reminder and Principal coverage cases also passed unchanged.
- `pnpm build`: passed on Next.js 16.3.8. Build ID: `neoUrp8NYWHGZhYlRoVU680`.
- `node --import tsx scripts/demo-communication.ts`: passed twice against the guarded development database and preserved the owned scenario and credentials. Private IDs and credentials remain in ignored `artifacts/communication-01/private-demo.json` and `artifacts/people-02/private-demo.json`.
- `node scripts/verify-communication-review-local.mjs`: passed against `http://127.0.0.1:3400`. It exercised author waiting, exact reviewer inspection, keyboard stage transitions, approval, separate publisher confirmation, final publication, persisted reload state, mobile drawer focus return and desktop/mobile overflow checks.
- The first focused browser run found that visual stage navigation raced React commit and left focus on the old button. The product was corrected to move focus after render; the focused journey then passed without widening timeouts or weakening assertions.

Development and test contain 83 forward migrations. `20261017220000_communication_notice_review` adds the four scoped workflow tables. Its applied comments used a legacy Path A label, so `20261017221000_communication_notice_review_metadata` adds the canonical TEN-ADR-006 comments forward-only; no applied migration, database or existing row was reset or rewritten.

## Direct visual inspection

Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-33 — Approve or return a proposed communication`.

The approved source is a workflow-explorer dialog. The application maps its exact-revision inspection, decision, confirmation and outcome stages into the approved production W recipe and shared Principal shell. It does not reproduce fictional Greenwood content or catalogue navigation. Desktop 1440×1000 and mobile 390×844 captures were directly inspected for hierarchy, typography, spacing, digest/audience facts, action order, focus, responsive stacking and overflow.

- [Reference desktop](reference-desktop.png)
- [Reference mobile](reference-mobile.png)
- [Author awaiting desktop](application-author-awaiting-desktop.png)
- [Reviewer exact revision desktop](application-review-exact-desktop.png)
- [Reviewer confirmation desktop](application-review-confirm-desktop.png)
- [Reviewer outcome desktop](application-review-outcome-desktop.png)
- [Publisher confirmation desktop](application-publish-confirm-desktop.png)
- [Published desktop](application-published-desktop.png)
- [Published mobile](application-published-mobile.png)
- [Reviewer persisted mobile](application-review-approved-mobile.png)
- [Machine observations](comparison.json)

The production route uses the shared portal shell while the explorer uses a modal catalogue; exact pixel identity is not claimed. LEA-32 still needs its own direct workflow comparison and the F12 attachment capability. Font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 restricted-role/RLS proof, provider/retention/load/restore review and human acceptance remain pending.

## Manual demo

1. Sign in at `http://127.0.0.1:3400/sign-in` with the Administrator persona from ignored `artifacts/people-02/private-demo.json`, choose Administration, open **Communication**, then **Prepare notice**. Save and submit a text proposal; expect explicit confirmation that nothing was published or sent.
2. Sign out, use the acting-Principal persona from the same private file, choose Leadership, then open **Notice reviews**. Inspect the exact revision, choose approve/return/reject and confirm. Expect the decision receipt; approval itself sends nothing.
3. Sign back in as Administrator and open the proposal. For an approved revision, choose **Publish approved revision**. Expect the current eligible portal account count and a persistent PUBLISHED receipt after reload.
4. Open the Parent or Student Messages workspace using the ignored `artifacts/communication-01/private-demo.json` or `artifacts/students-portal/private-demo.json` persona. Expect the final immutable notice only after publication. No email or external provider delivery is claimed.
