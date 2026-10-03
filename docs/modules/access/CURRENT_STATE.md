# School scope, authentication and permissions — current state

Last updated: 2026-10-04. IAM-01 locally verified; owner acceptance PENDING. No imported task completion or active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| IAM-01 | VERIFIED | PENDING | [Local verification](../../evidence/iam-01-local/verification.json); source identity recorded below |
| IAM-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| IAM-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

IAM-01 implements restricted operator bootstrap, bcrypt credentials/lockout, provider JWT sessions, current account/membership/school/institution authorization and a protected administrator home/setup summary. Nine access/shared-envelope tables are installed alongside the foundation marker. IAM-02/03 are specifications only.

## Next action

Keep the production demo stable and pause for IAM-01 owner review. Address failed feedback first. IAM-02 is next after explicit acceptance and permission to continue.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

## Evidence history

Append dated task records here using docs/AGENT_RUNBOOK.md. Include source commit, changed files, schema version, commands/results, demo URL, manual feedback and next action. Do not store credentials or real pupil data.

### IAM-01 started — 3 October 2026

Initial Git clean at e95ee2d; branch main. Prior reviews PASSED and pnpm next-task selected IAM-01. Intended outcome: restricted local operator provisions a synthetic institution/branch/admin, administrator signs in, sees authorized school name/timezone/setup summary, signs out, and cannot access foreign schools. New forward migration and real PostgreSQL concurrency/rollback/auth revocation tests required. No timer or deployment is authorized.

### IAM-01 local verification and running demo — 4 October 2026

Implementation VERIFIED; human review PENDING. Initial main checkout was clean at `e95ee2d4a982e971b310e950916f11a3eec00737`. Tested executable fingerprint (sorted runtime/config/test paths plus contents): `c584aa5f6ee62ca5a34c5f0935b391d05b25e3a1338143f219094709d4c47bb2`. The source commit will be recorded in the following documentation-only checkpoint; no self-referential SHA is invented. [Safe observed evidence](../../evidence/iam-01-local/verification.json).

Implementation: portable Access domain/application/contracts/storage plus framework-free factory; Platform-enlisted evidence writer; browser DTOs; thin Next provider/session/page/API adapters and frontend gateway; shared UI administrator sign-in, home, setup summary and sign-out. `/api/v1/school` resolves exact current server membership for an optional school candidate. Active account/tokenVersion, role grant, institution and school status are rechecked on protected reads. Bootstrap creates one new institution/first branch/admin atomically and refuses implicit tenant/account reuse. No operational module is enabled.

Schema: forward `20261003000400_access_bootstrap` applied to development `vyapti_vschool` and dedicated test `vyapti_vschool_test`; all four migrations applied without rollback. Ten physical tables total, nine new contracts with snake_case mappings, 11 foreign keys including scoped composites, allowed-state/version checks, and append-only audit/receipt/security guards. Original migrations are unchanged. Both original marker IDs/timestamps match the prior FND-01 evidence. Empty and previous-checkpoint migrations were rehearsed in separate transaction-local test schemas, then rolled back without touching public tables or resetting/deleting a database. Repeated deploy reports no pending migrations. Prisma read-only schema comparison reports an empty migration.

Executed final checks:

