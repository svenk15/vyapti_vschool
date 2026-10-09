# vs_academics_calendar_revision — CalendarRevision

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** Immutable full policy snapshot. No generic mutable JSON calendar.

**Registry constraint summary:** UNIQUE(scope,calendar_id,number); UNIQUE(scope,calendar_id,id); FK calendar; published_by account; append-only guard

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_calendar_revision_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `calendarId` | `calendar_id` | `Uuid` | `no` | `@map("calendar_id") @db.Uuid` |
| `number` | `number` | `integer` | `no` | `—` |
| `teachingWeekdays` | `teaching_weekdays` | `integer[]` | `no` | `@map("teaching_weekdays")` |
| `publishedAt` | `published_at` | `Timestamptz(3)` | `no` | `@map("published_at") @db.Timestamptz(3)` |
| `publishedBy` | `published_by` | `Uuid` | `no` | `@map("published_by") @db.Uuid` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
calendar SchoolCalendar @relation("AcademicCalendarHistory",fields:[organizationId,schoolId,calendarId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_calendar_revision_calendar_fkey")
publisher UserAccount @relation("AcademicRevisionPublisher",fields:[publishedBy],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_calendar_revision_publisher_fkey")
exceptions CalendarException[]
attendanceSessions AttendanceSession[] @relation("AttendanceSessionCalendarRevision")
currentForCalendars SchoolCalendar[] @relation("AcademicCalendarCurrent")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,calendarId,number],map:"vs_academics_calendar_revision_number_key")
@@unique([organizationId,schoolId,calendarId,id],map:"vs_academics_calendar_revision_scope_calendar_id_key")
@@unique([organizationId,schoolId,id],map:"vs_academics_calendar_revision_scope_id_key")
@@index([organizationId,schoolId,calendarId,number],map:"vs_academics_calendar_revision_history_idx")
@@map("vs_academics_calendar_revision")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
