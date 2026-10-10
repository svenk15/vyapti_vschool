# vs_students_student — Student

Observed source schema, not a new migration. Owner: students.

**Responsibility:** Students-owned branch identity and admission number; the Person remains People-owned and is never inferred by name or email.

**Registry constraint summary:** FK(scope)→School; FK(organization_id,person_id)→Person; FK admission_date_verified_by→UserAccount; UNIQUE(scope,id); UNIQUE(scope,admission_number); UNIQUE(scope,person_id); CHECK status/version/admission_number and coherent date evidence; index(scope,status,id)

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "students", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_students_student_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `personId` | `person_id` | `Uuid` | `no` | `@map("person_id") @db.Uuid` |
| `admissionNumber` | `admission_number` | `VarChar(40)` | `no` | `@map("admission_number") @db.VarChar(40)` |
| `admittedOn` | `admitted_on` | `Date` | `yes` | `@map("admitted_on") @db.Date` |
| `admissionDateVerifiedAt` | `admission_date_verified_at` | `Timestamptz(3)` | `yes` | `@map("admission_date_verified_at") @db.Timestamptz(3)` |
| `admissionDateVerifiedBy` | `admission_date_verified_by` | `Uuid` | `yes` | `@map("admission_date_verified_by") @db.Uuid` |
| `admissionDateVerificationReason` | `admission_date_verification_reason` | `VarChar(500)` | `yes` | `@map("admission_date_verification_reason") @db.VarChar(500)` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_students_student_school_fkey")
person Person @relation(fields:[organizationId,personId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_students_student_person_fkey")
enrollments Enrollment[]
sourceMaps SourceStudentMap[]
attendanceRosterEntries SessionRosterEntry[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_students_student_scope_id_key")
@@unique([organizationId,schoolId,admissionNumber],map:"vs_students_student_admission_key")
@@unique([organizationId,schoolId,personId],map:"vs_students_student_person_key")
@@index([organizationId,schoolId,status,id],map:"vs_students_student_list_idx")
@@map("vs_students_student")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
