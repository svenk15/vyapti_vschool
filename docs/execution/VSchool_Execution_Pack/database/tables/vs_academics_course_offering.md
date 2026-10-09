# vs_academics_course_offering — CourseOffering

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** One section subject offering in year.

**Registry constraint summary:** UNIQUE(scope,year_id,code); UNIQUE(scope,year_id,section_id,subject_id); scoped year, section/year and subject composite FKs; UNIQUE(scope,id); CHECK version>0 and code format

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_course_offering_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `yearId` | `year_id` | `Uuid` | `no` | `@map("year_id") @db.Uuid` |
| `sectionId` | `section_id` | `Uuid` | `no` | `@map("section_id") @db.Uuid` |
| `subjectId` | `subject_id` | `Uuid` | `no` | `@map("subject_id") @db.Uuid` |
| `code` | `code` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `version` | `version` | `integer` | `no` | `—` |
| `active` | `active` | `boolean` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
year AcademicYear @relation(fields:[organizationId,schoolId,yearId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_course_offering_year_fkey")
section Section @relation(fields:[organizationId,schoolId,sectionId,yearId],references:[organizationId,schoolId,id,yearId],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_course_offering_section_fkey")
subject Subject @relation(fields:[organizationId,schoolId,subjectId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_course_offering_subject_fkey")
assignments TeacherAssignment[]
sessions AttendanceSession[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_academics_course_offering_scope_id_key")
@@unique([organizationId,schoolId,yearId,code],map:"vs_academics_course_offering_code_key")
@@unique([organizationId,schoolId,yearId,sectionId,subjectId],map:"vs_academics_course_offering_section_subject_key")
@@map("vs_academics_course_offering")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
