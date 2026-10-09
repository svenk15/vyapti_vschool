# vs_tenancy_configuration_change — ConfigurationChange

Observed source schema, not a new migration. Owner: tenancy.

**Responsibility:** Append-only institution or branch configuration history with an atomically enlisted revision.

**Registry constraint summary:** FKs organization, scoped nullable School and actor account; indexes for institution/branch history and actor; new_revision=expected_revision+1; reason 5–500; append-only

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "tenancy", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_tenancy_configuration_change_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `yes` | `@map("school_id") @db.Uuid` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `no` | `@map("actor_account_id") @db.Uuid` |
| `expectedRevision` | `expected_revision` | `integer` | `no` | `@map("expected_revision")` |
| `newRevision` | `new_revision` | `integer` | `no` | `@map("new_revision")` |
| `changes` | `changes` | `jsonb` | `no` | `—` |
| `reason` | `reason` | `VarChar(500)` | `no` | `@db.VarChar(500)` |
| `occurredAt` | `occurred_at` | `Timestamptz(3)` | `no` | `@map("occurred_at") @db.Timestamptz(3)` |
| `requestId` | `request_id` | `Uuid` | `no` | `@map("request_id") @db.Uuid` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_configuration_change_org_fkey")
school School? @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_configuration_change_school_fkey")
actor UserAccount @relation(fields:[actorAccountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_configuration_change_actor_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId,occurredAt,id],map:"vs_tenancy_configuration_change_history_idx")
@@index([organizationId,schoolId,occurredAt,id],map:"vs_tenancy_configuration_change_branch_idx")
@@index([actorAccountId],map:"vs_tenancy_configuration_change_actor_idx")
@@map("vs_tenancy_configuration_change")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
