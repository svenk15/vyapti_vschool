# Institution, branch and module configuration — tasks

Read DESIGN.md and Bible v4.1. These are vertical slices; previews do not prove persistence or authorization.

## TEN-01 — Provision institutions/branches and switch authorized context

Depends on: IAM-02

### Implementation instructions

Build InstitutionGrant and owner-facade institution/branch administration; retain School as branch storage. Implement selector reads and context switch, clearing previous protected drafts/caches. Add institution admin vs branch operational permission tests, cross-institution and same-institution other-branch denial. UI must use shared components and show current institution/branch consistently. Person binding is independently verified per institution. No implicit student grant from institution role.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Provision two institutions, two branches in one; sign in with a multi-branch user, switch branches and verify list context. Try an ungranted branch and confirm denial.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.

## TEN-02 — Persist and enforce module entitlements and activation

Depends on: TEN-01

### Implementation instructions

Implement OrganizationEntitlement and BranchActivation only; TEN-01 already installed TenantCommandReceipt, TenantOutbox and ConfigurationChange. A verified platform operator records institution entitlements. An active institution admin with `module.configure` previews/confirms branch activation only inside an explicitly operationally granted branch. Resolve release availability and dependency closure from a server-owned immutable manifest; reject client-supplied release flags. No product module release is available in this checkout because Attendance and its Student/Academic/Staff dependencies are not implemented. The real demo must show a persisted Attendance contract, release blocker and denied confirmation/authorization. Use a controlled immutable test manifest in PostgreSQL/unit tests for positive Attendance-only, Fees-only and combined policy, branch isolation, disabled guard, concurrent-disable serialization, idempotent replay and evidence rollback. Reuse TEN-01 receipt/audit/outbox. No Attendance business command exists to integrate; its later owning task must call the Tenancy authorization facade at commit/job boundaries.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Record an Attendance contract with the verified local operator CLI, inspect current branches and see the `RELEASE_UNAVAILABLE` blocker; attempt confirmation and a protected module authorization and verify they fail without partial evidence. Preview Fees and inspect its dependency/release blockers. Do not claim an Attendance workflow or Finance feature is released.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.

## TEN-03 — Prove tenant isolation and configuration recovery

Depends on: TEN-02, ATT-04

### Implementation instructions

TEN-ADR-006 is the compatibility contract; TEN-03 remains the one consolidated enforcement and verification gate. Inspect actual database roles/catalogs and every migrated table, then produce/review the retrofit matrix before changing existing schema, grants, or runtime connections. Preserve existing local database-owner credentials as the migration identity; create separate restricted runtime roles and keep the owner/runtime URLs distinct without overwriting `.env`. Production uses a separately controlled migration identity. Classify every table; implement RLS/ENABLE+FORCE, transaction-local verified context, scoped reads/writes, minimal indexes and explicitly audited global/operator/public exceptions. Integrate all database paths (including exports/jobs/cache boundaries), configuration revision invalidation, disabled-module command/job races, restore/reconciliation and operational quotas. No future tenant-owned table migration may omit its class, policy, forced-RLS decision, grants, indexes and restricted-role tests; `pnpm check:db-design` enforces the Path A migration annotation before TEN-03 and same-migration RLS after enforcement. Prove no bypass by ordinary owner/runtime roles. Record provider deployment role permissions before release.

Context authenticity is part of acceptance: PostgreSQL custom GUCs are caller-settable. A policy must reject forged GUC values by verifying a non-forgeable, transaction-bound proof; raw account/tenant GUC equality is insufficient. The restricted-role suite must attempt direct account, organization and branch `set_config` forgery before cross-tenant reads/writes.

Use the synthetic TEN-ADR-006 benchmark profile and acceptance thresholds (or document an evidence-backed reviewed adjustment before execution). Branch and account context helpers must have a pinned search_path, fixed SQL, no caller-selected access mode, PUBLIC execute revoked and restricted-role EXECUTE only. Branch context verifies current account token version, institution, branch and active membership; account bootstrap is limited to exact normalized email or a known account/token version and sets account scope only. Application resource/module authorization remains active. Test SQL directly as the restricted runtime role with missing/malformed context, cross-institution and cross-branch reads/writes, forged composite scope, owner behavior, and pooled connection reuse/leakage. Test named recovery/operator/audit/public-brand exceptions through their narrow paths. Run empty/upgrade migrations and compare RLS-on performance to indexed isolated baseline; do not use mocks as evidence for SQL policies, role grants, transaction-local scope, or pooling.

### Acceptance and test strategy

Run pnpm check, restricted-role real-PostgreSQL functional tests, the measurable load/plan profile, applicable Playwright journeys and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state, policy registry, compatibility matrix and affected Bible/ADRs in the same checkpoint. Keep implementation VERIFIED only after provider role evidence, restore/reconciliation and all release acceptance criteria pass; human review remains separate.

### Demo and checkpoint

Run two institutions side by side; deny wrong-branch direct API and runtime SQL; disable a branch module and demonstrate safe in-flight behavior plus reactivation preserving data.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.
