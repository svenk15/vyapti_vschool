# vs_imports_import_row — ImportRow

Observed source schema, not a new migration. Owner: imports.

**Responsibility:** Normalized bounded row and column-safe preview errors stay in owned ImportRow until terminal retention expiry; status changes in a School-guard transaction.

**Registry constraint summary:** FK(scope,job_id)→ImportJob; UNIQUE(scope,job_id,preview_revision,row_number); CHECK row 2–1001, decision/status values and nullable normalized object/expected-reference object/errors array shapes; index(scope,job_id,status,row_number); partial index(scope,job_id,row_number) where normalized is not null

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "imports", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_imports_import_row_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `jobId` | `job_id` | `Uuid` | `no` | `@map("job_id") @db.Uuid` |
| `previewRevision` | `preview_revision` | `integer` | `no` | `@map("preview_revision")` |
| `rowNumber` | `row_number` | `integer` | `no` | `@map("row_number")` |
| `inputHash` | `input_hash` | `Char(64)` | `no` | `@map("input_hash") @db.Char(64)` |
| `normalized` | `normalized` | `jsonb` | `yes` | `—` |
| `decision` | `decision` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `expectedReferences` | `expected_references` | `jsonb` | `no` | `@map("expected_references")` |
| `errors` | `errors` | `jsonb` | `no` | `@default("[]")` |
| `result` | `result` | `jsonb` | `yes` | `—` |
| `errorCode` | `error_code` | `VarChar(80)` | `yes` | `@map("error_code") @db.VarChar(80)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
job ImportJob @relation(fields:[organizationId,schoolId,jobId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_imports_import_row_job_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,jobId,previewRevision,rowNumber],map:"vs_imports_import_row_revision_row_key")
@@index([organizationId,schoolId,jobId,status,rowNumber],map:"vs_imports_import_row_status_idx")
@@map("vs_imports_import_row")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
