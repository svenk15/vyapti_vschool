# STF-06 invitation review and reasoned resend

Human review: **PENDING**.

The Staff Profile reads one exact Employee-context Access projection. Failed and expired invitations permit a bounded reasoned resend; pending, sent, consumed and revoked states are review-only. Access rechecks live authority, trust mode, Employee binding, pending membership version and roles before replacing a token. Exact replay uses the original payload/key and does not deliver twice. Confirmed replacement followed by failed refresh uses GET-only recovery.

## Scope and evidence

- Owner: Access. People composes the independently authorized projection.
- Persistence: existing AccessInvite, AuthSecurityEvent and scoped CommandReceipt tables. No schema or migration changed.
- Provider: the deterministic local synthetic mail sink only. No real message was sent and production-provider review remains a release gate.
- Seed: `pnpm demo:seed` preserves existing records and adds one fictional `Morgan Invite Review` Employee whose allowlisted `@mail-fail.vschool.example` invitation provides the failed-delivery review state.
- Frozen presentation authority: Staff reference commit `ad78b1c95102ed33ecaa938f9a4b29e2c854d0e7`, executable prototype SHA-256 `67ca61b0204bac68c7bc7602e02b3c638305b448d377e79be4bbff9cce474a01`.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/password-reset-policy.test.ts` — 12/12 passed.
- `pnpm test:functional test/functional/staff-invitations.test.ts` — 7/7 passed against real PostgreSQL. The focused case proves one replacement, one delivery across exact replay, changed-input conflict, immutable restricted evidence and denial after administrator revocation.
- Focused Chromium and mobile Staff invitation journeys — 1/1 passed per viewport with one worker. They prove a committed response-loss retry with the original key, no duplicate replacement, and confirmed-save/failed-refresh recovery issuing `POST, GET, GET` only.
- `pnpm exec tsc --noEmit` and changed-file ESLint — passed.
- The E2E production build completed with `VSCHOOL_E2E=1` and a 4 GiB Node heap.
- `node --import tsx scripts/demo-people.ts` — passed twice against the existing development database, preserving credentials and the failed-invitation fixture. The aggregate `pnpm demo:seed` reached and completed this People step, then stopped at the unrelated pre-existing `LDR-02` `PRINCIPAL_COMPARISON_REQUIRED` gate; earlier successful seed data was preserved.

## Presentation evidence

The resend review, recovered invitation and read-only refresh states were inspected directly. Captures cover 1440×1000, 900×1000, 390×844 and 360×800. The four 900px captures exercise Forest, Amethyst, Porcelain and Linen through the isolated visual harness; no theme preference is persisted by the test.

The frozen prototype does not contain an exact production resend dialog. The application therefore uses the frozen Staff Profile geometry, shared dialog/control recipes and approved school-office language as a bounded design extension. Reviewer controls and fictional prototype data were not copied into production.

Files in this directory beginning `invitation-review-`, `invitation-recovered-` and `invitation-refresh-` are current-source application evidence. Human visual acceptance, native accessibility, font portability and TEN-03 remain PENDING.
