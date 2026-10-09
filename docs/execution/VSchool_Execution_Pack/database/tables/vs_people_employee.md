# vs_people_employee — Employee

Observed source schema, not a new migration. Owner: people.

**Responsibility:** School institutional profile; links rather than duplicates identity.

**Registry constraint summary:** Scoped School FK; FK(organization_id,person_id); UNIQUE(scope,staff_number); UNIQUE(scope,person_id); UNIQUE(scope,id); CHECK end null or from<end

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "people", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_people_employee_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `personId` | `person_id` | `Uuid` | `no` | `@map("person_id") @db.Uuid` |
| `staffNumber` | `staff_number` | `VarChar(40)` | `no` | `@map("staff_number") @db.VarChar(40)` |
| `employedFrom` | `employed_from` | `Date` | `no` | `@map("employed_from") @db.Date` |
| `employedTo` | `employed_to` | `Date` | `yes` | `@map("employed_to") @db.Date` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_people_employee_school_fkey")
person Person @relation(fields:[organizationId,personId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_people_employee_person_fkey")
teacher Teacher?
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_people_employee_scope_id_key")
@@unique([organizationId,schoolId,staffNumber],map:"vs_people_employee_staff_number_key")
@@unique([organizationId,schoolId,personId],map:"vs_people_employee_person_key")
@@map("vs_people_employee")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
