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

The migrated checkpoint before TEN-01 has 13 tables through IAM-03. TEN-01 installs InstitutionGrant and the institution evidence tables; entitlements/activation remain TEN-02. `scope` is institution/branch. UUID IDs, integer positive version, TIMESTAMPTZ(3) instants. Scoped FK targets include matching UNIQUE keys.

| Owner / table | Stored fields | Constraints and indexes |
|---|---|---|
| `vs_access_institution_grant` (Access / InstitutionGrant) | id uuid PK; organization_id uuid; account_id uuid; role varchar(40) INSTITUTION_ADMIN; status varchar(20) ACTIVE/REVOKED; version int; granted_at timestamptz(3); granted_by uuid | FKs organization/account; UNIQUE(organization_id,account_id,role); INDEX(account_id,status,organization_id); role/status/version checks |
| `vs_tenancy_organization_entitlement` (Tenancy / OrganizationEntitlement) | id uuid PK; organization_id uuid; module_id varchar(40); state varchar(20) ACTIVE/READ_ONLY/SUSPENDED/RETIRED; starts_at timestamptz(3); ends_at timestamptz(3) nullable; limits jsonb empty object; manifest_version int; version int | UNIQUE(organization_id,module_id); FK organization; module_id in static catalog; state/date/version checks; limits restricted to empty object until typed quotas ship; contracted operator write only |
| `vs_tenancy_branch_activation` (Tenancy / BranchActivation) | id uuid PK; organization_id uuid; school_id uuid; module_id varchar(40); state varchar(20) DISABLED/PROVISIONING/ACTIVE/READ_ONLY/SUSPENDED/RETIRED; version int; enabled_at timestamptz(3) nullable | UNIQUE(organization_id,school_id,module_id); composite scoped School FK plus Organization FK; index(scope,state,module_id); state/version/enabled_at consistency; active requires entitlement via locked transaction |
| `vs_tenancy_configuration_change` (Tenancy / ConfigurationChange) | id uuid PK; organization_id uuid; school_id uuid nullable; actor_account_id uuid; expected_revision int; new_revision int; changes jsonb; reason varchar(500); occurred_at timestamptz(3); request_id uuid | FKs organization, scoped nullable School and actor account; indexes for institution/branch history and actor; new_revision=expected_revision+1; reason 5–500; append-only |
| `vs_tenancy_tenant_command_receipt` (Tenancy / TenantCommandReceipt) | id uuid PK; organization_id uuid; actor_account_id uuid; command varchar(80); key varchar(100); input_hash char(64); response jsonb; created_at timestamptz(3) | FKs organization/actor; UNIQUE(organization_id,actor_account_id,command,key); INDEX(actor_account_id); input_hash SHA-256; immutable |
| `vs_tenancy_tenant_outbox` (Tenancy / TenantOutbox) | id uuid PK; organization_id uuid; type varchar(100); schema_version int; payload jsonb; occurred_at timestamptz(3); state varchar(20) PENDING/PROCESSING/DELIVERED/FAILED; attempts int default 0; available_at timestamptz(3) | FK organization; index(organization_id,state,available_at,id); attempts>=0; schema_version>0; immutable envelope except delivery state |

Organization and School remain Access-owned. Institution-level audit is never forced into a fake branch: TEN-01 installed ConfigurationChange, TenantCommandReceipt and TenantOutbox for genuine institution transaction evidence. TEN-02 reuses these contracts and adds only OrganizationEntitlement and BranchActivation; it does not create duplicate evidence tables. TenantOutbox stays separate from branch OutboxEvent and carries no pupil data.

## Read joins and authorization

Institution selector: current Account → active InstitutionGrant or active SchoolMembership → active Organization, DISTINCT institution IDs. Branch selector: current account's explicit active SchoolMembership → School → Organization; institution admin sees manageable branch metadata via branch.manage, not pupil records. Granting self operational access is a separately audited action allowed only within delegated policy. Overview contains configuration/health summaries only unless explicit report capability and branch grant set are supplied.

Entitlement view: OrganizationEntitlement LEFT JOIN BranchActivation on organizationId/moduleId and selected school, combined with a server-owned immutable deployed release catalog. Return `{moduleId,licensedState,activationState,releaseAvailable,effective,dependencies,blockingReasons,version}`; clients cannot mutate entitlement or claim a release by posting this DTO. Current checkout release availability is false for every product module because the underlying Student, Academic, Staff, Attendance, Fees and other product workflows have not shipped here. Contracted entitlement is still recordable, but activation confirmation for an unavailable release returns `409 RELEASE_UNAVAILABLE`; no menu or protected command is enabled. Tests may supply an immutable test manifest to prove the positive licensing/activation matrix without making the local runtime claim those products are released. User menus use server-produced effective capabilities and are re-evaluated on context switch.

