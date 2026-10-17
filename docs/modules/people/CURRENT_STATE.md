# People and staff identity — current state

Last updated: 2026-10-17. Human review is tracked separately from implementation evidence. No imported completion or active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| PER-01 | VERIFIED | PENDING | [Local verification](../../evidence/people-01-local/verification.json), JUnit reports, source `45ca6d6` |
| PER-02 | VERIFIED | PENDING | [Local verification](../../evidence/people-02-local/verification.json), JUnit reports, tested source `e72125d` |

## F07-A / LEA-23 safe operational availability — 17 October 2026

Implementation is ENGINEERING_COMPLETE at `F07_PRODUCT_COMMIT`; human review remains PENDING. The People owner now provides separately designated recorder authority, branch-timezone bounded safe availability intervals, immutable expected-version revisions, exact-payload recovery, a safe Principal projection and a minimal `BUSY`/`FREE`/`UNKNOWN` cross-branch collision port. Private leave, payroll and medical narratives are excluded from the stored command contract and Principal response. Default dates use the selected branch timezone and invalid normalized calendar dates fail validation.

Forward migration `20261017200000_people_operational_availability` is applied to development and test (80 migrations each). The three new People tables are registered under TEN-ADR-006 Path A; application authorization remains active and TEN-03 RLS verification is still a production gate. Focused unit 4/4, real-PostgreSQL functional 2/2, database-design/backend/boundary/type checks, current-source Chromium 2/2 and mobile 2/2 passed. `pnpm demo:seed` added or preserved fictional availability without changing credentials or manual records. [Evidence](../../evidence/principal-f07-availability-2026-10-17/README.md).

F07 remains PARTIAL: D09 exact-occurrence cover approval, substitute acceptance, fresh collision/eligibility checks and Attendance-safe activation have not been implemented. No open/submitted Attendance reassignment is implied.

## Current checkpoint

**Administrator account display projection (10 October 2026):** People now exposes a read-only current-account display-name query through its existing portable facade and Prisma adapter. It returns an active scoped Employee name only for an already verified AccountPersonBinding and rechecks live account/token, organization, branch and membership context. It creates no binding and does not grant a role. The synthetic administrator has no accepted binding, so the portal truthfully falls back to “School administrator”; bound teacher coverage is included in the focused People PostgreSQL test. No schema or migration changed. [Dashboard evidence](../../evidence/admin-today-2026-10-10/README.md); human review PENDING.

**SA-COMP-04 / SA-20 — exclusive Student Person name correction (10 October 2026):** implementation VERIFIED at `d3059ada9f82efe289dc0dcfe02fdc2825195796`; human review PENDING. The approved school-administrator exception to PER-ADR-002 applies only when the selected branch Student is the Person's sole Student reference in the institution and no Employee references that Person. People owns normalization, Person CAS and immutable name history; Students owns branch selection, `student.manage`, exclusivity and the command envelope. Shared identities return `PERSON_SHARED` without record counts or foreign-branch detail. Forward migration `20261010009000_person_name_revisions` is applied to both designated databases and preserves existing Person rows. Path A table classification is recorded; TEN-03 RLS remains incomplete. `pnpm check` passed with 117 unit tests; the broad real-PostgreSQL checkpoint passed 110/110 and final focused Students passed 12/12; focused desktop/mobile Playwright passed 2/2. Guarded `pnpm demo:seed` passed without replacing fixtures. [Evidence](../../evidence/sa-comp-04/README.md).

**EX-06 presentation adoption (10 October 2026):** Implementation VERIFIED at `42dd2db48ecbe80ee908f167d00d60aeb662bcd1`; human review PENDING. `/admin/teachers` now separates profile creation from the full-width staff directory and uses per-record dialogs for verified account binding and employment end. Existing People/Academics/Access ownership, out-of-band identity verification, scoped authorization, locking, versions and idempotency are unchanged. Focused People/Access PostgreSQL tests passed 16/16; final desktop/mobile People browser journeys passed 2/2. No schema, migration or seed changed. Evidence: `docs/evidence/ex-06/README.md`.

