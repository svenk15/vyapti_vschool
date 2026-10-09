# vs_academics_teacher — Teacher

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** Academic teacher profile, not a login identity; PER-02 owns its eligibility mutations.

**Registry constraint summary:** UNIQUE(scope,employee_id); UNIQUE(scope,id); scoped Employee FK

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_teacher_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `employeeId` | `employee_id` | `Uuid` | `no` | `@map("employee_id") @db.Uuid` |
| `active` | `active` | `boolean` | `no` | `—` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
employee Employee @relation(fields:[organizationId,schoolId,employeeId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_teacher_employee_fkey")
assignments TeacherAssignment[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_academics_teacher_scope_id_key")
@@unique([organizationId,schoolId,employeeId],map:"vs_academics_teacher_employee_key")
@@index([organizationId,schoolId,active,employeeId],map:"vs_academics_teacher_eligibility_idx")
@@map("vs_academics_teacher")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
