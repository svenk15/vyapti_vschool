# vs_tenancy_tenant_command_receipt — TenantCommandReceipt

Observed source schema, not a new migration. Owner: tenancy.

**Responsibility:** Idempotent institution command outcomes, scoped to the verified account and tenant.

**Registry constraint summary:** FKs organization/actor; UNIQUE(organization_id,actor_account_id,command,key); INDEX(actor_account_id); input_hash SHA-256; immutable

**Tenant classification / intended RLS:** `{"classification": "INSTITUTION", "scopeColumns": ["organization_id"], "intendedPolicy": "Require verified organization scope and current institution authorization; application resource permission remains required.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "tenancy", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_tenancy_tenant_command_receipt_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `no` | `@map("actor_account_id") @db.Uuid` |
| `command` | `command` | `VarChar(80)` | `no` | `@db.VarChar(80)` |
| `key` | `key` | `VarChar(100)` | `no` | `@db.VarChar(100)` |
| `inputHash` | `input_hash` | `Char(64)` | `no` | `@map("input_hash") @db.Char(64)` |
| `response` | `response` | `jsonb` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_tenant_command_receipt_org_fkey")
actor UserAccount @relation(fields:[actorAccountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_tenant_command_receipt_actor_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,actorAccountId,command,key],map:"vs_tenancy_tenant_command_receipt_intent_key")
@@index([actorAccountId],map:"vs_tenancy_tenant_command_receipt_actor_idx")
@@map("vs_tenancy_tenant_command_receipt")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