**Design readiness (4 October 2026):** PER-02 LLD/task clarify owner-enlisted Teacher/AccountPersonBinding writes, scoped uniqueness, account→Organization→School locking and explicit out-of-band school-admin verification reference; account email or activation alone is not proof. At that review, the dated dependency snapshot was PER-01 VERIFIED/PENDING, IAM-03 VERIFIED/PENDING, ACA-01 VERIFIED/PENDING. PER-01 and ACA-01 review may remain PENDING. The implementation status table remains authoritative.

**Partial PER-02 work before gate reconciliation (4 October 2026):** Work began before the explicit IAM-03 acceptance gate was noticed. Migration `20261004001400_teacher_eligibility` has been applied to local `vyapti_vschool` and `vyapti_vschool_test`; it creates the Academics-owned, scoped Teacher table under the Path A TEN-03 closure rule. Focused PostgreSQL tests passed 5/5 and PER-02 desktop/mobile Playwright journeys passed 2/2 against the test DB. These are partial-work checks, not a verified task checkpoint. The code and migration are preserved in branch history at WIP commit `d57ae73`; this checkpoint is not task verification or acceptance. No stable PER-02 review demo was prepared. On 5 October, IAM-03's explicit acceptance gate was satisfied for source `e0f262a78d7e020919cd36be80d508c9032d1e07`; PER-02 resumes from its existing code and applied migration without branch switching or database reset.

## PER-02 local verification and running demo — 5 October 2026

Implementation VERIFIED; human acceptance PENDING. Tested source commit: `e72125d4545e48c4b5c69c4ba3c9a646f7eea5d1`; production build ID `M14FdBP2K8Hgq60j29NAE`. The isolated frozen demo is running at http://127.0.0.1:3421 against the guarded development database. Health returned `alive:true`; Chromium smoke verified administrator sign-in, both seeded unbound profiles, the protected employees API (200), teacher sign-in and server-side denial of staff management. No demo records were mutated during smoke verification.

IAM-03's explicit dependency gate is PASSED for accepted source `e0f262a78d7e020919cd36be80d508c9032d1e07`. PER-01 and ACA-01 are VERIFIED; their human reviews remain PENDING as allowed by the dependency contract.

The existing Academics Teacher migration `20261004001400_teacher_eligibility` is applied to both `vyapti_vschool` and `vyapti_vschool_test`; each has 22 applied migrations and no pending migrations. This PER-02 checkpoint adds no schema migration. The Teacher table remains Academics-owned, scope-keyed and protected by its documented composite foreign key and uniqueness constraints. `pnpm check:db-design` reports 51 registered table contracts consistent with Prisma and the LLD.

Database enforcement distinction: application authorization remains active on every protected read/write. Real PostgreSQL tests verify current `class.manage` and `user.manage`, account status/version, branch membership, same-branch active TEACHER membership, module entitlement and branch activation. A read-only development-role check found no restricted runtime role among the documented names, and `vs_academics_teacher` has RLS disabled. Under TEN-ADR-006 Path A, database RLS enforcement remains planned for TEN-03; no restricted-role or RLS enforcement is claimed here.

`pnpm demo:seed` completed using the local development guard and file-only mail sink. It created a separate synthetic school, two unbound employee profiles and an active, email-verified teacher account through the existing Access invitation and acceptance use cases. Repeated PER-02 seeding reuses the private command keys and does not duplicate those records. Credentials/account IDs are in ignored mode-0600 `artifacts/people-02/private-demo.json`; invitation tokens remain in the ignored local `artifacts/mail-sink/` directory and are not printed. No real message was sent.

Checks on this checkpoint:

- `pnpm check` passed: lint, TypeScript, documentation, 51-table database design, extraction boundaries, backend compilation and 84 unit tests. [JUnit](../../evidence/people-02-local/unit.junit.xml).
- `pnpm test:functional` passed 90 tests across 14 files against real PostgreSQL `vyapti_vschool_test`. PER-02 specifically verifies owner writes followed by injected rollback, binding uniqueness race, inactive/unverified/wrong-branch account rejection, permission denial, scoped Teacher and binding writes, and same-day offboarding. [JUnit](../../evidence/people-02-local/functional.junit.xml).
- `pnpm test:e2e test/e2e/people-employees.spec.ts` passed 2 desktop/mobile Chromium journeys for profile creation, eligibility, verified binding, conflict feedback, offboarding, persistence and layout. [JUnit](../../evidence/people-02-local/e2e.junit.xml).
- `pnpm build` passed. The protected employee, teacher-profile, account-binding and end-employment routes were included in the production build.
- `pnpm demo:seed` passed; read-only browser smokes verified the live admin and teacher paths. The focused commit contains only PER-02 checkpoint, seed and verification additions; unrelated untracked workspace files remain untouched.

Manual review (PENDING):

1. Open http://127.0.0.1:3421/sign-in and use the administrator email/password in `artifacts/people-02/private-demo.json`; then open `/admin/teachers`. Expect Avery and Jordan's synthetic profiles, both unlinked and not teaching-eligible.
2. Enable teaching for Avery. Expect ENABLED; refresh and confirm it persists.
3. Bind `teacherAccountId` from the private file to Avery using an out-of-band verification reference and reason. Expect active portal access. Try the same account on Jordan; expect a safe conflict and no second binding.
4. End Avery's employment using today's displayed school-local date. Expect ENDED and teaching eligibility DISABLED after refresh.
5. Sign out, sign in with the synthetic teacher credentials, then open `/admin/teachers`. Expect the server-side staff-profile access-denied state.

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

PER-01 does not create a login or account binding and does not make the employee eligible to teach. PER-02 implementation is VERIFIED; its human review remains PENDING for source `e72125d4545e48c4b5c69c4ba3c9a646f7eea5d1`. IAM-03 human acceptance was recorded on 5 October for the exact reviewed source `e0f262a78d7e020919cd36be80d508c9032d1e07`; this satisfies PER-02's explicit acceptance gate. ACA-03 and ATT-01 now provide assignment/session impact guards; restricted runtime RLS enforcement remains TEN-03. PER-01 and ACA-01 human reviews remain PENDING and are not PER-02 acceptance gates. Next action is `pnpm next-task` after ATT-01's implementation checkpoint.

### SA-COMP-11 / SA-13 staff category — 10 October 2026

SA-13 is implementation-VERIFIED with human review PENDING. Employee creation requires Teaching, Administration or Support; existing rows were preserved as UNCLASSIFIED by forward migration `20261010013000_employee_staff_category`; the branch directory displays category and provides a reasoned versioned correction. Category remains descriptive and does not alter Access or Academics state. The migration is applied to `vyapti_vschool` and `vyapti_vschool_test` (36 applied migrations each). Focused unit and 10-case PostgreSQL People checks passed; desktop and mobile production-build journeys passed after correcting an ambiguous test locator. `pnpm demo:seed` passed twice and added one fictional categorized support profile without changing existing staff. Evidence: [SA-COMP-11](../../evidence/sa-comp-11/README.md). TEN-03 and native accessibility gates remain; no production readiness is claimed.

### SA-13 direct reference composition — 11 October 2026

SA-13 remains functionally VERIFIED and human review PENDING. `/admin/teachers/create` now composes the existing scoped People command as the approved three-stage Staff details → Employment → Confirm workflow, with a persisted receipt and links into Staff profiles and SA-14. The existing directory creation surface remains available. No People contract, table or migration changed. The combined Staff/access desktop and mobile journey creates the real Employee and continues through identity-bound access, activation and membership changes. Screenshots were inspected against the exact SA-13 reference. Evidence: [Administrator Staff/access checkpoint](../../evidence/admin-staff-access-2026-10-11/README.md).
