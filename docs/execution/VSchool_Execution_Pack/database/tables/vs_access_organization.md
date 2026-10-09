# vs_access_organization — Organization

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Contractual tenant; trust mode controls provisioning/recovery channels only; existing rows backfilled to OPERATOR_CLI.

**Registry constraint summary:** CHECK trust_mode allowed; CHECK version>0; UNIQUE(id); CHECK configuration_version>0

**Tenant classification / intended RLS:** `{"classification": "INSTITUTION_ROOT", "scopeColumns": ["id"], "intendedPolicy": "Require verified app.organization_id=id and current institution authorization; platform operator commands use a separately audited narrow path.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_access_organization_pkey") @db.Uuid` |
| `name` | `name` | `VarChar(160)` | `no` | `@db.VarChar(160)` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `trustMode` | `trust_mode` | `VarChar(20)` | `no` | `@default("OPERATOR_CLI") @map("trust_mode") @db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |
| `configurationVersion` | `configuration_version` | `integer` | `no` | `@default(1) @map("configuration_version")` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
schools              School[]
institutionGrants InstitutionGrant[]
configurationChanges ConfigurationChange[]
tenantReceipts TenantCommandReceipt[]
tenantOutbox TenantOutbox[]
entitlements OrganizationEntitlement[]
branchActivations BranchActivation[]
brandProfiles BrandProfile[]
brandAssets BrandAsset[]
verifiedBrandHosts VerifiedBrandHost[]
academicYears AcademicYear[]
academicGrades GradeLevel[]
academicSubjects Subject[]
people Person[]
accountPersonBindings AccountPersonBinding[]
accessInvites AccessInvite[]
passwordResetTokens PasswordResetToken[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@map("vs_access_organization")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
