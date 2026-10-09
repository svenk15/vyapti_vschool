# vs_attendance_session — AttendanceSession

Observed source schema, not a new migration. Owner: attendance.

**Responsibility:** One actual offering occurrence; retains calendar version and scope. School timezone used to validate local date.

**Registry constraint summary:** Scoped Offering/CalendarRevision FKs; UNIQUE(scope,offering_id,occurrence_key); UNIQUE(scope,id); CHECK starts<ends, known status and version>=1; index(scope,school_date,status,starts_at,id).

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "attendance", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_attendance_session_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `offeringId` | `offering_id` | `Uuid` | `no` | `@map("offering_id") @db.Uuid` |
| `schoolDate` | `school_date` | `Date` | `no` | `@map("school_date") @db.Date` |
| `startsAt` | `starts_at` | `Timestamptz(3)` | `no` | `@map("starts_at") @db.Timestamptz(3)` |
| `endsAt` | `ends_at` | `Timestamptz(3)` | `no` | `@map("ends_at") @db.Timestamptz(3)` |
| `occurrenceKey` | `occurrence_key` | `VarChar(80)` | `no` | `@map("occurrence_key") @db.VarChar(80)` |
| `calendarRevisionId` | `calendar_revision_id` | `Uuid` | `no` | `@map("calendar_revision_id") @db.Uuid` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |
| `rosterRevision` | `roster_revision` | `Char(64)` | `yes` | `@map("roster_revision") @db.Char(64)` |
| `openedAt` | `opened_at` | `Timestamptz(3)` | `yes` | `@map("opened_at") @db.Timestamptz(3)` |
| `submittedAt` | `submitted_at` | `Timestamptz(3)` | `yes` | `@map("submitted_at") @db.Timestamptz(3)` |
| `submittedBy` | `submitted_by` | `Uuid` | `yes` | `@map("submitted_by") @db.Uuid` |
| `cancelledAt` | `cancelled_at` | `Timestamptz(3)` | `yes` | `@map("cancelled_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
offering CourseOffering @relation(fields:[organizationId,schoolId,offeringId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_session_offering_fkey")
calendarRevision CalendarRevision @relation("AttendanceSessionCalendarRevision",fields:[organizationId,schoolId,calendarRevisionId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_session_calendar_revision_fkey")
rosterEntries SessionRosterEntry[]
attendanceRecords AttendanceRecord[]
revisions AttendanceRevision[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_attendance_session_scope_id_key")
@@unique([organizationId,schoolId,offeringId,occurrenceKey],map:"vs_attendance_session_occurrence_key")
@@index([organizationId,schoolId,schoolDate,status,startsAt,id],map:"vs_attendance_session_school_day_idx")
@@map("vs_attendance_session")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
