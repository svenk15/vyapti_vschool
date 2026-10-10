# School scope, authentication and permissions — current state

Last updated: 2026-10-05. IAM-01 locally verified and accepted; IAM-02 locally verified and accepted; IAM-03 locally verified and accepted for the reviewed demo source. No imported task completion or active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| IAM-01 | VERIFIED | PASSED | [Local verification](../../evidence/iam-01-local/verification.json); source 56ba5f7 |
| IAM-02 | VERIFIED | PASSED | [Local verification](../../evidence/iam-02-local/verification.json), JUnit and source handoff below |
| IAM-03 | VERIFIED | PASSED | [Production verification](../../evidence/iam-03-local/verification.json); accepted source e0f262a |
| IAM-04 | VERIFIED | PENDING | [Local evidence](../../evidence/iam-04-local/); tested source recorded after focused commit. PostgreSQL test cluster at temporary local port 5433; development DB was not migrated for this task. |

## Current checkpoint

IAM-01 through IAM-03 remain verified; IAM-01, IAM-02 and IAM-03 human reviews are PASSED. IAM-03 acceptance is limited to the restored local demo/source `e0f262a78d7e020919cd36be80d508c9032d1e07` at `http://127.0.0.1:3411`; it does not accept later IAM changes. IAM-04 implements operator-preserving trust modes, school-admin invitations with sanitized delivery state/resend, exact-address invitation acceptance without Person/Employee binding, account-wide verified-address password recovery, cross-institution policy rechecks, tokenVersion session revocation, and platform-operator trust transitions with atomic Access invalidation. No real email is sent; only the development-only private local sink is configured. Migration 012 adds trust/recovery schema and migration 013 narrows the append-only AuthSecurityEvent exception to a one-time NULL account association for a resolved reset denial.

## Next action

The IAM-04 demo is running at http://127.0.0.1:3410 and health returns `alive:true`; credential file `artifacts/iam-04/private-demo.json` is ignored and mode 0600. The server uses the isolated temporary PostgreSQL test cluster, not the configured development DB. Tested implementation is committed as the focused IAM-04 checkpoint. Human review is PENDING. IAM-04 depends on IAM-02, IAM-03 and TEN-02; PER-02's IAM-03 acceptance gate was satisfied on 5 October 2026 for the exact source/demo recorded above.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

## Evidence history

Append dated task records here using docs/AGENT_RUNBOOK.md. Include source commit, changed files, schema version, commands/results, demo URL, manual feedback and next action. Do not store credentials or real pupil data.

### IAM-01 started — 3 October 2026

Initial Git clean at e95ee2d; branch main. Prior reviews PASSED and pnpm next-task selected IAM-01. Intended outcome: restricted local operator provisions a synthetic institution/branch/admin, administrator signs in, sees authorized school name/timezone/setup summary, signs out, and cannot access foreign schools. New forward migration and real PostgreSQL concurrency/rollback/auth revocation tests required. No timer or deployment is authorized.

### IAM-01 local verification and running demo — 4 October 2026

Implementation VERIFIED; human review PENDING. Initial main checkout was clean at `e95ee2d4a982e971b310e950916f11a3eec00737`. Tested executable fingerprint (sorted runtime/config/test paths plus contents): `c584aa5f6ee62ca5a34c5f0935b391d05b25e3a1338143f219094709d4c47bb2`. Tested source commit: `56ba5f7551fe06ff28b14ff40d11c57065e53f38`. The following checkpoint records documentation/evidence only; executable fingerprint matches the running production build source. [Safe observed evidence](../../evidence/iam-01-local/verification.json).

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

### Source identity handoff — 4 October 2026

Tested source `56ba5f7551fe06ff28b14ff40d11c57065e53f38`; production Next build ID `rC-4vzc5Or9U9lY2cvy2A`. No executable changes after final check/build/browser/persistence verification. Human review PENDING. pnpm next-task suggests IAM-02, but work is paused until explicit owner feedback and permission.

