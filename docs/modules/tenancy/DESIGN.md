# Institution, branch and module configuration — design

Phase 1 · Revision 1 · 3 October 2026. Runtime implementation limits are explicit in CURRENT_STATE.md.

## Database naming and physical mapping

All physical objects follow [the VS database contract](../../DATABASE_DESIGN.md). Table names and columns below are physical SQL names; workflow prose uses logical domain names. `organizationId` maps to `organization_id`, `schoolId` to `school_id`, and `scope` expands to both columns. Models retain PascalCase through Prisma `@@map`; camelCase fields use `@map`. Planned schemas are implemented only through their named tasks and reviewed migrations.

## Ownership and aggregate boundaries

Access retains Organization, School and memberships; Tenancy owns OrganizationEntitlement and BranchActivation configuration. Do not duplicate institution identity in a competing Tenant table. InstitutionGrant is Access-owned. TenantDirectory is a future deployment-routing port, not a business data source. `ModuleManifest`, `ModuleId`, `DependencyClosure`, `ConfigurationRevision` and `BranchScope` are immutable values. Current code implements a pure subset in backend/modules/tenancy/domain/entitlements.ts.

TEN-ADR-001: institution entitlement and branch activation are separate roots; effective access intersects release availability + entitlement + activation + current user/resource permission. Alternative: menu-only toggles rejected. Tests include direct endpoint denial and queued work after disable.

TEN-ADR-002: shared PostgreSQL with composite constraints, scoped repositories and production RLS defense. Dedicated tenant DBs are a later routing option. No per-client code fork.

TEN-ADR-003: configuration metadata changes use actor account locks → Organization guard → School guards in sorted order. Ordinary business commands take Organization FOR SHARE after account locks and before School FOR UPDATE; institution entitlement/config changes use Organization FOR UPDATE. Global account changes take all affected Organization/School guards in sorted order. This extends CORE-005 and prevents disable racing a command with cached entitlement. No acquiring an account lock after a scope lock.

## Planned tables and fields

All below are planned; this starter's only migrated table remains SetupCheck. `scope` is institution/branch. UUID IDs, integer positive version, TIMESTAMPTZ(3) instants. Scoped FK targets include matching UNIQUE keys.

| Owner / table | Stored fields | Constraints and indexes |
|---|---|---|
| `vs_access_institution_grant` (Access / InstitutionGrant) | id uuid PK; organization_id uuid; account_id uuid; role varchar(40) INSTITUTION_ADMIN; status varchar(20) ACTIVE/REVOKED; version int; granted_at timestamptz(3); granted_by uuid | FK institution/account; UNIQUE(organization_id,account_id,role); institution status lookup index |
| `vs_tenancy_organization_entitlement` (Tenancy / OrganizationEntitlement) | id uuid PK; organization_id uuid; module_id varchar(40); state varchar(20) ACTIVE/READ_ONLY/SUSPENDED/RETIRED; starts_at timestamptz(3); ends_at timestamptz(3) nullable; limits jsonb; manifest_version int; version int | UNIQUE(organization_id,module_id); module_id in deployed catalog; dates valid; contracted operator write only |
| `vs_tenancy_branch_activation` (Tenancy / BranchActivation) | id uuid PK; organization_id uuid; school_id uuid; module_id varchar(40); state varchar(20) DISABLED/PROVISIONING/ACTIVE/READ_ONLY/SUSPENDED/RETIRED; version int; enabled_at timestamptz(3) nullable | UNIQUE(scope,module_id); scoped School FK; index(scope,state,module_id); active requires entitlement via locked transaction |
| `vs_tenancy_configuration_change` (Tenancy / ConfigurationChange) | id uuid PK; organization_id uuid; school_id uuid nullable; actor_account_id uuid; expected_revision int; new_revision int; changes jsonb; reason varchar(500); occurred_at timestamptz(3); request_id uuid | Append-only; reason 5–500; index(organization_id,occurred_at,id); branch nullable for institution change |
| `vs_tenancy_tenant_command_receipt` (Tenancy / TenantCommandReceipt) | id uuid PK; organization_id uuid; actor_account_id uuid; command varchar(80); key varchar(100); input_hash char(64); response jsonb; created_at timestamptz(3) | UNIQUE(organization_id,actor_account_id,command,key); immutable; for institution commands without a branch; branch commands use shared CommandReceipt |
| `vs_tenancy_tenant_outbox` (Tenancy / TenantOutbox) | id uuid PK; organization_id uuid; type varchar(100); schema_version int; payload jsonb; occurred_at timestamptz(3); state varchar(20) PENDING/PROCESSING/DELIVERED/FAILED; attempts int default 0; available_at timestamptz(3) | FK organization; index(organization_id,state,available_at,id); attempts>=0; schema_version>0; immutable envelope except delivery state |

