# vs_platform_outbox_event — OutboxEvent

Observed source schema, not a new migration. Owner: platform.

**Responsibility:** Internal domain fact. Phase 1 only persists; no external delivery is claimed. Future dispatcher uses an explicit lease and receipt migration.

**Registry constraint summary:** FK school scope; CHECK schema_version>0, aggregate_version>0, attempts>=0, state in PENDING/DELIVERED/EXHAUSTED; index(state,available_at,id)

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "platform", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_platform_outbox_event_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `module` | `module` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `type` | `type` | `VarChar(100)` | `no` | `@db.VarChar(100)` |
| `schemaVersion` | `schema_version` | `integer` | `no` | `@map("schema_version")` |
| `aggregateId` | `aggregate_id` | `Uuid` | `no` | `@map("aggregate_id") @db.Uuid` |
| `aggregateVersion` | `aggregate_version` | `integer` | `no` | `@map("aggregate_version")` |
| `occurredAt` | `occurred_at` | `Timestamptz(3)` | `no` | `@map("occurred_at") @db.Timestamptz(3)` |
| `payload` | `payload` | `jsonb` | `no` | `—` |
| `state` | `state` | `VarChar(20)` | `no` | `@default("PENDING") @db.VarChar(20)` |
| `attempts` | `attempts` | `integer` | `no` | `@default(0)` |
| `availableAt` | `available_at` | `Timestamptz(3)` | `no` | `@map("available_at") @db.Timestamptz(3)` |
| `deliveredAt` | `delivered_at` | `Timestamptz(3)` | `yes` | `@map("delivered_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school           School    @relation(fields: [organizationId, schoolId], references: [organizationId, id], onDelete: Restrict, onUpdate: Restrict, map: "vs_platform_outbox_event_r8_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId, schoolId], map: "vs_platform_outbox_event_r8_idx")
@@index([state, availableAt, id], map: "vs_platform_outbox_event_q0_idx")
@@map("vs_platform_outbox_event")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
