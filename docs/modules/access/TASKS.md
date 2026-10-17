# School scope, authentication and permissions — execution tasks

## ACC-01 / STW-44 — own session inventory and selective revocation

Status: VERIFIED on 16 October 2026; human review PENDING. Dependency: STW-01 verified account entry and existing provider-backed sign-in.

Implement the approved Student “Manage my sessions” outcome through an Access-owned global AccountSession root. Create a session before issuing a credential JWT, validate that session on every protected hosting request, list only the current account's bounded privacy-safe sessions, and revoke an own selected session idempotently with redacted security evidence. Keep current-session sign-out separate and preserve account-wide token-version recovery. Prove own/foreign isolation, expiry, selective versus global revocation, concurrent repeat behavior, current-session denial, reload persistence, desktop/mobile composition and keyboard focus. Existing JWTs without a trusted session ID are invalid and must sign in again. Human review remains pending.

The same global self-service directory is consumed by the approved PAR-50 “Other sessions if supported” extension. Parent presentation must not derive authority from a child context: it passes the verified Access account/session principal to the existing list and revoke operations, shows only privacy-safe labels and times, and keeps current-session sign-out and account-wide recovery separate.

## SA-01 — Sign in and choose an authorized workspace

Presentation overlay on IAM-01 and TEN-01. Successful sign-in must route through an explicit branch selection when more than one current selectable branch exists; one branch skips the chooser. Use the existing context directory and guarded switch command. Preserve generic credential errors, allowlisted return paths, branch exclusion, session revocation and role-appropriate `/account` resolution. Verify retained in-flow selection, final-only context switch, responsive reference comparison and focused multi-branch PostgreSQL-backed browser behavior. No schema or migration is authorized by this slice.

## SA-02 — Activate or recover an account

Presentation overlay on IAM-03/IAM-04. Implement the approved request-help, verified-channel acknowledgement and confirmation stages at the public recovery entry. Password reset invokes the existing generic issue endpoint only on final confirmation. Invited-account help must remain generic and must not fabricate, resend or expose an activation; actual invitation/operator activation continues through its verified owner channel. Preserve in-flow values, token lifecycle, account-wide trust evaluation, secret clearing and replay/session revocation. Verify both choices, known/unknown parity, Back retention, no activation-help token write, reset consumption and desktop/mobile reference comparison. No schema or migration is authorized.

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

## TEA-03 — Switch branch or leave the Teacher workspace

- [x] Reuse the server-filtered Access context directory and guarded switch; do not add Teacher-owned authorization.
- [x] Stage Destination → Leave this workspace → Confirm, retaining in-flow state and changing context only on final confirmation.
- [x] Return revoked-target failures safely without changing the current branch.
- [x] Block branch switching and sign-out while an Attendance submission outcome retains an exact request for status/retry.
- [x] Clear branch-bound browser state through hard navigation and the existing cross-tab notification.
- [x] Compare account and confirmation states with the approved Teacher reference at desktop/mobile sizes and verify focus.
- [x] Add no schema or migration; preserve Access and Attendance ownership.

Human visual acceptance, native VoiceOver/NVDA, font portability and TEN-03 remain separate pending gates.

## TEA-04 — Review the Teacher account and current session

- [x] Add the Access-owned safe self projection without exposing credential, lockout, token-version or security-event data.
- [x] Derive only current-session issue/expiry timestamps in the Next hosting adapter; expose no token material or other-session inventory.
- [x] Keep the configured session cookie and JWT lifetime at the documented eight hours.
- [x] Render My account → Account action → Confirm with retained in-flow selection and final-only action.
- [x] Route to existing password recovery, provide a no-write administrator handoff, and end only the current session.
- [x] Prove authorized-only branch display, stale-token rejection, desktop/mobile layout and keyboard focus.
- [x] Compare matched approved/application states and record the necessary live-data extension separately.

Human visual acceptance, native VoiceOver/NVDA, font portability and TEN-03 remain separate pending gates.
# ACC-02 / F18 — preferences and school support

- [x] Record D05 synthetic-only approval and reconcile existing LEA-46 session evidence.
- [x] Add constrained global own-account preference rows and protected replay receipts.
- [x] Add the trusted branch support snapshot to School through a forward migration.
- [x] Implement Access facades, current authorization, version/replay/rollback evidence and thin HTTP gateways.
- [x] Add the School administrator publication counterpart and Principal account composition.
- [x] Extend repeat-safe synthetic seed and verify PostgreSQL, browser, visual and repository gates.

Human acceptance and production enablement remain PENDING.

# ACC-03 / F02 / LEA-03 — temporary leadership delegation

- [x] Record explicit D02 synthetic-only approval and preserve permanent role contracts.
- [x] Add scoped dated delegation, exact action, protected replay receipt and immutable event tables through a forward Path-A migration.
- [x] Implement trusted operator issue/revoke, active Employee/account binding checks, overlap prevention, expected-version revocation and exact replay.
- [x] Add a transport-neutral runtime authority port and retain every source owner's module/resource authorization.
- [x] Integrate the acting workspace and the first real Communication owner read without granting writes or exports.
- [x] Add repeat-safe synthetic seed, real PostgreSQL lifecycle/security tests and desktop/mobile LEA-03 comparison evidence.

Human acceptance, school production approver/action configuration, TEN-03, native accessibility and font portability remain PENDING.