Organization and School existing planned tables remain Access-owned. Institution-level audit cannot be forced into a fake branch: ConfigurationChange plus TenantCommandReceipt is the explicit institution transaction evidence. Outbox institution event may need nullable schoolId with type-specific checks or a separate TenantOutbox table before TEN-02; choose separate TenantOutbox `{id,organizationId,type,schemaVersion,payload,occurredAt,state,attempts,availableAt}` and do not weaken branch outbox constraints. Payload contains configuration IDs/version, no pupil data.

## Read joins and authorization

Institution selector: current Account → active InstitutionGrant or active SchoolMembership → active Organization, DISTINCT institution IDs. Branch selector: current account's explicit active SchoolMembership → School → Organization; institution admin sees manageable branch metadata via branch.manage, not pupil records. Granting self operational access is a separately audited action allowed only within delegated policy. Overview contains configuration/health summaries only unless explicit report capability and branch grant set are supplied.

Entitlement view: OrganizationEntitlement LEFT JOIN BranchActivation on organizationId/moduleId and selected school, combined with immutable deployed catalog. Return `{moduleId,licensedState,activationState,releaseAvailable,effective,dependencies,blockingReasons,version}`; clients cannot mutate entitlement by posting this DTO. User menus use server-produced effective capabilities and are re-evaluated on context switch.

## Transport and state transitions

POST /api/v1/institutions/:id/branches requires institution branch.manage, input `{code,name,timezone,key}`; result safe branch metadata. POST /api/v1/context/switch accepts candidate institutionId/branchId, validates membership and returns new actor context; no trusting prior UI selection. Reads/commands use explicit scope rather than a mutable global server singleton.

POST /api/v1/branches/:id/modules/preview accepts desired module IDs, returns required foundations/dependents/obligations/blockers and configVersion. POST .../confirm binds desired state+preview hash+expectedVersion+reason/key. Operator entitlement editing is a separate authenticated use case. Unknown module→422; unlicensed/release-unavailable→409; revoked authority→403; foreign branch→404; stale preview→409. Persist receipt, config revision and TenantOutbox atomically. Fees obligations use a FinanceEligibility port; until Finance ships, releaseAvailable=false and no fake successful activation.

```mermaid
sequenceDiagram
  actor A as Institution administrator
  participant API as Configuration API
  participant P as ConfigureBranchModules
  participant O as Owner ports
  participant DB as PostgreSQL
  A->>API: Confirm preview hash, version and reason
  API->>P: Verified actor plus requested branch
  P->>O: Lock account, institution, branch; reauthorize
  O->>DB: Read current entitlement and activation
  DB-->>O: Current versions and states
  P->>O: Check released dependencies and obligations
  alt Configuration allowed
    O->>DB: Write activation, revision, audit, outbox, receipt
    DB-->>API: Committed effective capability version
    API-->>A: Confirmed configuration and onboarding
  else Stale, denied or unresolved obligation
    O-->>API: Typed conflict; no partial activation
    API-->>A: Explain blocker and safe next step
  end
```

## RLS and release verification

