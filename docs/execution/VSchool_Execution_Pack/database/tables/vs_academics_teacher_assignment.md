# vs_academics_teacher_assignment — TeacherAssignment

Observed source schema, not a new migration. Owner: academics.

**Responsibility:** Primary attendance duty only in Phase 1; one eligible teacher per offering/date.

**Registry constraint summary:** Scoped offering/teacher FKs; CHECK valid_from<valid_to and version>0; overlap guarded by School lock/application predicate; indexes(scope,offering_id,valid_from,valid_to) and (scope,teacher_id,valid_from,valid_to)

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "academics", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_academics_teacher_assignment_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `offeringId` | `offering_id` | `Uuid` | `no` | `@map("offering_id") @db.Uuid` |
| `teacherId` | `teacher_id` | `Uuid` | `no` | `@map("teacher_id") @db.Uuid` |
| `validFrom` | `valid_from` | `Date` | `no` | `@map("valid_from") @db.Date` |
| `validTo` | `valid_to` | `Date` | `no` | `@map("valid_to") @db.Date` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
offering CourseOffering @relation(fields:[organizationId,schoolId,offeringId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_teacher_assignment_offering_fkey")
teacher Teacher @relation(fields:[organizationId,schoolId,teacherId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_academics_teacher_assignment_teacher_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,id],map:"vs_academics_teacher_assignment_scope_id_key")
@@index([organizationId,schoolId,offeringId,validFrom,validTo],map:"vs_academics_teacher_assignment_offering_date_idx")
@@index([organizationId,schoolId,teacherId,validFrom,validTo],map:"vs_academics_teacher_assignment_teacher_date_idx")
@@map("vs_academics_teacher_assignment")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
