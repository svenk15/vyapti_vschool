# School scope, authentication and permissions — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## IAM-01 — Provision a school and sign in as its administrator

Depends on: FND-01, DS-01

Design: [flow IAM-01](DESIGN.md). Scope and API: Restricted operator CLI provision-school; POST /api/auth/*; GET /admin.

### Implementation instructions

1. Add planned access tables except Person binding until PER-01; add shared audit/outbox/receipt migrations and immutable guards.
2. Provision transaction creates organization/school/account/membership/admin grant and audit/outbox; CLI refuses duplicate school/email without explicit recovery. Operator is a distinct audited provisioning principal.
3. Pin auth dependencies; validate input, check account lockout and bcrypt credential, issue secure session through provider.
4. Resolve current account tokenVersion and school membership on each admin request.
5. Render a minimal authenticated school home with sign-out and setup link; no feature statistics yet.

Files: extend `backend/modules/access/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/access`, `test/functional/access` and `test/e2e/access` as the suite grows.

### Acceptance and test strategy

- Unit / application: Capability map; input normalization; disabled/stale-token actor.
- Real PostgreSQL: Provision rollback; unique email race; concurrent lockout; session revoked after tokenVersion bump.
- Browser: Sign in/out; denied admin route when logged out; other-school resource denied.
- Failure contract: Duplicate email/school → explicit conflict with no partial school; invalid zone → validation; wrong password/lockout/disabled → same generic public error.
- Required DB effect: Organization, School, UserAccount, SchoolMembership, RoleGrant; AuditEntry and OutboxEvent for provisioning; AuthSecurityEvent for login/security facts. Bootstrap audit uses created admin account + explicit operator provenance field in safe payload; never impersonates an interactive login.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Provision a synthetic school; sign in; see its name/timezone; sign out; verify the protected home redirects to sign-in.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## IAM-02 — Manage school settings and staff access

Depends on: IAM-01

Design: [flow IAM-02](DESIGN.md). Scope and API: PATCH /api/v1/school; POST /api/v1/campuses; POST /api/v1/memberships; PATCH /api/v1/memberships/:id.

### Implementation instructions

1. Resolve actor; pre-read target account IDs, lock account rows sorted then current School guard.
2. Re-read membership, target and organization/school status; require user.manage or school.manage.
3. Authorize receipt replay; enforce assignable roles, scope and last-active-admin invariant.
4. Persist versioned settings/campus/membership/grants; pending new accounts receive a separate single-use activation record via operator action.
5. Return safe updated DTO and append audit/outbox/receipt atomically.

Files: extend `backend/modules/access/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/access`, `test/functional/access` and `test/e2e/access` as the suite grows.

### Acceptance and test strategy

- Unit / application: Last admin transition; fixed roles; timezone policy.
- Real PostgreSQL: Two admin revocations serialize; forged cross-school grants fail constraints; failed audit rolls settings back.
- Browser: Create staff access, suspend/reinstate; verify protected request denied immediately.
- Failure contract: Last admin removal → 409 LAST_ADMIN; stale update → 409; changing timezone after any session → 409 TIMEZONE_IN_USE; foreign target → 404.
- Required DB effect: School/Campus or SchoolMembership/RoleGrant/UserAccount(PENDING); audit/outbox/receipt; activation only through explicit operator command, never automatic message send.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Create a synthetic teacher membership; inspect Pending; activate through approved local operator flow; suspend it and confirm the next request is denied; attempt removal of the last admin.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## IAM-03 — Activate and recover staff accounts safely

Depends on: IAM-02

Design: [flow IAM-03](DESIGN.md). Scope and API: POST /api/v1/activate; restricted operator recover-account CLI.

### Implementation instructions

1. Operator verifies intended person outside the software and records a non-sensitive case reference; create/revoke activation under account lock.
2. Activation endpoint hashes token, checks expiry/consumption and account under lock; rate-limit both account/IP attempts without exposing token existence.
3. Hash password outside long school transactions; recheck token validity before commit.
4. Consume token atomically, activate intended pending memberships and bump tokenVersion; lock affected schools sorted when changing membership.
5. Recovery revokes old activation tokens/sessions; user sets password through a fresh one-time activation; append security evidence.

Files: extend `backend/modules/access/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/access`, `test/functional/access` and `test/e2e/access` as the suite grows.

### Acceptance and test strategy

- Unit / application: Token expiry boundary; password byte limits; verification case required.
- Real PostgreSQL: Concurrent redemption only once; token never plaintext; recovery revokes old sessions in every affected school.
- Browser: Paste activation token, set password, sign in; replay fails; recovery invalidates old session.
- Failure contract: Expired/reused/revoked token → generic invalid activation; existing bound account mismatch → denied; replay cannot reset password twice.
- Required DB effect: AccountActivation, UserAccount, intended pending SchoolMembership rows, AuthSecurityEvent; per-school audit/outbox for membership activation.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Activate a new synthetic teacher; show successful sign-in; retry the same token and confirm failure; recover the account and verify the old session is rejected.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
