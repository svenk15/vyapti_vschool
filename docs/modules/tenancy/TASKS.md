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

Implement OrganizationEntitlement, BranchActivation, TenantCommandReceipt, TenantOutbox and ConfigurationChange as designed. Operator grants contract; authorized institution admin previews/confirms activation. Require release availability and dependency closure; apply guards at business use-case commit and job boundaries, not only navigation. Reference policy in starter is a starting point, not completed enforcement. Add duplicate/stale/unlicensed/dependency-disabled tests and Attendance-only/Fees-only/combined policy matrix. Fees release remains unavailable until implemented; use synthetic policy tests for its independence.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Show contracted Attendance, enable in one branch, verify another remains disabled; direct protected command fails when disabled. Show Fees dependency preview without pretending Finance is implemented.

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
