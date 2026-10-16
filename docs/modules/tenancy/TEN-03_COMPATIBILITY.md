# TEN-03 database compatibility review

Reviewed 6 October 2026 before changing database roles, grants, runtime URLs or table policies. This is a local development/test catalog snapshot. It does not represent a provider deployment. No database or role was modified during this review.

## Actual starting point

| Item | `vyapti_vschool` | `vyapti_vschool_test` |
|---|---|---|
| Configured connection role | `vyapti_vschool` | `vyapti_vschool_test` |
| Role attributes | LOGIN, NOSUPERUSER, NOBYPASSRLS, INHERIT, NOCREATEDB, NOCREATEROLE | LOGIN, NOSUPERUSER, NOBYPASSRLS, INHERIT, NOCREATEDB, NOCREATEROLE |
| Database owner | `vyapti_vschool` | `vyapti_vschool_test` |
| Public relation owner | Configured role owns all 52 ordinary tables | Configured role owns all 52 ordinary tables |
| Public schema CREATE | Yes | Yes |
| RLS-enabled tables / policies | 0 / 0 | 0 / 0 |
| Migration files / applied | 26 / 26 | 26 / 26 |

The test `_prisma_migrations` ledger has 28 records: 26 applied and two retained rolled-back records. `prisma migrate status` reports no pending migrations. Preserve those records and all existing rows. The 52 public ordinary tables are the 51 registered tables plus `_prisma_migrations`; the migration ledger is a deployment exception, not tenant data.

## Current implementation checkpoint — 6 October 2026

Two additive migrations are now applied to both designated local databases (28 applied migrations each). The restricted runtime roles remain without table DML, ownership, role memberships or schema CREATE; migration and application connection separation is not yet active. Catalog verification reports 0 RLS-enabled tables and 0 policies. `vs_set_verified_branch_context` validates active account/token version, organization, branch and active membership; `vs_set_verified_account_context` validates a known account/token version; `vs_find_account_context_by_email` resolves one exact normalized address. All set transaction-local GUCs, revoke PUBLIC execute, and grant execute to the restricted roles. The login flow now uses exact-email account context in its transaction. Typed branch context is wired into Academics, Students, Imports, Attendance, People, Reporting and branch module-configuration guards. Account-wide password recovery, invitation acceptance, Access branch-directory discovery, operator, public-brand and several other global/security paths are not yet compatible.

The cluster also contains `venky` and `vschool` login superusers. Do not use either for the application pool or ordinary runtime verification. The other local logins inspected (`schoolos_starter`, `schoolos_starter_test`, `vschool_demo_p0_03_c12a0c91`, `vschool_demo_p0_04_fa22d222`, `vschool_fresh_dev`) have no current SELECT/INSERT/UPDATE/DELETE grants on public tables and are not designated runtime roles. At the initial catalog snapshot, no restricted runtime roles existed. On 6 October, `vyapti_vschool_runtime` and `vyapti_vschool_test_runtime` were provisioned with no object ownership, no schema CREATE and no table DML; credentials are in the ignored local private artifact. Role passwords and connection strings are deliberately excluded.

## Registered table compatibility matrix

`docs/database/TABLE_REGISTRY.json` revision 4.3 is the per-table authority for physical columns, indexes, constraints, owner, intended policy and TEN-03 closure. Its 51 contracts classify as follows:

| Class | Count | Planned boundary |
|---|---:|---|
| BRANCH | 33 | Require transaction-local organization + branch context and current active membership; application resource permission remains required. Includes scoped operational data and branch-scoped audit/export evidence. |
| INSTITUTION | 6 | Require verified institution context; nullable branch references remain institution-wide only where the table contract explicitly permits it. |
| INSTITUTION_ROOT | 1 | Organization root access through verified institution authority; never infer operational branch access. |
| BRANCH_DIRECTORY | 1 | Return branch metadata only for currently authorized membership/grant workflows. |
| GLOBAL_IDENTITY | 1 | UserAccount remains global; ordinary access is self-scoped and uses Access-owned workflows. |
| GLOBAL_SECURITY | 3 | Activation/security/password-reset state has no generic tenant read. Named Access workflows bind exact account/token/scope and retain token, rate, trust and revocation checks. |
| TENANT_PRIVATE_WITH_SANITIZED_PUBLIC_READ | 4 | Branding base tables remain private; public identity reads go through an allowlisted published-only function/view path. Public slugs do not confer tenant access. |
| DEPLOYMENT_ONLY | 1 | Setup marker is deployment-scoped and has no tenant read path. |
| GLOBAL_OPERATOR | 1 | Operator audit is accessed through a separate verified operator workflow and redacted DTO. |

The existing `vs_platform_audit_entry` is BRANCH scoped; `vs_platform_operator_audit` is GLOBAL_OPERATOR. `vs_platform_setup_check` is DEPLOYMENT_ONLY. The enforcement migration covers the 49 scoped/identity/security/private-brand tables; it records explicit `TEN_03_EXCEPTION` for the deployment marker and leaves the global operator audit under its PLATFORM gate. `_prisma_migrations` is outside the table registry and remains owned by the migration identity. No exception permits generic app-runtime DML on a tenant table.

## Compatibility decisions and rollout