TEN-03 creates restricted runtime/migration roles and policies on every protected school-owned table; scope comes from server-verified membership and is set transaction-locally. Test raw SQL from runtime role cannot read/write another institution or branch, WITH CHECK rejects forged inserts, pooled reuse after A→B leaves no stale settings, background jobs/export paths set scope, and operator/public-brand access cannot become a bypass. Provider role creation may require deployment-specific credentials; finish all local proof and record the concrete production gate before claiming ready. Add quotas for import bytes/rows, per-tenant process concurrency and per-user commands. Cross-branch reporting must enumerate authorized branch IDs. No benchmark is inferred from reference-domain unit tests.


## TEN-01 — Provision institutions/branches and switch authorized context

Build InstitutionGrant and owner-facade institution/branch administration; retain School as branch storage. Implement selector reads and context switch, clearing previous protected drafts/caches. Add institution admin vs branch operational permission tests, cross-institution and same-institution other-branch denial. UI must use shared components and show current institution/branch consistently. Person binding is independently verified per institution. No implicit student grant from institution role.

**Manual demo:** Provision two institutions, two branches in one; sign in with a multi-branch user, switch branches and verify list context. Try an ungranted branch and confirm denial.

## TEN-02 — Persist and enforce module entitlements and activation

Implement OrganizationEntitlement, BranchActivation, TenantCommandReceipt, TenantOutbox and ConfigurationChange as designed. Operator grants contract; authorized institution admin previews/confirms activation. Require release availability and dependency closure; apply guards at business use-case commit and job boundaries, not only navigation. Reference policy in starter is a starting point, not completed enforcement. Add duplicate/stale/unlicensed/dependency-disabled tests and Attendance-only/Fees-only/combined policy matrix. Fees release remains unavailable until implemented; use synthetic policy tests for its independence.

**Manual demo:** Show contracted Attendance, enable in one branch, verify another remains disabled; direct protected command fails when disabled. Show Fees dependency preview without pretending Finance is implemented.

## TEN-03 — Prove tenant isolation and configuration recovery

Add reviewed PostgreSQL RLS policies/restricted roles, transaction-local scope, scoped export/job/cache enforcement and configuration revision invalidation. Test raw runtime SQL cross-branch/institution reads/writes, pooled connection reuse, disabled module racing submit and jobs, restore/reconciliation and operational quotas. Record deployment role permissions and benchmark contention before production; no bypass by owner/runtime role.

**Manual demo:** Run two institutions side by side; deny wrong-branch direct API and runtime SQL; disable a branch module and demonstrate safe in-flight behavior plus reactivation preserving data.

## Physical configuration revision and typed limits

Access-owned Organization and School contain configuration_version integer default 1, positive. Institution contract changes compare/increment Organization.configuration_version; branch activation changes compare/increment School.configuration_version. Preview pins both institution and branch revisions; confirmation rejects a changed entitlement revision even if the branch revision is unchanged. ConfigurationChange.expected_revision/new_revision records the guard revision for its institution/branch target. Individual entitlement/activation version remains that root’s optimistic version. Revisions and immutable receipt/audit/outbox commit together. Module limits use manifest_version plus a validated module-specific JSON shape (allowed quota keys only, nonnegative bounded integers, no arbitrary tenant SQL or feature code).

BrandProfile public_slug is globally unique lowercase [a-z0-9] plus internal hyphens, 3–80 characters, exact lookup; publication never enumerates private memberships. Brand owner-null scope comparisons require IS NOT DISTINCT FROM or equivalent reviewed guards, not a nullable foreign key shortcut.

## Portable backend integration

Follow [the backend extraction contract](../../BACKEND_EXTRACTION.md). Server module code belongs in backend/modules; UI consumes shared/contracts and a module gateway. Next delivery adapters resolve transport/session and invoke portable use cases. Future Nest controllers and provider factories reuse those use cases. Framework-specific context/ORM results never enter domain or browser DTOs.
