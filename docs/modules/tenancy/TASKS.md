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

Add reviewed PostgreSQL RLS policies/restricted roles, transaction-local scope, scoped export/job/cache enforcement and configuration revision invalidation. Test raw runtime SQL cross-branch/institution reads/writes, pooled connection reuse, disabled module racing submit and jobs, restore/reconciliation and operational quotas. Record deployment role permissions and benchmark contention before production; no bypass by owner/runtime role.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Run two institutions side by side; deny wrong-branch direct API and runtime SQL; disable a branch module and demonstrate safe in-flight behavior plus reactivation preserving data.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.