## Transport and state transitions

POST /api/v1/institutions/:id/branches requires institution branch.manage, input `{code,name,timezone,key}`; result safe branch metadata. POST /api/v1/context/switch accepts candidate institutionId/branchId, validates membership and returns new actor context; no trusting prior UI selection. Reads/commands use explicit scope rather than a mutable global server singleton.

POST /api/v1/branches/:id/modules/preview accepts desired module IDs, returns required foundations/dependents/obligations/blockers and pinned institution/branch config revisions. POST .../confirm binds desired state+preview hash+expected root/config versions+reason/key. A verified platform operator's trusted CLI records institution contracts; an active institution admin with `module.configure` previews/confirms activation only within an already operationally granted branch. Neither authority implies the other. Unknown module→422; unlicensed, dependency-disabled or release-unavailable→409; revoked authority→403; foreign branch→404; stale preview→409; malformed or unknown limits→422. A denied confirmation writes no configuration change, receipt or outbox. A successful contract/activation updates the appropriate configuration revision and root version, and persists ConfigurationChange, TenantCommandReceipt and TenantOutbox in the same transaction; exact replay is reauthorized, input-hash checked and returns the original response. Fees obligations use a FinanceEligibility port; until Finance ships, releaseAvailable=false and no fake successful activation.

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

Implement only OrganizationEntitlement and BranchActivation: receipt, audit and outbox tables are already installed and owned by TEN-01. A trusted verified platform operator records institution entitlements; active institution admins with `module.configure` preview and confirm branch activation inside explicit operational membership. Enforce release availability and dependency closure with a server-owned manifest; never accept `releaseAvailable` from a client. In this checkout no product module release is available, including Attendance, because its required product workflows are not implemented. Therefore the running demo must show a contracted Attendance entitlement, an unavailable-release blocker, disabled branch capabilities and a denied protected-module authorization check. Prove the positive Attendance-only, Fees-only and combined activation matrix, disabled-module guard, concurrent disable guard and transaction rollback using a controlled immutable test release manifest against PostgreSQL; this fixture is test-only and never exposed by the running app. Fees remains unavailable and has no Finance behavior. Each later module implementation must register its real release availability and invoke the Tenancy module-authorization facade inside its business commit/job transaction; no attendance business action exists in this checkpoint to integrate prematurely.

**Manual demo:** Record an Attendance contract with the verified operator CLI; inspect the branch capability view and see `releaseAvailable:false` with disabled activation. Attempt activation and a protected-module authorization; expect `409 RELEASE_UNAVAILABLE` and denial respectively, with no partial evidence writes. Preview Fees and confirm its dependency/release blockers. Controlled PostgreSQL/unit tests exercise successful branch activation with a test-only released Attendance manifest, verify another branch remains disabled, and prove Fees can be enabled without Attendance when its release is modeled as available.

## TEN-03 — Prove tenant isolation and configuration recovery

Add reviewed PostgreSQL RLS policies/restricted roles, transaction-local scope, scoped export/job/cache enforcement and configuration revision invalidation. Test raw runtime SQL cross-branch/institution reads/writes, pooled connection reuse, disabled module racing submit and jobs, restore/reconciliation and operational quotas. Record deployment role permissions and benchmark contention before production; no bypass by owner/runtime role.

**Manual demo:** Run two institutions side by side; deny wrong-branch direct API and runtime SQL; disable a branch module and demonstrate safe in-flight behavior plus reactivation preserving data.

## Physical configuration revision and typed limits

Access-owned Organization and School contain configuration_version integer default 1, positive. Institution contract changes compare/increment Organization.configuration_version; branch activation changes compare/increment School.configuration_version. Preview pins both institution and branch revisions; confirmation rejects a changed entitlement revision even if the branch revision is unchanged. ConfigurationChange.expected_revision/new_revision records the guard revision for its institution/branch target. Individual entitlement/activation version remains that root’s optimistic version. Revisions and immutable receipt/audit/outbox commit together. Module limits use manifest_version plus a validated module-specific JSON shape (allowed quota keys only, nonnegative bounded integers, no arbitrary tenant SQL or feature code).

BrandProfile public_slug is globally unique lowercase [a-z0-9] plus internal hyphens, 3–80 characters, exact lookup; publication never enumerates private memberships. Brand owner-null scope comparisons require IS NOT DISTINCT FROM or equivalent reviewed guards, not a nullable foreign key shortcut.

Until a released module defines a typed quota shape, `limits` accepts only the empty JSON object. Unknown/free-form keys are rejected; TEN-02 does not store tenant SQL or feature flags in this column.

## Portable backend integration

Follow [the backend extraction contract](../../BACKEND_EXTRACTION.md). Server module code belongs in backend/modules; UI consumes shared/contracts and a module gateway. Next delivery adapters resolve transport/session and invoke portable use cases. Future Nest controllers and provider factories reuse those use cases. Framework-specific context/ORM results never enter domain or browser DTOs.


