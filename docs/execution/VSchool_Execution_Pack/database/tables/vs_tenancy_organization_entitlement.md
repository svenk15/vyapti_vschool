# vs_tenancy_organization_entitlement — OrganizationEntitlement

Observed source schema, not a new migration. Owner: tenancy.

**Responsibility:** Module contract, activation or configuration evidence.

**Registry constraint summary:** UNIQUE(organization_id,module_id); FK organization; module_id in static catalog; state/date/version checks; limits restricted to empty object until typed quotas ship; contracted operator write only

**Tenant classification / intended RLS:** `{"classification": "INSTITUTION", "scopeColumns": ["organization_id"], "intendedPolicy": "Require verified organization scope and current institution authorization; application resource permission remains required.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "tenancy", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_tenancy_organization_entitlement_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `moduleId` | `module_id` | `VarChar(40)` | `no` | `@map("module_id") @db.VarChar(40)` |
| `state` | `state` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `startsAt` | `starts_at` | `Timestamptz(3)` | `no` | `@map("starts_at") @db.Timestamptz(3)` |
| `endsAt` | `ends_at` | `Timestamptz(3)` | `yes` | `@map("ends_at") @db.Timestamptz(3)` |
| `limits` | `limits` | `jsonb` | `no` | `@default("{}")` |
| `manifestVersion` | `manifest_version` | `integer` | `no` | `@map("manifest_version")` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_tenancy_organization_entitlement_org_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,moduleId],map:"vs_tenancy_organization_entitlement_scope_module_key")
@@index([organizationId,state,moduleId],map:"vs_tenancy_organization_entitlement_status_idx")
@@map("vs_tenancy_organization_entitlement")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
