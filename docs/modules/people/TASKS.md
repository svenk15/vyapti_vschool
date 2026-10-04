# People and staff identity — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

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

## PER-02 — Enable teaching eligibility and verified account binding

Depends on: PER-01, IAM-03, ACA-01

Design: [flow PER-02](DESIGN.md). Scope and API: POST /api/v1/employees/:id/teacher-profile; POST /api/v1/employees/:id/account-binding; PATCH /api/v1/employees/:id/end.

### Implementation instructions

1. Discover actor/target account IDs, acquire sorted account locks then School; resolve actor.
2. Resolve scoped Employee/Person, membership and explicit verified account; account email equality is not proof.
3. Create Teacher through academic facade; bind through access facade, each in the same owner-enlisted transaction.
4. For end-employment, query impacted assignments/open/future sessions; reject until reassigned/cancelled under their owner commands.
5. Persist only owning-module changes and envelopes; present eligibility and account badges.

Files: extend `backend/modules/people/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/people`, `test/functional/people` and `test/e2e/people` as the suite grows.

### Acceptance and test strategy

- Unit / application: Verified binding and eligibility policy.
- Real PostgreSQL: Whole multi-owner rollback; binding uniqueness race; offboarding vs attendance submit guard.
- Browser: Bind intended teacher, show teaching eligibility; wrong account conflict; offboarding impact warning.
- Failure contract: Account/person already differently bound→409; foreign membership→404; impacted sessions→409 EMPLOYEE_IN_USE.
- Required DB effect: Teacher (academic facade), AccountPersonBinding (access facade), Employee end/status if safe; audit/outbox/receipt.
- Persistence/security gate: use existing AccountPersonBinding uniqueness/scoped Person FK, sorted account→Organization→School locks, current `user.manage`, explicit out-of-band verification reference and cross-owner rollback. No login email or IAM activation substitutes for person verification. Any new tenant table follows TEN-ADR-006; no Access-wide RLS retrofit occurs in PER-02.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Link activated teacher account to the intended staff profile, create teaching profile, confirm no classes until assignment; attempt a conflicting binding and inspect the explanation.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
