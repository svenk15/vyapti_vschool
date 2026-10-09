# vs_academics_school_calendar — SchoolCalendar

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** One calendar root per school year; no current pointer until publication.

**Registry constraint summary:** UNIQUE(scope,year_id); UNIQUE(scope,id); FK year; deferred current_revision scoped FK added in SQL

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_school_calendar_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `yearId` | `year_id` | `Uuid` | `no` | `@map("year_id") @db.Uuid` |
| `currentRevisionId` | `current_revision_id` | `Uuid` | `yes` | `@map("current_revision_id") @db.Uuid` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_school_calendar_school_fkey")
year AcademicYear @relation(fields:[organizationId,schoolId,yearId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_school_calendar_year_fkey")
revisions CalendarRevision[] @relation("AcademicCalendarHistory")
currentRevision CalendarRevision? @relation("AcademicCalendarCurrent",fields:[organizationId,schoolId,id,currentRevisionId],references:[organizationId,schoolId,calendarId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_school_calendar_current_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,yearId],map:"vs_academics_school_calendar_year_key")
@@unique([organizationId,schoolId,id],map:"vs_academics_school_calendar_scope_id_key")
@@map("vs_academics_school_calendar")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