## TEN-ADR-004 — TEN-01 authority, commands and context (4 October 2026)

Owner authorized proceeding after the recommended operator-only policy was presented. Verified local operator alone grants/revokes InstitutionGrant and explicitly attaches/revokes existing UserAccount branch membership. Institution administrators create branches through branch.manage but cannot grant themselves or others operational access. Existing IAM-02 branch administrators retain same-institution staff management within their already granted branch; institution authority never bypasses that boundary. No implicit account lookup/attachment by email across institutions and no operational access from InstitutionGrant. PER-01 adds the empty AccountPersonBinding schema; only the explicit verified PER-02 workflow may create binding rows.

Operator commands CreateInstitution, SetInstitutionGrant and SetBranchMembership accept explicit organizationId/accountId, stable UUID key and non-sensitive reason (5–500). CreateInstitution uses a new explicit organization UUID/name and an existing non-disabled account, grants institution authority only, and allows deliberate duplicate institution names. SetInstitutionGrant takes expectedVersion (0 for absent) and ACTIVE/REVOKED; granted_by records the verified operator UUID (no UserAccount FK/impersonation). SetBranchMembership takes schoolId, expectedVersion (0 absent), ACTIVE/REVOKED and fixed roles; active requires active account, revoked last school admin is rejected with LAST_ADMIN. Operator evidence names principalKind/operatorId, subject account ID and changed grant IDs/versions, never email/credentials. Existing IAM-01 bootstrap remains separate and unchanged.

CreateBranch accepts code (uppercase ASCII [A-Z0-9_-], 1–40), name (NFC/trim, 1–160), IANA timezone, expectedRevision, UUID key and reason. Current active INSTITUTION_ADMIN grants branch.manage/institution.manage metadata only. Branch creation grants no membership and enables no operational module. Maximum 100 branches per institution, duplicate scoped code CONFLICT; stale revision STALE_VERSION. All command writes and evidence are atomic; replay reauthorizes then compares canonical typed input hash before version checks, changed intent IDEMPOTENCY_CONFLICT. Account locks sorted, Organization FOR UPDATE, then existing School FOR UPDATE; known serialization/deadlock aborts retry at most three, unknown outcome uses same key.

Move ConfigurationChange, TenantCommandReceipt and TenantOutbox installation forward from TEN-02 to TEN-01 to support genuine institution-scoped atomic evidence, not fake branch envelopes. Tenancy owns evidence via an enlisted typed owner port; Access owns identity/grant/branch writes. Operator evidence actor_account_id is the subject/provenance anchor and payload explicitly identifies OPERATOR; user commands record actual actor. Changes contain typed command, safe subject/resource/version fields and principal, reason; no pupil data. ConfigurationChange branch FK is composite (organization_id,school_id), nullable only for institution changes; actor/organization FKs, new_revision=expected_revision+1, positive revisions and append-only guards. Tenant receipts have organization/actor FKs and immutable guards. Outbox has organization FK and immutable envelope with mutable delivery fields only. InstitutionGrant has organization/account FKs, positive version, constrained role/status and account lookup index.

GET /api/v1/context returns bounded institution/branch metadata (100 institutions, 100 branches each; fail closed on overflow). Current active account/version, institution and branch statuses, institution grants and memberships/role grants are checked in one repeatable-read snapshot. Manageable branches are marked selectable only with explicit active membership/fixed role. POST /api/v1/context/switch validates institutionId/branchId together and returns current operational context. Selection is an HttpOnly SameSite=Lax candidate cookie bound to accountId; every existing protected page/API resolves it again, explicit schoolId deep links still reauthorize their candidate. Invalid/revoked selected scope fails closed rather than falling back to another branch. No singleton mutable context. Switch UI warns before discarding drafts, uses full-document navigation to clear React/query state, retains no protected localStorage, and refreshes navigation/capabilities. /institutions supports institution-only accounts; /account redirects such accounts there. Sign-out/account mismatch cannot reuse candidate authority. Cross-tab browser back restores trigger a fresh server reload.

Transport uses same-origin mutation checks, bounded 8 KiB JSON, no-store, safe 401/403/404/422/409/503. UI has empty/no access, load/storage error, invalid input, submitting, conflict, unknown result/same-key retry and success. PostgreSQL tests cover scoped FK/immutability, concurrent duplicate/replay, actual enlisted evidence rollback, stale/current authority, revocation and institution-vs-branch isolation. Playwright desktop/mobile covers provisioning metadata, persisted branch creation/retry, switching context and draft discard warning, direct same/foreign institution denial and forged-origin requests. No entitlement, production RLS or Person binding completion is inferred.
