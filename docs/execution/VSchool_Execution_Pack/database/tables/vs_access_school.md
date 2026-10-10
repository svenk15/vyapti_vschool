# vs_access_school — School

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Operational scope and serialization guard. Timezone immutable after branch creation in Phase 1.

**Registry constraint summary:** FK organization; UNIQUE(organization_id,id); UNIQUE(organization_id,code); CHECK configuration_version>0

**Tenant classification / intended RLS:** `{"classification": "BRANCH_DIRECTORY", "scopeColumns": ["organization_id", "id"], "intendedPolicy": "Require verified institution/branch context and current membership; directory visibility grants no pupil access.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_access_school_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `code` | `code` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `name` | `name` | `VarChar(160)` | `no` | `@db.VarChar(160)` |
| `timezone` | `timezone` | `VarChar(64)` | `no` | `@db.VarChar(64)` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |
| `configurationVersion` | `configuration_version` | `integer` | `no` | `@default(1) @map("configuration_version")` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization         Organization       @relation(fields: [organizationId], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "vs_access_school_r0_fkey")
configurationChanges ConfigurationChange[]
campuses             Campus[]
memberships          SchoolMembership[]
auditEntries         AuditEntry[]
exportRuns          ExportRun[]
outboxEvents         OutboxEvent[]
commandReceipts      CommandReceipt[]
moduleActivations BranchActivation[]
brandProfiles BrandProfile[]
brandAssets BrandAsset[]
verifiedBrandHosts VerifiedBrandHost[]
academicYears AcademicYear[]
academicGrades GradeLevel[]
academicSubjects Subject[]
academicSections Section[]
academicCalendars SchoolCalendar[]
employees Employee[]
accessInvites AccessInvite[]
students Student[]
importJobs ImportJob[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId, id], map: "vs_access_school_u0_key")
@@unique([organizationId, code], map: "vs_access_school_u1_key")
@@index([organizationId], map: "vs_access_school_r0_idx")
@@map("vs_access_school")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
