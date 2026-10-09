# vs_academics_section — Section

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** Section in one year/grade/campus, including school-wide no-campus scope.

**Registry constraint summary:** Scoped FKs year/grade/campus; UNIQUE(scope,id,year_id); two partial UNIQUE indexes (scope,year_id,grade_id,code) WHERE campus_id IS NULL and (scope,year_id,grade_id,campus_id,code) WHERE NOT NULL

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_section_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `yearId` | `year_id` | `Uuid` | `no` | `@map("year_id") @db.Uuid` |
| `gradeId` | `grade_id` | `Uuid` | `no` | `@map("grade_id") @db.Uuid` |
| `campusId` | `campus_id` | `Uuid` | `yes` | `@map("campus_id") @db.Uuid` |
| `code` | `code` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `name` | `name` | `VarChar(160)` | `no` | `@db.VarChar(160)` |
| `active` | `active` | `boolean` | `no` | `—` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_section_school_fkey")
year AcademicYear @relation(fields:[organizationId,schoolId,yearId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_section_year_fkey")
grade GradeLevel @relation(fields:[organizationId,schoolId,gradeId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_section_grade_fkey")
campus Campus? @relation(fields:[organizationId,schoolId,campusId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_section_campus_fkey")
placements SectionPlacement[]
offerings CourseOffering[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id,yearId],map:"vs_academics_section_scope_year_id_key")
@@index([organizationId,schoolId,yearId,gradeId],map:"vs_academics_section_year_grade_idx")
@@map("vs_academics_section")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
