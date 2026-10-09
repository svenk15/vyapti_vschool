# vs_attendance_session_roster_entry — SessionRosterEntry

Observed source schema, not a new migration. Owner: attendance.

**Responsibility:** Exact membership, versions and minimal name/roll display frozen at OPEN. Access remains current. No mutable roster after OPEN in Phase 1.

**Registry constraint summary:** Scoped Session and Student FKs; UNIQUE(scope,session_id,student_id); CHECK both snapshot versions>=1; immutable trigger; session cancellation retains rows; unique key supports read and record join

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require organization_id and school_id tenant context plus active membership; application checks current attendance permission and dated assignment; WITH CHECK binds both keys. Owner/operator exceptions remain TEN-03-controlled.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "attendance", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_attendance_session_roster_entry_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `sessionId` | `session_id` | `Uuid` | `no` | `@map("session_id") @db.Uuid` |
| `studentId` | `student_id` | `Uuid` | `no` | `@map("student_id") @db.Uuid` |
| `studentVersion` | `student_version` | `integer` | `no` | `@map("student_version")` |
| `enrollmentVersion` | `enrollment_version` | `integer` | `no` | `@map("enrollment_version")` |
| `displayNameSnapshot` | `display_name_snapshot` | `VarChar(210)` | `no` | `@map("display_name_snapshot") @db.VarChar(210)` |
| `rollNumberSnapshot` | `roll_number_snapshot` | `VarChar(30)` | `yes` | `@map("roll_number_snapshot") @db.VarChar(30)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
session AttendanceSession @relation(fields:[organizationId,schoolId,sessionId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_session_roster_entry_session_fkey")
student Student @relation(fields:[organizationId,schoolId,studentId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_session_roster_entry_student_fkey")
record AttendanceRecord?
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,sessionId,studentId],map:"vs_attendance_session_roster_entry_student_key")
@@map("vs_attendance_session_roster_entry")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
