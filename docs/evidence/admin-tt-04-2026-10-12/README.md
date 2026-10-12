# TT-04 immutable timetable publication evidence — 12 October 2026

Source checkpoint: pending focused commit. Human review: **PENDING**. Parent workflow SA-41 remains **PARTIAL** until TT-05 performs the Attendance-owner handoff.

## Contract and reference

Authority is `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/administrator/workflows/SA-41.md`, the coordinated School Administrator timetable LLD/TT-04 task, and `VSchool_School_Admin_Review.html#/flow/SA-41` at **Review & publish**. The prior reference captures remain at [TT-03 reference evidence](../admin-tt-03-2026-10-12/README.md). TT-04 retains the documented font portability deviation; native VoiceOver/NVDA and native browser zoom were not executed.

Publication creates an immutable copied pattern, periods, slots and JSON reproduction snapshot. Applicability is half-open and a successor closes only the predecessor's `effective_until`. The stored 42-day `validated_until` is a bounded validation/reconciliation horizon, not indefinite validity. TT-05 may consume only the immutable snapshot through that horizon and must revalidate before extending it. No Attendance session is created, changed or cancelled by TT-04.

## Verification

- `pnpm check`: passed; lint, TypeScript, docs, database design, backend boundaries/backend compilation and 142 unit tests.
- `pnpm test:functional test/functional/timetable-publication.test.ts`: 3/3 against `vyapti_vschool_test`. Covered authorized publication, current-scope denial, exact replay, changed-payload rejection, dependency-stale rejection, concurrent successor serialization, evidence-failure rollback and database rejection of a published-slot mutation.
- Focused Playwright, one worker and sequential projects: Chromium 1/1 and mobile 1/1. Covered review acknowledgement, stale-review recovery, exact-key lost-response recovery, durable receipt reload and responsive overflow check. TT-01/TT-02 browser regressions passed 2/2 in the initial Chromium run before the focused TT-04 rerun.
- `pnpm build`: passed for final build `6Wjbyb-CtCQuP5toMOCGn`.
- Forward migrations `20261012130000_timetable_publication` through `20261012133000_timetable_publication_insert_guard_clock_fix` are applied to development and test; both contain 45 repository migrations with none pending during the focused runs. The additive guard corrections preserve applied history and authorize the initial immutable child copy by its transaction-local command key without coupling an injected application clock to the PostgreSQL wall clock.
- `pnpm demo:seed`: completed against the designated development database. Existing records and private credentials were preserved; the timetable helper added or preserved its owned immutable publication and explicitly leaves Attendance reconciliation pending. Earlier independent seed refresh warnings were preserved rather than overwritten.

## Direct visual inspection

- [Application review, desktop](review-chromium.png)
- [Application review, mobile](review-mobile.png)
- [Publication receipt, desktop](receipt-chromium.png)
- [Publication receipt, mobile](receipt-mobile.png)

The application and approved reference were inspected for the same review state. The final composition includes scope, effective date, teaching days, lessons, added/edited and removed counts, protected-Attendance notice, explicit acknowledgement, Back/Publish actions, audience list and checks summary. The application intentionally changes the protected-Attendance copy to say reconciliation is pending because TT-05 has not run. The receipt uses an approved shared card/alert pattern because the prototype has no durable server receipt screen. Human visual acceptance remains pending.

## Manual walkthrough

1. Sign in as the synthetic School administrator and open `/admin/timetable`.
2. Save a conflict-free weekly draft, choose **Review conflicts**, and confirm the reference-aligned review facts and checks.
3. Select **I have reviewed this revision and its impact**, then choose **Publish timetable**.
4. Expect an immutable revision receipt and **Attendance reconciliation pending**. Reload the receipt URL; expect the same stored revision rather than a duplicate.
5. Return to the timetable. The editable draft remains separate; existing open/submitted Attendance registers remain unchanged.

Remaining gates: TT-05 Attendance reconciliation, TEN-03, font portability, native accessibility and human review.
