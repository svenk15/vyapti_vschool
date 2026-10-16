# LEA-09, LEA-11 and LEA-15 Coordination evidence

Tested implementation source: commits `616b61a` (`Complete Attendance coordination journeys`) through `351300c` (`Cover Coordination recovery and presentation states`). Evidence was captured across 16–17 October 2026 against the dedicated `vyapti_vschool_test` PostgreSQL database with all 68 migrations applied.

## Authority and comparison

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, exact states LEA-09, LEA-11 and LEA-15.
- Application entries: `/leadership/attendance`, `/leadership/coordination`, `/leadership/coordination/new?sessionId=…&kind=…`, `/leadership/coordination/[id]`, `/admin/coordination` and `/admin/coordination/[id]`.
- The reference is a fictional workflow-detail dialog. The application uses real routed source, staged create/receipt, queue/detail, work and verification compositions in the approved shell. This is directly inspected functional/state fidelity with shared component styling; it is not a claim of pixel-identical dialog composition.
- The reference HTML was opened and captured unchanged. No prototype data or authority was copied into production behavior.

## Screenshots

Reference: `reference-lea-09-{chromium,mobile}.png`, `reference-lea-11-{chromium,mobile}.png`, `reference-lea-15-{chromium,mobile}.png`.

Application: `application-empty-{chromium,mobile}.png`, `application-populated-{chromium,mobile}.png`, `application-create-receipt-{chromium,mobile}.png`, `application-awaiting-{chromium,mobile}.png`, `application-verified-{chromium,mobile}.png`, `application-setup-resolved-{chromium,mobile}.png`.

The final captures were directly inspected for hierarchy, spacing, actions, responsive stacking, long receipt values and horizontal overflow. Mobile navigation focus return is exercised in the browser journey. The documented font exception remains; native VoiceOver/NVDA testing was not performed.

## Verification

- `pnpm test:unit test/unit/coordination-requests.test.ts`: 3/3 passed.
- `pnpm test:functional test/functional/coordination-requests.test.ts`: 7/7 passed against real PostgreSQL.
- `VSCHOOL_E2E=1 pnpm build`: passed and produced the isolated Playwright candidate.
- `VSCHOOL_E2E_BUILT=1 node scripts/database.mjs e2e test/e2e/coordination.spec.ts --project=chromium --workers=1`: 3/3 passed.
- The same command with `--project=mobile`: 3/3 passed.
- `pnpm demo:seed`: passed; rerunning the Coordination seed preserved the six existing examples without duplicates.
- `pnpm typecheck`, focused ESLint, `pnpm check:backend`, `pnpm check:boundaries`, `pnpm check:db-design` and `pnpm check:docs`: passed.
- `pnpm build`: passed for the normal local production candidate.

An earlier command mistakenly passed a literal `--` to `pnpm test:functional`; it began the broad suite and was stopped after one unrelated file passed. That interrupted run is not claimed as suite evidence. The corrected focused command above is the recorded result.

The browser journey directly exercises empty/populated queues, client validation, duplicate-active-request feedback, stale-version recovery with retained values, capability revocation and exact retry after restoration, no eligible assignee, unavailable source, committed-response recovery, submitted, returned and verified states. Backend PostgreSQL evidence remains authoritative for cross-scope constraints, locking, rollback and concurrency.

## Remaining gates

Human review is PENDING. Coordination is synthetic-only until operational-note retention and backup-deletion policy is approved. TEN-03, font portability, native accessibility, production-provider, restore and load gates remain outstanding.