### IAM-03 owner acceptance — 5 October 2026

Owner: “IAM-03 manual review passed for the demo source you just provided.” PASSED applies only to source `e0f262a78d7e020919cd36be80d508c9032d1e07` and its restored local activation/recovery demo at `http://127.0.0.1:3411`. This satisfies PER-02's explicit dependency gate; it does not imply acceptance of IAM-04 or any later IAM source.

### IAM-01 owner acceptance and IAM-02 start — 4 October 2026

Owner: “Pass, please go-ahead with implementing the next task”. PASSED applies to tested source 56ba5f7551fe06ff28b14ff40d11c57065e53f38 and handoff c5337de. Initial main tree clean at c5337de; pnpm next-task selects IAM-02. Intended demo: persisted school settings/campuses, pending staff, fixed role/status management and last-admin protection. Activation belongs to IAM-03; the inconsistent IAM-02 activation demo reference is reconciled before implementation. No timer/deployment authorized.

### IAM-02 local verification and running demo — 4 October 2026

Implementation VERIFIED; human review PENDING. Started on clean main at c5337de after explicit IAM-01 acceptance. Tested executable fingerprint: `867d062699aadb22eea2ba737fd8777aa9a62ca9ac5a1be7f1da8b67002f9cd7`; [method](../../evidence/iam-02-local/source-fingerprint.json). Exact tested source commit is recorded in the following documentation-only handoff.

Implemented portable management facade, normalized commands, current scoped reads, account/Organization/School transaction guards, fixed roles/status transitions and last-active-admin protection; Platform-enlisted atomic audit/outbox/receipt writer; Attendance-owned timezone query seam; browser contracts, thin HTTP adapters and shared-UI school/staff screens. Replays reauthorize the actor/target and preserve the original response; conflicting keys and stale versions fail safely. Staff cursors are signed, actor/scope-bound and limited to 50 records. Campus count is bounded at 100. Current teacher membership controls self-only /account and /api/v1/me without enabling operational modules. New accounts have no password and remain PENDING; activation/recovery belongs to IAM-03, reconciled in DESIGN/TASKS/Bible before implementation.

Schema: forward `20261004000100_staff_management` applied to development `vyapti_vschool` and dedicated test `vyapti_vschool_test`. Five migrations, eleven physical tables, twelve foreign keys; Campus uses the scoped composite school FK, unique scoped code/id, positive version and status checks. Previous migrations remain unchanged. Clean installation and previous-checkpoint upgrade were rehearsed in isolated transaction-local schemas and rolled back; previous organization name/version/timestamp and the foundation marker survived. Both public foundation markers retain their prior timestamps. No database reset/reseed/delete or private .env overwrite occurred. Read-only Prisma comparison reports an empty migration. Campus registry/LLD status is MIGRATED.

Executed final checks:

