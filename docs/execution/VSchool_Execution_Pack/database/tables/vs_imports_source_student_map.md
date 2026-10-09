# vs_imports_source_student_map — SourceStudentMap

Observed source schema, not a new migration. Owner: imports.

**Responsibility:** Stable cross-job source key; no name/email matching.

**Registry constraint summary:** UNIQUE(scope,namespace,external_student_id); scoped Student FK; UNIQUE(scope,namespace,student_id) to refuse accidental second source identity

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "imports", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_imports_source_student_map_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `namespace` | `namespace` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `externalStudentId` | `external_student_id` | `VarChar(100)` | `no` | `@map("external_student_id") @db.VarChar(100)` |
| `studentId` | `student_id` | `Uuid` | `no` | `@map("student_id") @db.Uuid` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
student Student @relation(fields:[organizationId,schoolId,studentId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_imports_source_student_map_student_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,namespace,externalStudentId],map:"vs_imports_source_student_map_source_key")
@@unique([organizationId,schoolId,namespace,studentId],map:"vs_imports_source_student_map_student_key")
@@map("vs_imports_source_student_map")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
