# vs_attendance_record — AttendanceRecord

Observed source schema, not a new migration. Owner: attendance.

**Responsibility:** Current submitted status; one per roster pupil. No blank record stored before submit.

**Registry constraint summary:** FK(scope,session_id,student_id)→SessionRosterEntry UNIQUE(scope,session_id,student_id); UNIQUE(scope,session_id,student_id); CHECK recognized status; CHECK (status='LATE' AND late_minutes BETWEEN 1 AND 480) OR (status<>'LATE' AND late_minutes IS NULL); current_revision>=1; unique key supports roster join

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require organization_id and school_id tenant context plus active membership; application checks current attendance permission and dated assignment; WITH CHECK binds both keys. Owner/operator exceptions remain TEN-03-controlled.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "attendance", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_attendance_record_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `sessionId` | `session_id` | `Uuid` | `no` | `@map("session_id") @db.Uuid` |
| `studentId` | `student_id` | `Uuid` | `no` | `@map("student_id") @db.Uuid` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `lateMinutes` | `late_minutes` | `integer` | `yes` | `@map("late_minutes")` |
| `currentRevision` | `current_revision` | `integer` | `no` | `@map("current_revision")` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
session AttendanceSession @relation(fields:[organizationId,schoolId,sessionId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_record_session_fkey")
rosterEntry SessionRosterEntry @relation(fields:[organizationId,schoolId,sessionId,studentId],references:[organizationId,schoolId,sessionId,studentId],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_record_roster_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,sessionId,studentId],map:"vs_attendance_record_session_student_key")
@@map("vs_attendance_record")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