- `pnpm check`: exit 0; lint, TypeScript, documentation, database design, extraction boundaries, independent backend compile and 50 unit tests. [JUnit](../../evidence/iam-02-local/unit.junit.xml).
- `pnpm test:functional`: exit 0, 22 real PostgreSQL tests. New coverage: actual settings/envelope commits and rollback after actual audit/outbox/receipt append, exact replay and changed-key/stale rejection, pending credentials, duplicate campus/email, scoped Campus FK rejection, pending administrators excluded from last-admin count, concurrent self-revocations leaving one active administrator, current staff suspension/reinstatement and forbidden foreign targets/account attachment, replay after actor suspension, scoped owner timezone decision and failure rollback, bounded signed cursor pagination. Existing auth/bootstrap/immutable evidence/foundation invariants and five-migration rehearsals pass. [JUnit](../../evidence/iam-02-local/functional.junit.xml).
- `pnpm test:e2e`: final frozen-source exit 0, 44 Chromium desktop/mobile journeys. New journeys cover persisted school edits, invalid timezone, campus duplicates, lost committed response followed by same-key replay, pending staff creation/persistence, last-admin rejection, active teacher suspension immediately denying /api/v1/me, reinstatement restoring the same session, teacher and foreign-origin mutation denial, mobile layout. All 40 prior foundation/design/branding/access regressions pass. [JUnit](../../evidence/iam-02-local/e2e.junit.xml). Local mobile screenshots inspected; the staff table scrolls horizontally within its shared table container.
- `pnpm build`: exit 0; production compile/types pass. `pnpm start`: production server on http://127.0.0.1:3400, session 43374, build `e547Ry6XTIfZxZ69mv-uO`.
- `node scripts/verify-management-local.mjs`: approved local retry exit 0, eight production checks: health, original accepted administrator and both screens, actual settings commit/replay/stale rejection, campus persistence/duplicate denial, pending staff suspension/reinstatement without credentials, last-admin rejection, both migration histories and preserved markers, private environment hash unchanged. [Observed safe report](../../evidence/iam-02-local/verification.json). Synthetic probe campuses/staff are retained; credentials remain in ignored mode-0600 artifacts/iam-01/private-demo.json.
- `pnpm exec prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script`: exit 0, empty migration.

Iteration evidence: initial TypeScript rejected a missing shared Dialog description; supplied it. Initial check rejected JSX construction inside try/catch; pages now catch only asynchronous gateway reads and render outside the catch. Initial browser exact label selectors included the shared required marker; switched to accessible role/name selectors. A cold dev-server auth compile exceeded the five-second expectation; the multi-step management journeys use a 15-second navigation expectation and a 60-second journey limit. Interrupted/failed runs are not counted as passed. Final unchanged source passes all gates. Initial local production probe was blocked by sandbox sockets; approved retry passed. No dependency or lockfile change.

Changed areas: Access domain/application/public contracts/Prisma repository/factory, Platform command evidence contract/adapter, Attendance read contract/adapter, browser-safe DTOs, Next gateway/auth/pages/routes, shared UI management composition, one forward Campus migration/schema, tests/fixtures/local probe, affected design/database/Bible/state documents and safe evidence. No secrets, generated ORM/build/cache artifacts or unrelated files are checkpointed.

Manual review:

1. Open http://127.0.0.1:3400/sign-in and use the existing private artifacts/iam-01/private-demo.json credentials. Expect the school home with School settings and Staff access links.
2. Open School settings, change the school name and save. Reload: expect the saved name and a higher version. Try Invalid/Zone: expect validation with no persisted change; restore Asia/Kolkata. Add a campus with a unique code; repeat it: expect a conflict and one campus row.
3. Open Staff access, create a unique synthetic teacher email under vschool.example. Expect a persisted PENDING membership after reload; no password or activation is created.
4. Manage that pending staff record: give a non-sensitive reason, change fixed roles, suspend, then reinstate. Expect persisted roles/status and reinstatement to PENDING because the account is not activated.
5. Manage the sole active administrator and try Revoke or Suspend with a reason. Expect LAST_ADMIN feedback and continued access. Sign out and revisit /admin/users: expect sign-in.

Limitations: operator activation/recovery and person binding are IAM-03/PER tasks; no email/message was sent. AttendanceSession is not yet migrated, so the real owner adapter's absence path is verified; existing-session and owner-failure policy are verified through the scoped port under real PostgreSQL transactions. ATT-01 must verify the installed relation path and retain shared School locking. No operational module/license/branch switching is enabled, no attendance workflow is claimed. Current reads and commands fail closed; broad production distributed rate controls, TLS, runtime DB privilege separation, accessibility certification and release/recovery remain later gates. No deployment or timer started. Human acceptance stays PENDING. Next action: pause for this demo's owner feedback; do not start IAM-03 yet.

### IAM-02 source identity handoff — 4 October 2026

