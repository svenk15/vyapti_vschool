# vs_academics_academic_year — AcademicYear

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** Half-open year; terms are editable only while DRAFT. Multiple open years permitted if dates/business selection are explicit.

**Registry constraint summary:** UNIQUE(scope,id); UNIQUE(scope,code); CHECK dates, status, version, code and name

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_academic_year_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `code` | `code` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `name` | `name` | `VarChar(160)` | `no` | `@db.VarChar(160)` |
| `startsOn` | `starts_on` | `Date` | `no` | `@map("starts_on") @db.Date` |
| `endsOn` | `ends_on` | `Date` | `no` | `@map("ends_on") @db.Date` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_academic_year_org_fkey")
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_academic_year_school_fkey")
terms AcademicTerm[]
calendar SchoolCalendar?
sections Section[]
offerings CourseOffering[]
enrollments Enrollment[]
importJobs ImportJob[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_academics_academic_year_scope_id_key")
@@unique([organizationId,schoolId,code],map:"vs_academics_academic_year_code_key")
@@map("vs_academics_academic_year")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
