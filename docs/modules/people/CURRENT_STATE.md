# People and staff identity — current state

Last updated: 2026-10-04. Human review is tracked separately from implementation evidence. No imported completion or active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| PER-01 | VERIFIED | PENDING | [Local verification](../../evidence/people-01-local/verification.json), JUnit reports, source `45ca6d6` |
| PER-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

**Design readiness (4 October 2026):** PER-02 LLD/task clarify owner-enlisted Teacher/AccountPersonBinding writes, scoped uniqueness, account→Organization→School locking and explicit out-of-band school-admin verification reference; account email or activation alone is not proof. No implementation started. Execution remains explicitly gated on PER-01, ACA-01 and IAM-03 human acceptance.

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

PER-01 does not create a login or account binding and does not make the employee eligible to teach. PER-02 remains unstarted. Following the updated owner execution request, reconcile the IAM-04 task sequence and contract next; IAM-02, IAM-03 and TEN-02 are already implemented, while IAM-03 and TEN-02 human reviews remain PENDING. Keep PER-01 review PENDING until explicit feedback; proceed without waiting unless a documented acceptance dependency requires it.