Tested source `2a9418f9ae2265532aae946c4c540be39c28a79f`; production build `e547Ry6XTIfZxZ69mv-uO`, live health ready at http://127.0.0.1:3400. Executable fingerprint matches the frozen tested source after commit. This following checkpoint changes documentation/evidence only. Human review PENDING; pause before IAM-03.

### IAM-02 acceptance and execution policy — 4 October 2026

Owner: “IAM-02 looks good - Pass”. PASSED applies to tested source 2a9418f9ae2265532aae946c4c540be39c28a79f and documentation handoff 7f72d13. At that checkpoint the owner authorized continuation after each verified demo with human review PENDING; never infer acceptance. The 6 October execution policy later superseded its statement that explicit human-acceptance dependencies remain implementation gates. Defects take priority; technical prerequisites remain mandatory. No timer, deployment or external messaging authorized. Clean main at 7f72d13; pnpm next-task selected IAM-03.

### IAM-03 start — 4 October 2026

Clean main at c8eb176 after policy/acceptance checkpoint. Demo outcome: issue private verified-operator token, activate synthetic teacher, sign in, reject replay, recover and invalidate old sessions. IAM-ADR-007 resolves operator FK provenance, relational membership intent, account-wide recovery state and attempt limits before coding. Required forward migrations, PostgreSQL invariants and Playwright journeys; no timer/deployment/external send.

### IAM-03 automated source checkpoint — 4 October 2026

Implementation IN_PROGRESS pending frozen production demo verification. pnpm check passed (53 unit tests, lint/types/docs/48-table registry/boundaries/backend). Full PostgreSQL baseline passed 27 tests; final focused activation suite passed 7, including real lock-wait expiry and bounded retry rollback (29 distinct current functional cases covered across retained reports). Full browser baseline passed 48 desktop/mobile journeys; final activation/recovery scope passed 4 after the retry change. pnpm build passed with standalone local snapshot output. Six forward migrations applied to dev/test; schema comparison empty. Pending synthetic teacher/private token is prepared in ignored mode-0600 artifacts/iam-03. Human review NOT_REQUESTED until the production snapshot/probe pass. Exact commit and manual steps follow in the verification handoff.

Snapshot iteration: initial source 869658a passed application checks/build but its demo copy flattened pnpm symlinks, causing missing @swc/helpers at startup. No stable demo/review was claimed. Preserve verbatim internal dependency links; all 38 snapshot source links were checked to remain within standalone output. Production startup/probe still pending.


### IAM-03 verified production handoff — 4 October 2026

Implementation VERIFIED; human review PENDING. Tested source `e0f262a78d7e020919cd36be80d508c9032d1e07` (activation source 869658a plus verified snapshot-copy correction). Frozen production build `JNmMa4cpe5cN-U2FWkYa7` runs at http://127.0.0.1:3403 independently of subsequent source builds. Health reports ready. [Production probe](../../evidence/iam-03-local/verification.json) passed all seven checks: screen/health, actual private operator CLI and output guards, one-time activation/sign-in, immediate recovery session revocation, fresh credentials with replay rejection, both migration histories/markers, and unchanged private environment.

Portable Access use cases enforce verified operator provenance, hash-only tokens, 24-hour expiry, account-wide credential quarantine/revocation, immutable scoped membership intent and transactional current-state guards. Redeem activates only unchanged intended pending memberships; recovery preserves active/suspended/revoked memberships. Account and host attempt limits, safe same-origin/body/error handling, password confirmation and clearing, bounded known-aborted transaction retries, atomic Platform audit/outbox evidence and private mode-0600 CLI outputs are implemented. No operator HTTP route, email delivery or person binding is claimed.

