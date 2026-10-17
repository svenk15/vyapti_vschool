# F11-C assigned Teacher mark revisions

Engineering source: `4e5f1c1`. Human review: **PENDING**.

## Outcome

An authorized Teacher can open `/teacher/assessments`, see only current `OPEN`/`MARKING` plan items matching the exact dated Teacher assignment, choose one frozen pupil, distinguish numeric zero from absent/excused/not-assessed, review the pinned scale and current version, and save one append-only draft outcome revision. Saving does not moderate or publish a result.

The write runs in the Assessments owner at `SERIALIZABLE` with account → Organization → School → Cycle → outcome-slot locking, expected outcome version, actor-scoped receipt and minimized audit. Exact replay returns the original result; changed payload conflicts. Status lookup returns `UNKNOWN` honestly and rechecks the current assignment before disclosing a result. Revocation blocks writes and receipt disclosure.

No schema change was needed. Development and test databases remain at 100 forward migrations through `20261019000000_assessments_cycle_planning`.

## Verification

- Unit: `pnpm exec vitest run test/unit/assessment-marks.test.ts` — 4/4 passed.
- PostgreSQL: `pnpm test:functional test/functional/assessment-marks.test.ts` — 3/3 passed against `vyapti_vschool_test`; exact assignment, empty unassigned workspace, zero, non-score state, immutable revisions, replay/conflict, stale version, concurrent writers, `UNKNOWN`, protected `FOUND` and revoked assignment were covered.
- TypeScript and focused ESLint passed.
- Normal 4 GiB build passed, ID `JOQrlPRb_fBFqYo3O9Etm`; isolated E2E 4 GiB build passed, ID `FJ8YOcXztSAzKR323EbrI`.
- Playwright, one worker and sequential projects: Chromium 5/5 and mobile 5/5 passed in `test/e2e/principal-assessments.spec.ts`. The Teacher case covers keyboard focus, zero, committed response loss, original-key recovery, one persisted outcome, reload and mobile navigation.
- `pnpm exec tsx scripts/demo-assessments.ts` passed twice without duplicate mark-entry fixtures. The aggregate `pnpm demo:seed` was not rerun because its recorded unchanged LDR-01 blocker remains outside this slice.

One functional command was initially invoked with an extra `--`; the wrapper passed it to Vitest as a separator and unintentionally started the broad suite. It was stopped after an unrelated existing institution-context failure and was not counted as evidence. The corrected focused command above passed.

## Visual comparison

The source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html`, expanded mode at `#/assessments/gradebook/as1`, together with the authoritative TEA-33 two-stage catalogue contract. The HTML overview shows a fictional multi-pupil table; TEA-33 requires **Student outcome → Review before saving**. Production follows that staged contract and shared Teacher shell.

Reference and application captures were directly inspected at 1440×1000 and 390×844. The production form has bounded width, aligned controls, distinct scale guidance, compact actions, correct mobile stacking and no horizontal overflow. Its receipt is a production extension for real owner confirmation and lost-response recovery. Status is `DIRECT_COMPARISON_COMPLETE_WITH_DOCUMENTED_COMPOSITION_MAPPING`, not pixel identity. Font portability and native accessibility remain pending.

- `reference-chromium.png`, `reference-mobile.png`
- `application-entry-chromium.png`, `application-entry-mobile.png`
- `application-receipt-chromium.png`, `application-receipt-mobile.png`

## Manual path

1. Sign in with the fictional Teacher in ignored `artifacts/people-02/private-demo.json`.
2. Open **Assessment marks** and choose **Synthetic Teacher mark entry**.
3. Enter `0`, continue, confirm review and save. Expect **Revision saved** and no publication claim.
4. Choose **Enter another outcome**, select a non-score outcome, and verify the score becomes not applicable.
5. Reload after a save. Expect the persisted current outcome/version from the owner.

Human acceptance, actual browser 200% zoom, VoiceOver/NVDA, TEN-03 and production enablement remain pending.
