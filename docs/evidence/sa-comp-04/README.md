# SA-COMP-04 verification

Workflow SA-20 is implementation VERIFIED at `d3059ada9f82efe289dc0dcfe02fdc2825195796`; human review is PENDING.

The school administrator can correct the display name of a Student's exclusive institution Person from the protected Student detail page. People owns normalized name validation, the Person version compare-and-swap and immutable `PersonNameRevision`; Students owns the selected branch Student, current `student.manage` authorization, exclusivity proof and command evidence. A Person referenced by any Employee or another institution Student fails with `PERSON_SHARED`. The command retains the account → Organization → School → Person lock sequence, uses SERIALIZABLE isolation, supports exact replay, and records no names or user reason in receipt, audit diff or outbox.

Persistence:

- Forward migration `20261010009000_person_name_revisions` applied to both `vyapti_vschool` and `vyapti_vschool_test` without reset or backfill mutation. Both report 32 migrations.
- The new People-owned, INSTITUTION-scoped table has composite Person/School references, actor reference, unique Person version, history index, validation checks and an append-only trigger. TEN-03 RLS enforcement remains deferred under the recorded Path A contract.
- The broad real-PostgreSQL checkpoint passed 110/110 tests across 16 files. The final focused Students run passed 12/12 and covers correction, replay, stale version, current permission, shared Employee denial, immutable history, PII-free evidence, enlisted rollback and correction-versus-registration serialization across two branches.

Automated checks:

- `pnpm check` passed: lint, TypeScript, documentation, 52-table database design, extraction boundaries, portable backend compilation and 117/117 unit tests.
- Focused Playwright correction journey passed 2/2 on desktop Chromium and 390px mobile after correcting a test locator from alert to status. The preceding full Students file run passed four existing cases and exposed only that locator mismatch in the new case; product state in both traces contained the expected stale comparison.
- The browser journey uses the real API and database, saves and reloads immutable history, forces a stale Person version, shows attempted/current values, and checks page-level overflow.
- Guarded `pnpm demo:seed` completed against local `vyapti_vschool`, preserved every existing credential and fixture, and retained the connected 6 October attendance walkthrough. Existing exclusive fictional Students provide the correction demo; no record was overwritten to manufacture a correction.

Rendered inspection:

- [Desktop name correction](name-correction-chromium.png)
- [Mobile name correction](name-correction-mobile.png)

The desktop composition keeps the correction card at the established Student content width with aligned fields and a bounded history table. Mobile stacks the fields and keeps the history table inside its scroll container. Full-page desktop capture repeats fixed portal chrome, an existing capture artifact; the tested viewport has no page-level horizontal overflow.

Manual review remains PENDING. Open a seeded Student detail, change a misspelled first or last name, enter a reason of at least five characters, and save. Expect the page title and history to show the corrected name while the admission number and enrollment history remain unchanged. A shared staff identity must show identity-steward guidance instead of an editable command.