Executed evidence: pnpm check passed lint/types/docs/database registry/boundaries/backend and 53 unit tests. Full PostgreSQL baseline passed 27; final activation suite passed 7 after retry/lock-wait coverage changes (29 distinct current cases across retained reports, not a single 29-test run). Full Playwright baseline passed 48 desktop/mobile journeys; final activation/recovery suite passed 4 after the final business change. JUnit reports are retained in docs/evidence/iam-03-local. Production build and targeted script lint passed. Prisma read-only schema comparison returned empty. Six forward migrations are applied to both databases; 13 tables and 16 foreign keys. Original migration history and foundation markers are preserved. No reset/reseed/delete or private .env overwrite occurred. The first snapshot startup failed due to flattened dependency links; corrected copying preserves 38 internal links, and the replacement frozen server/probe passed.

Manual review:

1. Open the ignored private files artifacts/iam-03/private-demo.json and artifacts/iam-03/private-activation.json in your editor. At http://127.0.0.1:3403/activate paste the activation token and use the demo password for both password fields. Expect success and cleared fields.
2. Sign in with the private demo email/password. Expect the protected account page. Replay the first token: expect generic rejection with cleared fields.
3. In your terminal run `VSCHOOL_DEMO_URL=http://127.0.0.1:3403 pnpm recover-account --accountId <accountId-from-private-demo> --caseReference SYNTHETIC-REVIEW --reason "Synthetic identity verified" --output artifacts/iam-03/private-review-recovery.json`. Use a new output filename if it exists. Expect a private token file; the old session loses protected access immediately.
4. Paste that recovery token at /activate and use recoveryPassword from private-demo.json. Expect success, sign-in with the new password and continued rejection of the old session/password.

Limitations: local configured-operator trust only; anonymous hosting uses a conservative shared bucket because no trusted source IP is available. Production distributed limits/trusted proxy, TLS, delivery, runtime DB roles and release recovery remain FND-02 gates. Person binding remains PER-01/PER-02. Synthetic evidence is retained without destructive cleanup. The prepared manual teacher/token were not consumed by the production probe; it used a separate synthetic account. No secrets or generated build artifacts are committed. Owner review remains PENDING; continue TEN-01 and prioritize reported defects.

### IAM-03 restored local demo — 4 October 2026

IAM-03 implementation remains VERIFIED; human review remains PENDING. Restored a separate source archive of tested commit `e0f262a78d7e020919cd36be80d508c9032d1e07` at `http://127.0.0.1:3411` using the configured development database `vyapti_vschool` on local port 5432. Prisma Client 7.10.0 generated from the frozen source schema successfully against the current additive schema. The restored app served `/activate` with HTTP 200. Full headless browser journey against a separate synthetic verification account passed: activation, replay rejection, recovery, old session 401/protected-page redirect, old password rejection, recovery redemption and new-password sign-in; old session remained rejected. Fresh unused synthetic handoff credentials and activation token are in ignored mode-0600 artifacts. No human feedback was inferred. The prior 3403 listener was left untouched. The verified-operator activation CLI issued the fresh handoff token against the configured development database. Recovery issuance was exercised through the Access application service; the user can create a fresh recovery token through the CLI during manual review. No migration was run or database reset/deleted.

### IAM-04 implemented checkpoint — 4 October 2026

Implementation VERIFIED; human review PENDING. Focused implementation commit and tested source fingerprint are recorded after commit. Executable fingerprint at the verified source is `63e3a711a3555c25e720e9f7a6a2e1f7f120cbb244a16f4a54bcded3ff1a57e8` ([method](../../evidence/iam-04-local/source-fingerprint.json)). Design checkpoint `a3f05f8` and groundwork checkpoints `55d1f31` / `348adb5` were preserved.

Schema: forward migrations `20261004001200_iam04_trust_email_recovery` and `20261004001300_auth_event_account_updates` apply cleanly to the isolated temporary PostgreSQL 18 test cluster `vyapti_vschool_test` on port 5433. All 17 migrations are applied; schema diff shows only five pre-existing Branding/People default differences. The configured development database `vyapti_vschool` reports migration status up to date but remains on the configured service and was not migrated as part of IAM-04; no reset, reseed, or history rewrite occurred. The temporary cluster is separate and not the configured database.

