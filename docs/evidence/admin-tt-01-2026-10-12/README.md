# TT-01 weekly day-pattern checkpoint

Date: 12 October 2026. Human review: **PENDING**.

## Outcome

The Administrator route `/admin/timetable` reads and saves one scoped, versioned weekly day-pattern draft for the selected academic year. Teaching days and ordered lesson/break times are validated; overlapping times are rejected without losing entered values. Save uses an expected version and exact scoped idempotency key. A lost response retains the exact payload/key for retry. Published history is not edited.

The guarded owner path is `route → academic HTTP adapter → server gateway → Academics facade → Prisma timetable repository`. Every read/write rechecks live account/token, active organization/school membership, `timetable.manage`, released modules, institution entitlements and branch activations. Mutations retain account→Organization→School locking and commit the pattern, periods, School revision, audit, outbox and receipt atomically.

Forward migration `20261012090000_timetable_day_patterns` adds `vs_academics_day_pattern` and `vs_academics_day_period`. It is applied to `vyapti_vschool` and `vyapti_vschool_test`; neither database was reset. The Path A TEN-03 classification and closure gate are registered in the LLD and table registry.

## Approved comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`, Administrator planning state **Edit timetable → School day & effective date**.

- [Reference desktop](reference-school-day-chromium.png)
- [Application desktop](application-chromium.png)
- [Reference mobile](reference-school-day-mobile.png)
- [Application mobile](application-mobile.png)

The images were opened and inspected directly. The application aligns teaching-day grouping, compact time inputs, row rhythm, constrained work width and primary-action styling. Visual status is `PARTIAL_REFERENCE_COMPARISON`: the reference's effective date, weekly draft canvas and Review & publish action depend on TT-02+ revision/publication behavior and are absent. The application exposes pattern name, lesson/break kind and add/remove controls required by the accepted TT-01 production contract. The existing font portability deviation remains unchanged.

## Verification

- `pnpm typecheck` — passed after the final UI change.
- `pnpm lint` — passed after the final UI change.
- `pnpm check:backend`, `pnpm check:boundaries`, `pnpm check:db-design` — passed.
- `pnpm test:unit test/unit/timetable-pattern.test.ts` — 2/2 passed; [JUnit](unit.junit.xml).
- `pnpm test:functional test/functional/timetable-pattern.test.ts` — 2/2 passed against real PostgreSQL; [JUnit](functional.junit.xml). It covers create/read/replay/update/stale and changed-input conflict, one-draft enforcement, immutable published history, cross-scope FK rejection, foreign-scope denial and evidence-failure rollback.
- `VSCHOOL_E2E=1 pnpm build` — passed on the final source.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/timetable-pattern.spec.ts --project=chromium --workers=1` — 1/1 passed; [JUnit](e2e-chromium.junit.xml).
- The same command with `--project=mobile` — 1/1 passed sequentially; [JUnit](e2e-mobile.junit.xml).
- `pnpm demo:seed` ran with the designated development-database guard. The timetable helper created or preserved the deterministic synthetic pattern without overwriting manual records. Some older optional seed helpers reported their already-recorded nonfatal conflicts/not-found results; required Admissions and TT-01 seeds succeeded.

One incorrectly forwarded functional-test invocation began broader tests and was stopped before completion; no result from that interrupted run is claimed. One mobile iteration stalled because the test used the wrong drawer close label; the selector was corrected, then the focused mobile journey passed.

The final normal standalone build is served at `http://127.0.0.1:3400`. Health returned ready and an unauthenticated `/admin/timetable` request redirected to `/sign-in`. The local launcher copies the generated static/public assets into the standalone bundle before running its generated server; this corrects the prior incompatible `next start` command without changing application behavior.

## Remaining scope

TT-02 must define and implement the weekly lesson draft, scope joins, conflict preview, effective-date semantics and recovery before those reference elements can be added. TT-03–TT-05 retain immutable publication and idempotent Attendance handoff. SA-41 remains partial. TEN-03 restricted-role/RLS proof, native VoiceOver/NVDA, exact font portability, provider/restore/load gates and human review remain pending.
