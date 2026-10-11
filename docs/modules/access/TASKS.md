# School scope, authentication and permissions — execution tasks

## SA-01 — Sign in and choose an authorized workspace

Presentation overlay on IAM-01 and TEN-01. Successful sign-in must route through an explicit branch selection when more than one current selectable branch exists; one branch skips the chooser. Use the existing context directory and guarded switch command. Preserve generic credential errors, allowlisted return paths, branch exclusion, session revocation and role-appropriate `/account` resolution. Verify retained in-flow selection, final-only context switch, responsive reference comparison and focused multi-branch PostgreSQL-backed browser behavior. No schema or migration is authorized by this slice.

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## IAM-01 — Provision a school and sign in as its administrator

Depends on: FND-01, DS-01

Design: [flow IAM-01](DESIGN.md). Scope and API: Restricted operator CLI provision-school; POST /api/auth/*; GET /admin.

### Implementation instructions

1. Add Organization, School, UserAccount, SchoolMembership, RoleGrant and AuthSecurityEvent; add shared audit/outbox/receipt migrations and immutable guards. Campus belongs to IAM-02, AccountActivation to IAM-03, Person binding to PER-01 and InstitutionGrant to TEN-01; do not install speculative tables.
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

## Experience overlay consumption

EX-04 adopts current sign-in/account behavior, EX-05 maps school settings, and EX-06 maps membership/invitation access. These are presentation slices over the existing Access facades and do not add roles, trust paths or browser operator authority. Use [the reconciled live contracts](../../execution/CONTRACT_DIFF.md); retain all token-version, recovery, membership and generic-failure rules above.

## IAM-04 — Institution trust modes, email invitations and password recovery

Depends on: IAM-02, IAM-03, TEN-02

Design: [IAM-ADR-008 and IAM-04 flow](DESIGN.md); [TEN-ADR-005 trust-mode transition](../tenancy/DESIGN.md). This task updates the existing implementation plan and does not replace operator-issued IAM-02/IAM-03 flows.

### Implementation instructions

1. Add `Organization.trustMode` with database default and explicit existing-row backfill to `OPERATOR_CLI`; Access/Institution creation use cases explicitly select `HYBRID` for newly created institutions after this task ships.
2. Add Access-owned `vs_access_invite` and `vs_access_password_reset_token`, plus the required verified-email and structured security-evidence columns. Hash high-entropy tokens; only `SENT` tokens can be consumed. Preserve all applied migrations and rows.
3. Keep `OPERATOR_CLI` invitations/resets disabled. In `HYBRID`/`EMAIL`, allow current school administrators to invite staff and authorized resend. Reuse pending accounts/memberships; preserve credentials/status for existing active accounts; never bind a Person or enable teaching on acceptance.
4. Implement the portable email sender port and development-only private mail sink. Do not send real email. Persist issuance plus evidence, send outside transactions, then persist `SENT`/`FAILED`; late results cannot revive a revoked token.
5. Implement an account-wide recovery evaluator. Include active branch memberships and active `InstitutionGrant` access without membership. Any `OPERATOR_CLI` institution denies email reset. Require an active eligible account and a previously verified login address; never accept a replacement address.
6. At reset consumption, re-evaluate all current applicable access under the serialization guard. Atomically consume one sent token, update the global password, bump `tokenVersion`, revoke other account reset tokens, preserve all memberships/roles and do not sign in.
7. Implement platform-operator `setTrustMode`; institution administrators cannot change it. A transition to `OPERATOR_CLI` revokes the organization's open email invitations and all outstanding email reset tokens for its applicable accounts across every issuer. Preserve AccountActivation tokens. Enlist Access token invalidation inside the Tenancy configuration unit of work.
8. Add trust-aware staff-add/resend UI, invitation acceptance, forgot-password and `/reset-password` with generic public feedback, no-store/referrer protection, accessible loading/success/failure/expired/revoked/used states, and current authorization checks.

### Acceptance and test strategy

- Unit: trust-mode policy; account-wide recovery evaluator; generic-result contract; token expiry/state; safe provider reason mapping; no Person binding on invitation.
- Real PostgreSQL: legacy backfill remains `OPERATOR_CLI`; new organizations explicitly `HYBRID`; existing active-account invite does not change password/status; membership and InstitutionGrant policy joins; stricter policy between issue/consume; institution B tightening revokes a reset issued through A; admin trust-mode denial; delivery pending/failed denial; resend revocation; transaction rollback; exactly one concurrent consume; consume vs trust/access changes follows the lock contract.
- Browser: all three modes; operator flows remain usable; invitation failure and authorized resend; accept invitation with inviter/scope/grants revalidation; generic forgot-password behavior; reset failure states; successful reset invalidates sessions across institutions and preserves roles/memberships.
- Prove no token plaintext in DB, logs, audit, HTTP responses or committed artifacts. Real email is not authorized; use only the private development sink.

Run `pnpm check`, real-PostgreSQL `pnpm test:functional`, full desktop/mobile `pnpm test:e2e`, and `pnpm build`. Add the forward migration to both designated databases; do not reset/reseed. Capture safe JUnit XML, migration/schema status, source commit and frozen build identity.

### Demo and checkpoint

With a synthetic institution in HYBRID, invite a new staff email, show delivery state in the private local sink, accept it and sign in. Invite an existing active account and prove its password/session and global account status remain unchanged while its new membership is activated. Cause a synthetic delivery failure, inspect the sanitized admin message and resend. Request and consume a password reset, then prove the prior session fails. Change the institution to OPERATOR_CLI with the local platform-operator CLI; show prior email invitations/resets remain revoked and operator activation/recovery still works. Do not use real addresses or deliver email externally.

Start/check a frozen local demo, report URL and tested source commit, give exact steps, record human review PENDING and continue without waiting unless a documented acceptance dependency or blocking verification issue applies. Do not mark acceptance passed without explicit owner feedback.

### SA-COMP-03 / SA-15 closure

Reuse the implemented IAM-04 invitation owner contract without schema or business-policy changes. Prove in the real administrator screen that a development-sink delivery failure shows only the allowlisted reason and timestamp, the authorized resend action creates a distinct replacement invitation, and the prior token is revoked before the replacement delivery result is stored. Verify desktop and mobile, current branch isolation, and no token disclosure. Keep production-provider review as an outstanding release gate.

## IAM-02 — Manage school settings and staff access

Depends on: IAM-01

Design: [flow IAM-02](DESIGN.md). Scope and API: PATCH /api/v1/school; POST /api/v1/campuses; POST /api/v1/memberships; PATCH /api/v1/memberships/:id.

### Implementation instructions

1. Resolve actor; pre-read target account IDs, lock account rows sorted then current School guard.
2. Re-read membership, target and organization/school status; require user.manage or school.manage.
3. Authorize receipt replay; enforce assignable roles, scope and last-active-admin invariant.
4. Persist versioned settings/campus/membership/grants; new accounts remain PENDING without credentials; IAM-03 provides the separate verified operator activation action.
5. Return safe updated DTO and append audit/outbox/receipt atomically.

Files: extend `backend/modules/access/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/access`, `test/functional/access` and `test/e2e/access` as the suite grows.

### Acceptance and test strategy

- Unit / application: Last admin transition; fixed roles; immutable existing-branch timezone policy.
- Real PostgreSQL: Two admin revocations serialize; forged cross-school grants fail constraints; failed audit rolls settings back.
- Browser: Create staff access, suspend/reinstate; verify protected request denied immediately.
- Failure contract: Last admin removal → 409 LAST_ADMIN; stale update → 409; changing an existing branch timezone → 409 TIMEZONE_IN_USE; foreign target → 404.
- Required DB effect: School/Campus or SchoolMembership/RoleGrant/UserAccount(PENDING); audit/outbox/receipt; activation belongs to IAM-03 through an explicit operator command, never automatic message send.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Create a synthetic teacher membership and inspect Pending. Change its roles/status and inspect persisted results; attempt removal of the last admin. PostgreSQL/Playwright fixtures additionally provide existing active staff to prove immediate suspension/reinstatement enforcement. Owner activation review occurs in IAM-03, which depends on this task.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## SA-COMP-08 / SA-06 — Complete branch office information

Depends on: IAM-02

Outcome: an authorized School Administrator edits the approved branch name, office email, optional phone and address with a required reason; timezone stays read-only. A stale save preserves attempted values and supports current-value comparison before retry.

Contract: [SA-06 branch office profile corrective contract](DESIGN.md#sa-06-branch-office-profile-corrective-contract). Extend `vs_access_school` only through the forward migration; preserve legacy rows as unrecorded rather than guessing values. Audit changed field identifiers and reason without copying office contact/address data. Tests: unit normalization/validation; real PostgreSQL persistence, replay, no-op, stale/unauthorized/rollback and redacted evidence; desktop/mobile save and conflict recovery. Evidence: `docs/evidence/sa-comp-08/README.md`; human review PENDING.

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

## SA-COMP-13 / SA-14 — Grant verified Employee sign-in access

Depends on: SA-13 and the implemented Access invitation/People Employee contracts. Human review remains separate from engineering execution.

Outcome: from Staff access, an authorized administrator selects an exact active Employee, supplies an account email and non-sensitive identity-verification reference, selects fixed branch roles, confirms the scope, and creates a verified Person binding plus pending membership/grants/invitation atomically. Email delivery occurs after commit and reports a sanitized `SENT` or `FAILED` result. Same-key replay cannot send a duplicate invitation.

Contract: [SA-14 verified-Employee access grant contract](DESIGN.md#sa-14-verified-employee-access-grant-contract). No migration. Preserve the operator activation path, current invitation acceptance rules and last-admin safeguards. Test validation and confirmation; real PostgreSQL atomicity, scoped Employee checks, binding/grant conflicts, redacted evidence, replay and failed delivery; desktop/mobile selection, keyboard, empty/denied/error/reload behavior. Evidence: `docs/evidence/sa-comp-13/README.md`; human review PENDING.
