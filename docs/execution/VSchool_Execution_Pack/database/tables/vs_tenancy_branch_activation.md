# vs_tenancy_branch_activation — BranchActivation

Observed source schema, not a new migration. Owner: tenancy.

**Responsibility:** Module contract, activation or configuration evidence.

**Registry constraint summary:** UNIQUE(organization_id,school_id,module_id); composite scoped School FK plus Organization FK; index(scope,state,module_id); state/version/enabled_at consistency; active requires entitlement via locked transaction

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "tenancy", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_tenancy_branch_activation_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `moduleId` | `module_id` | `VarChar(40)` | `no` | `@map("module_id") @db.VarChar(40)` |
| `state` | `state` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |
| `enabledAt` | `enabled_at` | `Timestamptz(3)` | `yes` | `@map("enabled_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_branch_activation_org_fkey")
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_branch_activation_school_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,moduleId],map:"vs_tenancy_branch_activation_scope_module_key")
@@index([organizationId,schoolId,state,moduleId],map:"vs_tenancy_branch_activation_status_idx")
@@map("vs_tenancy_branch_activation")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
