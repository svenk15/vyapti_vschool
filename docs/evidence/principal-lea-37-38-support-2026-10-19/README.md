# LEA-37 / LEA-38 restricted support evidence

Tested worktree base: `154427c`. The exact checkpoint commit is recorded in the subsequent resume update. Human review is **PENDING**.

## Implemented journeys

- LEA-37: a Principal with an exact pupil referral grant selects that pupil and one designated specialist, reviews a minimum factual observation, recovers a deliberately lost response using the original command key, and then sees status only. The specialist alone sees the protected observation and records the receipt lifecycle.
- LEA-38: a policy steward publishes a versioned fictional procedure. An authorized Principal records only a minimum safe handoff after the human-led process, and the exact responsible specialist acknowledges it. The portal explicitly makes no emergency-monitoring, assistance, treatment or intervention claim.

## Verification

- `test/unit/support.test.ts`: 3/3 passed.
- `test/functional/support.test.ts`: 3/3 passed against `vyapti_vschool_test` on real PostgreSQL. It covers wrong-specialist denial, exact replay, revoked receipt denial, procedure/handoff lifecycle, cross-branch denial and stale procedure rejection.
- `test/e2e/principal-support.spec.ts`: 2/2 Chromium and 2/2 mobile passed sequentially with one worker. The journey covers lost-response recovery, narrative isolation, specialist receipt, minimal handoff, acknowledgement, keyboard stage focus and viewport overflow.
- Current-source 4 GiB E2E production build passed. Prisma validation/generation, TypeScript and focused lint passed.
- Development and test databases both contain 105 migrations through the forward-only `20261019031000_support_path_a_contract_comments` metadata correction; the Support schema migration remains `20261019030000_support_restricted_owner`.
- The focused fictional seed ran twice without creating duplicates or overwriting existing records. Credentials remain only in ignored private artifacts.

The first mobile run exposed a real wide-table overflow. The Support directories now use labelled row cards at 390×844; the focused mobile rerun passed and the corrected capture was inspected.

## Direct visual comparison

Reference authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, explorer states LEA-37 and LEA-38.

Application captures:

- `principal-referral-chromium.png`, `principal-referral-mobile.png`
- `principal-urgent-chromium.png`, `principal-urgent-mobile.png`
- `specialist-inbox-chromium.png`, `specialist-inbox-mobile.png`

Reference captures:

- `reference-lea-37-chromium.png`, `reference-lea-37-mobile.png`
- `reference-lea-38-chromium.png`, `reference-lea-38-mobile.png`

The explorer is a workflow catalogue dialog, so production maps its stage order, labels, restrictions and outcomes into shared routed page recipes rather than claiming pixel identity. Direct inspection confirmed hierarchy, bounded cards, role-specific actions, mobile stacking and absence of horizontal overflow. The existing font-portability exception remains.

## Outstanding gates

D16 remains synthetic-only. School emergency/contact policy, real-data retention/disclosure, TEN-03, provider/release review, native VoiceOver/NVDA, actual browser 200% zoom, font portability and human acceptance remain pending.
