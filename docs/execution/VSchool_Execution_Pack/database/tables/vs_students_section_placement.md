# vs_students_section_placement — SectionPlacement

Observed source schema, not a new migration. Owner: students.

**Responsibility:** Students-owned section membership intervals referencing Academics Section; no duplicated year/student roots on enrollment. Roll is display text, not a globally unique identity.

**Registry constraint summary:** Scoped FK(enrollment_id,year_id) and FK(section_id,year_id); CHECK from<to; index(scope,section_id,valid_from,valid_to,enrollment_id) for roster; index(scope,enrollment_id,valid_from) for timeline; interval nonoverlap guarded by School serialization and verified PostgreSQL concurrency tests

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "students", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_students_section_placement_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `enrollmentId` | `enrollment_id` | `Uuid` | `no` | `@map("enrollment_id") @db.Uuid` |
| `yearId` | `year_id` | `Uuid` | `no` | `@map("year_id") @db.Uuid` |
| `sectionId` | `section_id` | `Uuid` | `no` | `@map("section_id") @db.Uuid` |
| `validFrom` | `valid_from` | `Date` | `no` | `@map("valid_from") @db.Date` |
| `validTo` | `valid_to` | `Date` | `no` | `@map("valid_to") @db.Date` |
| `rollNumber` | `roll_number` | `VarChar(30)` | `yes` | `@map("roll_number") @db.VarChar(30)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
enrollment Enrollment @relation(fields:[organizationId,schoolId,enrollmentId,yearId],references:[organizationId,schoolId,id,yearId],onDelete:Restrict,onUpdate:Restrict,map:"vs_students_section_placement_enrollment_fkey")
section Section @relation(fields:[organizationId,schoolId,sectionId,yearId],references:[organizationId,schoolId,id,yearId],onDelete:Restrict,onUpdate:Restrict,map:"vs_students_section_placement_section_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId,schoolId,sectionId,validFrom,validTo,enrollmentId],map:"vs_students_placement_roster_idx")
@@index([organizationId,schoolId,enrollmentId,validFrom],map:"vs_students_placement_history_idx")
@@map("vs_students_section_placement")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
