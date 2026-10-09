# vs_academics_calendar_exception — CalendarException

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** Date exception; campus beats school beats weekly rule. Dates inside year.

**Registry constraint summary:** Scoped revision/campus FKs; two NULL/non-NULL partial unique indexes(scope,revision_id,on_date[,campus_id]); immutable

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_calendar_exception_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `revisionId` | `revision_id` | `Uuid` | `no` | `@map("revision_id") @db.Uuid` |
| `campusId` | `campus_id` | `Uuid` | `yes` | `@map("campus_id") @db.Uuid` |
| `onDate` | `on_date` | `Date` | `no` | `@map("on_date") @db.Date` |
| `isTeachingDay` | `is_teaching_day` | `boolean` | `no` | `@map("is_teaching_day")` |
| `label` | `label` | `VarChar(160)` | `no` | `@db.VarChar(160)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
revision CalendarRevision @relation(fields:[organizationId,schoolId,revisionId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_calendar_exception_revision_fkey")
campus Campus? @relation(fields:[organizationId,schoolId,campusId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_calendar_exception_campus_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId,schoolId,revisionId,onDate],map:"vs_academics_calendar_exception_date_idx")
@@map("vs_academics_calendar_exception")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