- `pnpm check`: exit 0; lint, TypeScript, documentation, 47-table registry, extraction boundaries, independent backend compilation and 46 unit tests passed. [JUnit](../../evidence/iam-01-local/unit.junit.xml).
- `pnpm test:functional`: exit 0, 15 real PostgreSQL tests. Coverage includes all aggregate/evidence writes; rollback after actual audit/outbox append; duplicate institution and unique email races; invalid timezone; concurrent lockout and expiry; disabled/unknown credentials; token revocation; current membership/institution/branch/admin-grant denial; scoped FK rejection; immutable audit/receipt/security evidence; clean-install and upgrade rehearsals; existing foundation invariants. [JUnit](../../evidence/iam-01-local/functional.junit.xml).
- `pnpm test:e2e`: final unchanged-source run exit 0, 40 Chromium desktop/mobile journeys (12 IAM and 28 accepted foundation/design/branding regressions). Sign-in/out, logged-out denial, safe foreign scope, generic wrong/unknown/disabled/locked feedback and password clearing/focus, provider CSRF/same-origin/body bounds, token revocation, current membership suspension, secure HTTP-only/SameSite cookie attributes and absence of account email/hash in session DTO. [JUnit](../../evidence/iam-01-local/e2e.junit.xml). Local screenshots were inspected; ignored artifacts retain desktop/mobile images.
- `pnpm build`: exit 0, production compile/types and dynamic protected routes passed. `pnpm start`: production demo running on port 3400, session 77200.
- `pnpm setup:auth`: created mode-0600 auth-only `.env.local`, preserving `.env`; no existing secret configuration was overwritten. `pnpm demo:access`: approved local retry provisioned a synthetic school and saved generated credentials in ignored mode-0600 `artifacts/iam-01/private-demo.json`.
- `pnpm verify:access-local`: approved retry exit 0, 11 checks. Real CLI creates a second synthetic institution/branch with audit; duplicate/invalid-zone/operator/DB guards reject safely; both DB histories/markers preserved; production health/login/logout/own/foreign/setup pass; separate port-3402 process with unreachable synthetic DB returns protected API 503, safe retry page and redacted auth error; limiter returns 429; missing-secret process fails closed; both temporary processes stop; private .env SHA remains unchanged. No database was stopped or modified to simulate outage.
- Local bcrypt cost-12 benchmark: three fresh random-password hashes took 261/248/250 ms; median 250 ms. Values were not logged.
- Reviewed pinned dependencies: next-auth 4.24.15 and bcryptjs 3.0.3; 16 transitive packages, existing runtime versions retained. Installed provider code awaits Next 16 cookies/headers/params. Configuration follows [official provider](https://next-auth.js.org/providers/credentials), [Next integration](https://next-auth.js.org/configuration/nextjs) and [options](https://next-auth.js.org/configuration/options) documentation. Installed Next docs were read before host API changes.

Iteration evidence: initial functional run failed six provisions because Prisma cannot deserialize PostgreSQL's void advisory-lock return; switched the lock statement to executeRaw and reran successfully. Initial browser selectors included the required marker and hidden Next route announcer; corrected selectors. A request-bound guard regression lost NextAuth's nextUrl on a plain Web Request; retained NextRequest and reran. An intermediate live-edited dev run returned one 500 during membership denial; the final frozen-source full run passed all 40 journeys. One concurrent typecheck/dev regeneration run failed on transient generated type files; serialized check/build passed. Local sandbox blocked the initial dependency-store/database/probe attempts; approved retries succeeded. Failed attempts were not marked passed.

Changed paths: Access backend/composition/contracts, Platform evidence contract/infrastructure, shared/contracts/access, lib/server access/auth/gateway/page helpers, app auth/admin/read routes and sign-in, components/access-login/shared styles/header, scripts for auth/operator/demo/probes, Prisma schema/forward migration, pinned dependency/lock/config, tests, root entry/status docs and affected Access/Platform/Branding/Bible/database documents. Design reconciliations: first-use table scope, bootstrap duplicate/operator provenance, credential/lockout/session rules and foundational metadata scope. BRD-01 acceptance records the owner's exact feedback independently. No secret/private credentials, generated ORM/build/cache files or unrelated changes are checkpointed.

Manual review:

1. Read the private local `artifacts/iam-01/private-demo.json` in your editor for generated email/password. Open http://127.0.0.1:3400/admin while signed out. Expect the administrator sign-in page.
2. Sign in at http://127.0.0.1:3400/sign-in using those credentials. Expect your synthetic school name, MAIN code and Asia/Kolkata timezone.
3. Choose School setup, then Back to school home. Expect a protected setup summary explaining that editable settings/staff belong to IAM-02, then return to your school.
4. While signed in open `/api/v1/school?schoolId=3491dc36-ffc4-4f09-baab-6be61bdadd70`. Expect safe NOT_FOUND/404 with no foreign school details.
5. Sign out, then revisit `/admin` and `/admin/setup`. Expect sign-in; `/api/v1/school` returns UNAUTHENTICATED/401. Optionally submit one wrong password: expect generic feedback and a cleared password, then use the correct credential.

Limitations: settings/staff/activation/recovery, multi-branch switching, licensed module configuration, branded real sign-in and operational school workflows remain their later tasks. Operator trust is local file/terminal access with configured UUID; production operator procedures, TLS, distributed rate control, RLS/runtime role separation and recovery/release are future gates. JWT lifetime is eight hours; local HTTP cookies are HttpOnly/SameSite=Lax, HTTPS Secure behavior is configured but no TLS deployment was tested. No Safari/Firefox, screen-reader certification, load/MFA/SSO or external outbox delivery is claimed. Synthetic append-only test/probe evidence is retained; no destructive cleanup occurred. Human acceptance stays PENDING until explicit owner feedback for the tested source. Next action: pause; do not begin IAM-02 yet.
