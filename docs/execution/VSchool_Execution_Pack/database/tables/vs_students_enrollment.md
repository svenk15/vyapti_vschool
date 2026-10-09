# vs_students_enrollment — Enrollment

Observed source schema, not a new migration. Owner: students.

**Responsibility:** One Students-owned yearly root per Student and Academics-owned AcademicYear; retained half-open historical range.

**Registry constraint summary:** UNIQUE(scope,student_id,year_id); UNIQUE(scope,id,year_id); scoped Student/Year FKs; CHECK from<to and version>=1; index(scope,student_id,year_id) via unique key

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "students", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_students_enrollment_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `studentId` | `student_id` | `Uuid` | `no` | `@map("student_id") @db.Uuid` |
| `yearId` | `year_id` | `Uuid` | `no` | `@map("year_id") @db.Uuid` |
| `validFrom` | `valid_from` | `Date` | `no` | `@map("valid_from") @db.Date` |
| `validTo` | `valid_to` | `Date` | `no` | `@map("valid_to") @db.Date` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
student Student @relation(fields:[organizationId,schoolId,studentId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_students_enrollment_student_fkey")
year AcademicYear @relation(fields:[organizationId,schoolId,yearId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_students_enrollment_year_fkey")
placements SectionPlacement[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id,yearId],map:"vs_students_enrollment_scope_year_id_key")
@@unique([organizationId,schoolId,studentId,yearId],map:"vs_students_enrollment_student_year_key")
@@map("vs_students_enrollment")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