1. Keep the existing development/test databases, migration ledger, object owners and private `.env` unchanged. Treat each configured database owner as the local migration identity for the first enforcement migration; do not rename roles, transfer 52 relations, or replace owner credentials as a prerequisite.
2. Create separate local runtime login roles for development and test. Each must be NOSUPERUSER, NOBYPASSRLS, NOINHERIT, NOCREATEDB and NOCREATEROLE, own no database/schema/table/sequence, have no membership permitting `SET ROLE`, and have no `public` CREATE. Grant only database CONNECT, schema USAGE, explicitly required table DML/sequence USAGE, and EXECUTE on reviewed helper functions. Store generated credentials in an ignored mode-0600 local artifact; never put them in Git or overwrite `.env`.
3. Preserve migration execution under the configured owner connection. Split the local database runner so migrations use the existing owner URL, while functional/E2E/application processes use the separate runtime URL. `pnpm dev` and immutable demos must use runtime credentials after the code can establish verified transaction-local context.
4. Apply the forward RLS migration to `vyapti_vschool_test` first. Verify role ownership/grants and representative class policies before any development migration. Only after the complete test suite passes may the same forward migration be applied to `vyapti_vschool`; stop the running demo during that schema transition and restart it with the restricted runtime role.
5. Keep every application permission check in place. Resolve account/membership/resource authority before setting server-derived context. Set context with `set_config(..., true)` on the exact checked-out connection and transaction used by the query/write. Reads remain read-only and take no write locks; existing mutation lock order and idempotency remain unchanged.
6. Keep policy lookup indexes from existing registered composite keys where possible. Add an index only when the actual predicate lacks a matching leading key and `EXPLAIN (ANALYZE, BUFFERS)` plus write-cost evidence supports it. Do not add duplicate scope indexes preemptively.
7. Use only named exception paths for account-wide recovery, invitation acceptance, public sanitized branding, trusted operator commands, migration DDL and deployment health. No global bypass GUC or superuser connection may enter the app pool. Document function owner, fixed `search_path`, granted EXECUTE roles, output allowlist and tests for each security-definer/view boundary.

## Required policy and verification coverage

The role-level proof must connect directly as the new restricted runtime roles, not as the current table owner, `venky`, or `vschool` superusers. Cover:

- Missing, empty and malformed account/organization/branch context; no tenant rows and no writes.
- Current tenant read/write success; cross-institution and same-institution wrong-branch SELECT/INSERT/UPDATE/DELETE denial; forged old/new composite scope denied by both `USING` and `WITH CHECK`.
- Current membership/resource permission revocation; no stale grant from an earlier request.
- Pool size one across alternating A / no-context / B transactions after commit, rollback, database error, cancellation and response loss; prove transaction-local values are cleared before reuse.
- Owner behavior with ENABLE and FORCE; current migration owner can perform controlled DDL but is never evidence for runtime isolation. Runtime cannot `SET ROLE`, alter policies, disable RLS or create in `public`.
- UserAccount self access; exact-address account-wide recovery and token consumption; invitation acceptance; no broad UserAccount or reset-token access.
- Separate operator CLI authorization/evidence; scoped Platform audit versus redacted global operator audit; public published-brand allowlist with no drafts or cross-tenant identity leakage.
- Empty-database migration and upgrade from both current baselines, immutable history, unchanged IDs/counts, and restore/reconciliation into an isolated target. No reset or destructive migration.

The initial compatibility implementation proof is distinct from the consolidated load gate. TEN-03's recorded synthetic scale target remains 100 institutions / 500 branches, 100,000 accounts, 150,000 memberships, 1M students, 5M sessions, 50M attendance records and 1M audit/outbox records; 200 clients for 15 minutes at 70/20/5/3/2 read/write/config/audit/auth mix; 10% alternating tenant pool reuse; 1% deny probes. Measure at least 100,000 cross-tenant/forged-context probes and 100,000 alternating pooled transactions. Targets remain zero leakage, p95 ≤100ms reads/≤200ms writes, p99 ≤500ms, RLS overhead ≤20%, <0.1% non-denial errors, no unexplained deadlocks and lock-wait p95 ≤50ms. These are planned acceptance criteria, not results from this inspection.

## Review result

The compatibility plan preserves the current migration identities and history and avoids editing `.env`. The role-preparation command creates distinct restricted local logins without table DML. Forward migrations provide branch and account context helpers with pinned `pg_catalog` search paths, fully qualified SQL, no dynamic statements, PUBLIC execute revoked and restricted-runtime EXECUTE only. Application resource permission, entitlement and module checks remain mandatory in every use case. Real PostgreSQL coverage now includes restricted-role no-DML behavior, exact-email lookup, account/token validation, branch membership denial, alternating account/branch context on a pool of size one, and commit/rollback cleanup. Branch guards cover Academics, Students, Imports, Attendance, People, Reporting and branch module configuration; login, recovery and invitation paths also establish scoped transaction context. However, custom GUCs are caller-settable. The current helpers alone are insufficient as an RLS identity proof; TEN-03 must add a non-forgeable transaction-bound verifier and test direct GUC forgery before any policy trusts those values. Access directory/bootstrap, institution/operator, export/job/cache and public-brand exceptions also remain incomplete. Both local databases have 31 migration files applied, but RLS is 0 enabled tables / 0 policies and application pools still use owner connections. Until context authenticity, remaining paths, policy denial/load, migration and restore evidence pass, TEN-03 remains an open release gate.
