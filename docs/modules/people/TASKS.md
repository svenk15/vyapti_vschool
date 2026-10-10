# People and staff identity — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## SA-COMP-11 / SA-13 — Classify staff profiles descriptively

Outcome: a School Administrator must choose Teaching, Administration or Support when creating an Employee, sees the saved category in the branch directory, and can make a reasoned versioned correction. Existing Employee rows remain usable as UNCLASSIFIED until explicitly reviewed. Category never changes account access, roles, membership, teaching eligibility or setup responsibility.

Acceptance: People owns the checked field and command; create and correction reauthorize `class.manage` in current scope; invalid/UNCLASSIFIED client input, foreign Employee and stale versions fail closed; replay is stable; receipt/audit/outbox and Employee CAS are atomic; PostgreSQL proves the legacy default and unchanged Teacher/access state; desktop/mobile production pages cover create, display and correction. Add only the forward migration named in DESIGN and extend the non-destructive People demo fixture.

## PER-01 — Create and inspect staff profiles

Depends on: IAM-02

Design: [flow PER-01](DESIGN.md). Scope and API: POST /api/v1/employees; GET /api/v1/employees.

### Implementation instructions

1. Authorize school staff management through class.manage; acquire guards.
2. Validate identity fields and staff number; do not infer Person equality from contact.
3. Create Person through People factory (or resolve explicitly approved scoped existing Person), then Employee in one transaction.
4. Persist event/audit/receipt; add AccountPersonBinding table now Person exists, but do not bind automatically.
5. Read staff list via scoped Employee/Person join; display profile and portal status separately.

Files: extend `backend/modules/people/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/people`, `test/functional/people` and `test/e2e/people` as the suite grows.

### Acceptance and test strategy

- Unit / application: Human name and employment interval validation.
- Real PostgreSQL: Atomic Person/Employee rollback; scoped FK; duplicate staff race and same-name nonmerge.
- Browser: Create teacher staff record without login and refresh list.
- Failure contract: Staff number duplicate→409; foreign Person→404; invalid dates/contact→422.
- Required DB effect: Person, Employee and shared envelopes; migration for AccountPersonBinding scoped foreign key.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Create a synthetic staff profile; see Not linked to account; create a second same-name person with another staff number and verify they remain separate.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## SA-COMP-04 — People-owned student name correction

Depends on: STU-01

Implement only the exclusive Student Person correction defined in DESIGN. Add the append-only People name revision table by forward migration, extend the transaction-neutral Person identity port, and let Students provide exact scoped selection/authorization in the shared transaction. Require version, reason and stable key; block shared Student/Employee identities. Verify populated migration, scope, replay, stale comparison, rollback and desktop/mobile persistence. Keep shared identity-steward maintenance outside the school-admin UI.

## Experience overlay consumption

EX-06 adopts staff profile, account-link and teacher-readiness screens through the current People, Access and Academics owner ports. Profile, account, membership and teaching eligibility remain separate states; contact email never substitutes for the verified binding procedure.

## PER-02 — Enable teaching eligibility and verified account binding

Depends on: PER-01, IAM-03, ACA-01

Dependency rule: PER-01, ACA-01 and IAM-03 implementations must be VERIFIED before PER-02 begins. Their human reviews may remain PENDING under the current Phase 1 execution policy; IAM-03 human acceptance is not a prerequisite. Keep PER-02's own review PENDING until the owner reviews that demo.

Design: [flow PER-02](DESIGN.md). Scope and API: POST /api/v1/employees/:id/teacher-profile; POST /api/v1/employees/:id/account-binding; PATCH /api/v1/employees/:id/end.

### Implementation instructions

1. Discover actor/target account IDs, acquire sorted account locks then School; resolve actor.
2. Resolve scoped Employee/Person, membership and explicit verified account; account email equality is not proof.
3. Create Teacher through academic facade; bind through access facade, each in the same owner-enlisted transaction.
4. End employment only for the current school-local date; mark the Employee ENDED and disable Teacher atomically. Assignment/session impact guards are owned by later ACA-03/ATT-01 workflows, whose tables are not installed yet.
5. Persist only owning-module changes and envelopes; present eligibility and account badges.

Files: extend `backend/modules/people/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/people`, `test/functional/people` and `test/e2e/people` as the suite grows.

### Acceptance and test strategy

- Unit / application: Verified binding and eligibility policy.
- Real PostgreSQL: Scoped Teacher FK/uniqueness; verified same-branch account binding and wrong-account rejection; binding uniqueness race; whole multi-owner rollback; same-day offboarding CAS and immediate Teacher disable.
- Browser: Enable teacher eligibility, link a verified active teacher account, show both statuses after refresh, reject a conflicting binding, and end employment today with eligibility disabled.
- Failure contract: Account/person already differently bound or missing active same-branch TEACHER membership→409; foreign employee→404; stale version→409; invalid/non-today end date→422. Future assignment/session conflicts are verified by their owning tasks.
- Required DB effect: Teacher (academic facade), AccountPersonBinding (access facade), Employee end/status if safe; audit/outbox/receipt.
- Persistence/security gate: use existing AccountPersonBinding uniqueness/scoped Person FK, sorted account→Organization→School locks, current `user.manage`, explicit out-of-band verification reference and cross-owner rollback. No login email or IAM activation substitutes for person verification. Under TEN-ADR-006 Path A, record class/scope/policy intent and TEN-03 closure for any new tenant table; do not retrofit Access tables or enable broad RLS in PER-02.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Run `pnpm demo:seed`; the PER-02 seed creates an isolated synthetic school, two unbound staff profiles and an active, email-verified teacher account through the Access invitation/local-mail-sink flow. It writes admin/teacher credentials and account/profile IDs to ignored mode-0600 `artifacts/people-02/private-demo.json`. Run `pnpm build`, then `pnpm demo:task PER-02 3421 <tested-commit> academic_core`.

1. Open `http://127.0.0.1:3421/sign-in` and use the administrator credentials in the private demo file; open `/admin/teachers`. Expect Avery and Jordan's synthetic profiles, both unlinked and not yet teaching-eligible.
2. Enable teaching for Avery. Expect ENABLED; refresh and confirm it persists.
3. On Avery, bind the `teacherAccountId` from the private demo file with an out-of-band verification reference and reason. Expect active portal access. Try binding that same account to Jordan; expect a safe conflict and no second binding.
4. End Avery's employment using today's displayed school-local date. Expect ENDED and teaching eligibility DISABLED after refresh.
5. Sign out, sign in with the synthetic teacher credentials, then open `/admin/teachers`. Expect the server-side staff-profile access-denied state.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
