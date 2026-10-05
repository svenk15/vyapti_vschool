# People and staff identity — current state

Last updated: 2026-10-05. Human review is tracked separately from implementation evidence. No imported completion or active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| PER-01 | VERIFIED | PENDING | [Local verification](../../evidence/people-01-local/verification.json), JUnit reports, source `45ca6d6` |
| PER-02 | IN_PROGRESS | PENDING | IAM-03 gate PASSED for accepted source `e0f262a`; PER-02 implementation resumes from preserved WIP |

## Current checkpoint

**Design readiness (4 October 2026):** PER-02 LLD/task clarify owner-enlisted Teacher/AccountPersonBinding writes, scoped uniqueness, account→Organization→School locking and explicit out-of-band school-admin verification reference; account email or activation alone is not proof. Dated dependency snapshot: PER-01 VERIFIED/PENDING, IAM-03 VERIFIED/PENDING, ACA-01 VERIFIED/PENDING. PER-01 and ACA-01 review may remain PENDING. Access CURRENT_STATE explicitly gates PER-02 on IAM-03 human acceptance; the task criteria now state that requirement consistently. The implementation status table remains authoritative.

**Partial PER-02 work before gate reconciliation (4 October 2026):** Work began before the explicit IAM-03 acceptance gate was noticed. Migration `20261004001400_teacher_eligibility` has been applied to local `vyapti_vschool` and `vyapti_vschool_test`; it creates the Academics-owned, scoped Teacher table under the Path A TEN-03 closure rule. Focused PostgreSQL tests passed 5/5 and PER-02 desktop/mobile Playwright journeys passed 2/2 against the test DB. These are partial-work checks, not a verified task checkpoint. The code and migration are preserved in branch history at WIP commit `d57ae73`; this checkpoint is not task verification or acceptance. No stable PER-02 review demo was prepared. On 5 October, IAM-03's explicit acceptance gate was satisfied for source `e0f262a78d7e020919cd36be80d508c9032d1e07`; PER-02 resumes from its existing code and applied migration without branch switching or database reset.

PER-01 creates a distinct organization-local Person and school-scoped Employee record in one guarded transaction. Contact similarity never merges people. Authorized staff see a branch-scoped list and a separate portal-link status. Creating a profile does not create a login, bind an account or enable teaching eligibility. Access owns the `AccountPersonBinding` table; it is installed now with no rows, and only the explicit identity-verified PER-02 flow may add bindings.

## PER-01 verification — 4 October 2026

Source commit: `45ca6d6cf19ba321c814099d405b7581f9bd77e2` (`Implement PER-01 staff profiles`). The frozen production-mode local demo is http://127.0.0.1:3409, build `b13AmUy8w1SEA5TLimWdc`. `verification.json` records the tested revision, observed status probes and database migration state. The existing ACA-02 demo on port 3408 remains untouched.

The forward migration `20261004001100_people_staff_profiles` is applied to development `vyapti_vschool` and test `vyapti_vschool_test`. Each database has 15 successful forward migrations and no pending migrations. The test migration ledger retains two earlier rolled-back attempts; no history or rows were deleted. Prisma schema comparison is empty. The checkpoint has 34 migrated tables. No database reset/reseed or environment overwrite occurred; no dependency was added.

Checks on the tested source:

- `pnpm check` passed: lint, TypeScript, docs, database design, backend boundaries/compile and 67 unit tests. [JUnit](../../evidence/people-01-local/unit.junit.xml).
- `pnpm test:functional` passed 53 tests across 10 files against real PostgreSQL `vyapti_vschool_test`, including atomic rollback, scoped foreign keys, same-name nonmerge, duplicate races, authorization, cursor scope and safe evidence. [JUnit](../../evidence/people-01-local/functional.junit.xml).
- `node scripts/database.mjs e2e` passed all 60 desktop/mobile Playwright journeys on the final run. Two earlier complete attempts exposed intermittent failures in unrelated branding journeys; their isolated reruns and the final full run passed. [JUnit](../../evidence/people-01-local/e2e.junit.xml).
- `pnpm build` passed; production build ID `b13AmUy8w1SEA5TLimWdc`.
- The frozen demo returned live health 200, unauthenticated employee API 401 and protected staff page redirect 307. A synthetic authenticated browser smoke created two distinct same-name profiles, refreshed and confirmed both records plus “Not linked to account”.

Manual review (human acceptance remains PENDING):

1. Open http://127.0.0.1:3409/sign-in and use the existing synthetic credentials in the ignored `artifacts/iam-01/private-demo.json` file. Expect the protected school home.
2. Open `/admin/teachers`. Create two profiles with the same name and different staff numbers. Expect two separate rows, each marked “Not linked to account”.
3. Refresh the page. Expect both rows and statuses to remain.
4. Try the same staff number again. Expect a safe duplicate conflict and no extra row. Try an invalid contact email and expect field validation.

The browser smoke already used two clearly synthetic names/numbers in the development database; the records are retained. No real personal data or credentials are included in committed evidence.

## Limitations and next action

PER-01 does not create a login or account binding and does not make the employee eligible to teach. PER-02 is IN_PROGRESS; its own human review remains PENDING until a PER-02 demo is reviewed. PER-01 and ACA-01 implementation prerequisites are VERIFIED; their human reviews may remain PENDING. Keep their review states unchanged.
