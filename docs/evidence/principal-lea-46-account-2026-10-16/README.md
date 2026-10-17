# LEA-46 Principal account, preferences and school support evidence

Status: ENGINEERING_COMPLETE / DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS / HUMAN_REVIEW_PENDING / SYNTHETIC_ONLY.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow **LEA-46 — Manage sessions, preferences and school support**. Production routes are `/leadership/account` and the trusted counterpart `/admin/school`.

## Implemented contract

- Existing own-session listing, selective non-current revoke, current-session sign-out and recovery boundaries remain unchanged.
- Access persists only `TABLE_DENSITY=COMFORTABLE|COMPACT` and `REDUCED_MOTION=SYSTEM|REDUCE` for the authenticated global account. The request accepts no account ID. Versions, exact-input receipts and a safe Access security event commit atomically.
- A current School administrator publishes one complete support label/contact/hours snapshot under the School expected version and existing management receipt/audit/outbox transaction. Leadership reads require the live account, institution, branch and membership; the Principal route independently requires its Principal workspace.
- Unconfigured support is honest. No office/branding fallback, external message or continuous-monitoring claim is synthesized.
- Migration `20261017130000_access_preferences_support` is applied to development and test databases. Both have 70 migrations. New global identity tables remain Path A pending TEN-03.

## Verification

- Targeted unit: `pnpm test:unit test/unit/access-preferences.test.ts test/unit/access-management.test.ts` — 7/7 passed.
- Real PostgreSQL F18 cases: 2/2 passed within the functional run, covering default/readback, wrong-account isolation, exact replay, changed-payload conflict, stale and concurrent versions, single evidence writes, support publication, cross-branch/revoked denial, redaction and the database completeness constraint.
- The inadvertently broad functional wrapper run completed 192/194. Its two failures are unrelated stale expectations: institution context now includes `roles`, and Learning report availability now includes `feedback-turnaround.v1`. They are not reported as passed.
- `pnpm typecheck`, `pnpm check:db-design`, `pnpm check:backend`, `pnpm check:boundaries` and `pnpm build` passed for the current source.
- Focused Playwright passed 2/2 Chromium and 2/2 mobile sequentially with one worker against the current `.next-e2e` build. It publishes support from School settings, saves preferences, reloads their shell attributes, verifies trusted support, revokes the other session and signs out the current session.
- The first browser attempt was invalid evidence because `VSCHOOL_E2E_BUILT=1` started an older `.next-e2e` bundle. The trace identified that source mismatch; the isolated E2E bundle was rebuilt before the passing runs.

## Direct visual inspection

The approved explorer and production states were opened and inspected at 1440×1000 and 390×844. The application uses the agreed production account/settings recipes rather than reproducing the explorer dialog. Cards, labels, action hierarchy, radio targets, support facts and mobile stacking are readable with no horizontal overflow. The repository's documented font portability exception and native VoiceOver/NVDA evidence remain pending.

- Approved reference: [desktop](reference-chromium.png), [mobile](reference-mobile.png).
- Principal account: [desktop](application-preferences-support-chromium.png), [mobile](application-preferences-support-mobile.png).
- Trusted support publication: [desktop](application-support-publisher-chromium.png), [mobile](application-support-publisher-mobile.png).
- Trusted support projection: [desktop](application-support-chromium.png), [mobile](application-support-mobile.png).
- Session confirmation: [desktop](application-confirm-chromium.png), [mobile](application-confirm-mobile.png).

Human acceptance is PENDING. TEN-03, native accessibility, font portability and production enablement remain separate gates.
