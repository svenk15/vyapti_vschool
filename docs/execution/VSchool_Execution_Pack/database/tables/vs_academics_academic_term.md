# vs_academics_academic_term — AcademicTerm

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** Owned by year; no overlapping intervals; all within year.

**Registry constraint summary:** FK(scope,year_id); UNIQUE(scope,year_id,code); CHECK starts_on<ends_on; index(scope,year_id,starts_on)

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_academic_term_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `yearId` | `year_id` | `Uuid` | `no` | `@map("year_id") @db.Uuid` |
| `code` | `code` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `name` | `name` | `VarChar(160)` | `no` | `@db.VarChar(160)` |
| `startsOn` | `starts_on` | `Date` | `no` | `@map("starts_on") @db.Date` |
| `endsOn` | `ends_on` | `Date` | `no` | `@map("ends_on") @db.Date` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
year AcademicYear @relation(fields:[organizationId,schoolId,yearId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_academic_term_year_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,yearId,code],map:"vs_academics_academic_term_code_key")
@@index([organizationId,schoolId,yearId,startsOn],map:"vs_academics_academic_term_range_idx")
@@map("vs_academics_academic_term")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