Checks: `pnpm test:unit` passed 78 tests/11 files. `TEST_DATABASE_URL=… pnpm test:functional` passed 65 tests/12 files against real PostgreSQL. Focused desktop Chromium plus mobile viewport Playwright passed 8/8 IAM-04 and IAM-02 journeys (invitation, password reset/old-session invalidation, settings, staff lifecycle) after correcting the sign-in landing path. `pnpm lint`, `pnpm typecheck`, `pnpm check:docs`, `pnpm check:db-design` (50 table contracts), `pnpm check:boundaries`, `pnpm check:backend`, `pnpm exec prisma validate`, and `git diff --check` passed. Full Playwright suite and `pnpm build` were not run; they are not claimed. JUnit evidence is in `docs/evidence/iam-04-local/`.

Known limits: the configured database's local Postgres service is separate from the temporary test cluster; production email provider, distributed rate limiting/trusted proxy, TLS/runtime DB roles, RLS/deployment and pilot retention remain FND-02 gates. Development mail messages contain synthetic tokens only in ignored mode-0600 artifacts; no token-bearing files or credentials are committed. The unrelated `.puku-cli/` untracked directory is excluded.

Demo URL: http://127.0.0.1:3410 (isolated temporary PostgreSQL cluster; this is not the configured development DB). Manual review steps: sign in using the generated private synthetic demo credential file; invite a `@vschool.example` account and accept its fragment link from the local mail sink; request its password reset and verify the new password works while prior session access fails; invite a `@mail-fail.vschool.example` address and verify safe failure + resend. Do not use real recipient addresses. The local demo server remains active for review.

### EX-04 approved entry adoption — 10 October 2026

Implementation VERIFIED at `9d1178209d29d6dcdc3a71461890d3b6af3e97fb`; human review PENDING. Generic and published school entry, activation, invitation, recovery and account-entry pages use the approved shared form hierarchy without changing Access business contracts. Non-sensitive email survives recovery/retry; passwords and fragment tokens are cleared after terminal failures; focused feedback supports keyboard recovery. `/account` exposes the teacher shell only when current account, branch, `attendance.mark` and Attendance module checks pass. A TEACHER role alone continues to expose no teaching destination.

Focused PostgreSQL-backed Playwright evidence covers generic and published-brand sign-in, administrator/teacher entry, generic credential and recovery responses, invalid invitation cleanup, successful recovery/invitation, session revocation, membership suspension and CSRF/origin protection. All 24 affected desktop/mobile cases pass after correcting a test assumption about a teacher fixture without Attendance entitlement. No table, migration, transaction, permission or seed changed. Evidence: `docs/evidence/ex-04/README.md`. TEN-03 and native accessibility remain release gates.

### EX-05 school settings adoption — 10 October 2026

Implementation VERIFIED at `486f5d9ed90c3f985d2ca53f78cb0350f5e47a6b`; human review PENDING. The approved SA-06 rule supersedes the earlier session-dependent timezone rule: an existing branch timezone is read-only in the administrator form, and the locked `UpdateSchool` transaction rejects every changed value with `TIMEZONE_IN_USE` before School, receipt, audit or outbox writes. Branch creation still validates and stores an IANA timezone. A future timezone migration requires a separately authorized operator workflow and impact analysis. The no-longer-needed Access dependency on the Attendance session-impact query was removed; Attendance keeps that port for its other owners.

Focused PostgreSQL verification passed 7/7 Access-management cases, including immutable timezone, atomic rollback, replay/stale behavior, concurrency and authorization. The affected desktop/mobile Playwright run passed 6/6 and directly forged the timezone payload. `pnpm check` passed all gates and 111 unit tests. No schema or migration changed; all 31 test migrations were current. Evidence: `docs/evidence/ex-05/README.md`.
