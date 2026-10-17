# F10 / LEA-34 — portal acknowledgement reminder evidence

Recorded 17 October 2026. Human review is **PENDING**. Deployment remains **SYNTHETIC_ONLY**; no email or external provider was selected or invoked.

## Outcome

The Principal can open an exact published notice from Notice coverage, review aggregate current audience eligibility, confirm a durable in-app reminder and reload the owner-confirmed receipt. Communication rechecks current purpose and account eligibility before every outcome, suppresses acknowledged/revoked/24-hour/max-three recipients, and stores one replay-safe logical reminder plus per-recipient outcomes. Parent and Student views show only their own durable portal reminder.

## Verification

- Unit: `test/unit/communication-notices.test.ts` — 4/4 passed.
- Real PostgreSQL: `test/functional/communication-notices.test.ts` — 4/4 passed against `vyapti_vschool_test` after 77 migrations. It covers the distinct manager grant, aggregate preview, accepted portal item, exact replay, 24-hour suppression, revoked-purpose suppression, portal projection and denial of protected replay after authority revocation.
- Browser: focused Administrator publication/Parent acknowledgement prerequisite plus Principal reminder/Student portal-item journey — 2/2 Chromium and 2/2 mobile Chromium, sequentially with one worker.
- Repository checks: TypeScript, focused ESLint, `check:backend`, `check:boundaries`, `check:docs`, `check:db-design` and production build passed.
- Migration: `20261017180000_communication_ack_reminders` applied to development and test without reset; each database has 77 applied migrations.

One accidental functional invocation forwarded `--` to Vitest and began the broad suite; it was stopped after an unrelated institution failure. The corrected focused file command passed. An initial browser run served an old isolated E2E build; inspection exposed the stale source. After rebuilding the isolated source, the journey exposed a real initial-focus gap, which was fixed before the passing desktop/mobile runs.

## Direct visual comparison

The approved source is the LEA-34 workflow-explorer dialog in `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`. The production mapping uses recipe W at `/leadership/communication/:noticeId/remind` rather than copying the fictional catalogue dialog. Stage order, aggregate-only semantics, action hierarchy and result language were compared directly at 1440×1000 and 390×844.

- `reference-chromium.png`, `application-review-chromium.png`, `application-receipt-chromium.png`
- `reference-mobile.png`, `application-review-mobile.png`, `application-receipt-mobile.png`

The routed page preserves reload/recovery and current authorization, and the mobile actions stack without clipping or horizontal overflow. The documented font-portability exception remains. Native VoiceOver/NVDA and real browser 200% zoom were not performed.

## Source and private demo data

The captures and checks verified product source `82ed50fcfa59a1886081c732827dcf2dda79a0df`; normal production build ID `nGKFp1wOlN8wl9gcaqMJd`. Private seed values remain only in ignored `artifacts/communication-01/private-demo.json`, `artifacts/leadership-01/private-demo.json` and `artifacts/people-02/private-demo.json`.

The final full `pnpm demo:seed` refresh preserved earlier successful records but stopped at LDR-01 because the existing private People credential no longer authenticated; it did not overwrite the private password or any existing data. The Communication fixture used for verification had already been refreshed successfully at this checkpoint and remains available.
