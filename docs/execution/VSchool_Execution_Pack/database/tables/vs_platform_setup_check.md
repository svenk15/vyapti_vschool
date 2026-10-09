# vs_platform_setup_check — SetupCheck

Observed source schema, not a new migration. Owner: platform.

**Responsibility:** id=starter is the idempotently seeded readiness marker. No school data.

**Registry constraint summary:** PK(id)

**Tenant classification / intended RLS:** `{"classification": "DEPLOYMENT_ONLY", "scopeColumns": [], "intendedPolicy": "No tenant-row policy. Grant only designated deployment health access.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "platform", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `text` | `no` | `@id(map: "vs_platform_setup_check_pkey")` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@default(now()) @map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
// None in Prisma model.
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@map("vs_platform_setup_check")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
