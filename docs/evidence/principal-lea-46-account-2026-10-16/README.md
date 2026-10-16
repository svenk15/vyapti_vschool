# LEA-46 Principal account/session evidence

Status: supported session-security slice engineering verified; full workflow partial; direct visual comparison complete with documented capability deviations; human review pending.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow **LEA-46 — Manage sessions, preferences and school support**. The application route is `/leadership/account`.

## Verified supported behavior

- An authenticated Principal sees only active, unexpired sessions for the same global account and token version, with safe browser category and start/expiry times.
- Selection survives Back/Continue in memory; no revoke occurs before final confirmation.
- Final confirmation revokes the selected non-current session, and reload proves it no longer appears while the current session remains active.
- Current-browser sign-out is separate and causes the protected Principal account route to return through sign-in.
- The existing Access implementation, unit tests and real-PostgreSQL `test/functional/access-sessions.test.ts` remain the unchanged owner evidence for foreign-account denial, locking, exact repeat, one security event, expiry and account-wide token invalidation.

Focused Playwright passed 2/2 Chromium and 2/2 mobile sequentially with one worker against `vyapti_vschool_test`; all 64 migrations were applied with none pending. The first focused assertion incorrectly rejected the page's legitimate password-recovery policy text and was narrowed to the actual sensitive fields. A second assertion expected an alert role where the success component correctly exposes status; it was aligned with the accessible role. Before the focused run, a positional `--` caused the repository wrapper to enumerate the full suite; it was interrupted after one unrelated test, and no result from that run is used as LEA-46 evidence.

## Direct visual inspection

The approved dialog and production session/confirmation states were opened and compared directly at 1440×1000 and 390×844. The production page uses the established Principal shell and a compact staged card. Labels, action hierarchy, focus target, safe session facts and mobile stacking are clear, with no viewport overflow found.

- Desktop: [approved reference](reference-chromium.png), [session list](application-sessions-chromium.png), [confirmation](application-confirm-chromium.png).
- Mobile: [approved reference](reference-mobile.png), [session list](application-sessions-mobile.png), [confirmation](application-confirm-mobile.png).

The reference also requires approved preferences and school support. Their allowed keys, persistence/portability rules and authoritative support configuration source do not exist in the current owner contracts. They remain capability gaps rather than dead controls. Exact font portability, native VoiceOver/NVDA, TEN-03, production controls and human acceptance remain pending.
