# vs_tenancy_tenant_outbox — TenantOutbox

Observed source schema, not a new migration. Owner: tenancy.

**Responsibility:** Institution-scoped integration events with immutable payload and mutable delivery state.

**Registry constraint summary:** FK organization; index(organization_id,state,available_at,id); attempts>=0; schema_version>0; immutable envelope except delivery state

**Tenant classification / intended RLS:** `{"classification": "INSTITUTION", "scopeColumns": ["organization_id"], "intendedPolicy": "Require verified organization scope and current institution authorization; application resource permission remains required.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "tenancy", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_tenancy_tenant_outbox_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `type` | `type` | `VarChar(100)` | `no` | `@db.VarChar(100)` |
| `schemaVersion` | `schema_version` | `integer` | `no` | `@map("schema_version")` |
| `payload` | `payload` | `jsonb` | `no` | `—` |
| `occurredAt` | `occurred_at` | `Timestamptz(3)` | `no` | `@map("occurred_at") @db.Timestamptz(3)` |
| `state` | `state` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `attempts` | `attempts` | `integer` | `no` | `@default(0)` |
| `availableAt` | `available_at` | `Timestamptz(3)` | `no` | `@map("available_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_tenant_outbox_org_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId,state,availableAt,id],map:"vs_tenancy_tenant_outbox_delivery_idx")
@@map("vs_tenancy_tenant_outbox")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
