# vs_reporting_export_run — ExportRun

Observed source schema, not a new migration. Owner: reporting.

**Responsibility:** Synchronous bounded export metadata, no public stored CSV. GENERATED means the bytes were prepared, not that browser received them.

**Registry constraint summary:** Composite FK(scope)->School and FK(actor_account_id)->UserAccount; CHECK state in GENERATED/FAILED, row_count>=0, object filters and null-or-lowercase-SHA256 content_hash; index(scope,requested_at,id); no raw exported CSV, pupil data, or credentials

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "reporting", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_reporting_export_run_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `no` | `@map("actor_account_id") @db.Uuid` |
| `filters` | `filters` | `jsonb` | `no` | `—` |
| `requestedAt` | `requested_at` | `Timestamptz(3)` | `no` | `@map("requested_at") @db.Timestamptz(3)` |
| `state` | `state` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `rowCount` | `row_count` | `integer` | `no` | `@map("row_count")` |
| `contentHash` | `content_hash` | `Char(64)` | `yes` | `@map("content_hash") @db.Char(64)` |
| `requestId` | `request_id` | `Uuid` | `no` | `@map("request_id") @db.Uuid` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_reporting_export_run_school_fkey")
actorAccount UserAccount @relation(fields:[actorAccountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_reporting_export_run_actor_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId,schoolId,requestedAt,id],map:"vs_reporting_export_run_list_idx")
@@map("vs_reporting_export_run")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
