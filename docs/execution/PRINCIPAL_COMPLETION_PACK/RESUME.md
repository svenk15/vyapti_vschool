# Programme resume

Task/subtask: F10 is **IN_PROGRESS**. LEA-34 is ENGINEERING_COMPLETE for D13's synthetic-only portal-reminder outcome. The exact next action is the remaining independent author/reviewer/publisher slice for LEA-33: reconcile the current direct publication command, finalize the narrow exact-revision review lifecycle in the Communication LLD, and implement it without weakening the verified publication, withdrawal or reminder paths.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, or invented emergency procedures. Human acceptance remains separate and PENDING.

Current matrix: 16 ENGINEERING_COMPLETE, six PARTIAL and 24 NOT_STARTED. Human review remains PENDING for all 46 Principal workflows.

Current verified product source: `82ed50fcfa59a1886081c732827dcf2dda79a0df`. Normal production build `nGKFp1wOlN8wl9gcaqMJd` and the focused isolated desktop/mobile browser builds passed for that application source.

Development migrations / test migrations: 77 applied and none pending in each database. Latest migration is `20261017180000_communication_ack_reminders`. It adds Path A Communication reminder-manager grants, logical reminders and per-recipient outcomes with scoped keys and suppression constraints; no applied history was rewritten.

LEA-34 outcome: exact current publication/version preview; aggregate-only Principal audience counts; separate operator-designated reminder manager; current exact purpose/account reauthorization; acknowledged/revoked/24-hour/max-three suppression; durable portal item and per-recipient outcome; exact replay without duplicate accepted items; protected replay denied after authority revocation; Parent/Student own-item projection. No email/provider delivery is simulated.

Verification: Communication unit 4/4; real-PostgreSQL Communication 4/4; TypeScript; focused ESLint; backend, boundaries, docs and 114-table database design; normal production build; sequential one-worker focused browser journey 2/2 Chromium and 2/2 mobile Chromium. Screenshots were directly inspected at 1440×1000 and 390×844. An initial stale isolated build and then a real initial-focus defect were diagnosed and superseded by the passing current-source runs.

Evidence: `docs/evidence/principal-f10-communication-reminder-2026-10-17/README.md`. Private credentials remain in ignored `artifacts/communication-01/private-demo.json`, `artifacts/leadership-01/private-demo.json` and `artifacts/people-02/private-demo.json`.

Seed state: the Communication fixture used by the checks was refreshed successfully. A later full `pnpm demo:seed` run preserved all prior data but stopped at LDR-01 because the existing private People credential no longer authenticated. It did not overwrite that credential or existing records; resolve the private credential drift before claiming a fresh complete seed run.

Pending gates: human review, font portability, native VoiceOver/NVDA, TEN-03, provider/restore/load review and production enablement. Do not mark these passed.
