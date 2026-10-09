# vs_imports_import_job — ImportJob

Observed source schema, not a new migration. Owner: imports.

**Responsibility:** Imports-owned job stores immutable source and SHA-256; source bytes expire after 7 days; terminal row details expire after 30 days. Audit excludes source hash/content and row data.

**Registry constraint summary:** Scoped School/year/nullable Campus FKs; global actor FK; UNIQUE(scope,id); index(scope,state,created_at,id); CHECK state/schema/hash/revision/version and octet_length(source_bytes)<=2097152 when nonnull; partial index(source_expires_at,id) where source_bytes is not null

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "imports", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_imports_import_job_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `no` | `@map("actor_account_id") @db.Uuid` |
| `yearId` | `year_id` | `Uuid` | `no` | `@map("year_id") @db.Uuid` |
| `campusId` | `campus_id` | `Uuid` | `yes` | `@map("campus_id") @db.Uuid` |
| `namespace` | `namespace` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `schemaVersion` | `schema_version` | `VarChar(40)` | `no` | `@map("schema_version") @db.VarChar(40)` |
| `state` | `state` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `fileHash` | `file_hash` | `Char(64)` | `no` | `@map("file_hash") @db.Char(64)` |
| `sourceBytes` | `source_bytes` | `bytea` | `yes` | `@map("source_bytes")` |
| `sourceExpiresAt` | `source_expires_at` | `Timestamptz(3)` | `no` | `@map("source_expires_at") @db.Timestamptz(3)` |
| `previewRevision` | `preview_revision` | `integer` | `no` | `@default(1) @map("preview_revision")` |
| `context` | `context` | `jsonb` | `no` | `—` |
| `confirmedAt` | `confirmed_at` | `Timestamptz(3)` | `yes` | `@map("confirmed_at") @db.Timestamptz(3)` |
| `version` | `version` | `integer` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_imports_import_job_school_fkey")
actor UserAccount @relation("ImportJobActor",fields:[actorAccountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_imports_import_job_actor_fkey")
year AcademicYear @relation(fields:[organizationId,schoolId,yearId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_imports_import_job_year_fkey")
campus Campus? @relation(fields:[organizationId,schoolId,campusId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_imports_import_job_campus_fkey")
rows ImportRow[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_imports_import_job_scope_id_key")
@@index([organizationId,schoolId,state,createdAt,id],map:"vs_imports_import_job_list_idx")
@@map("vs_imports_import_job")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
