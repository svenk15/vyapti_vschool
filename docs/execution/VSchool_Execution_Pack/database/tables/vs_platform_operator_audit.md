# vs_platform_operator_audit — OperatorAuditEntry

Observed source schema, not a new migration. Owner: platform.

**Responsibility:** Append-only global platform-operator audit; aggregate technical outcomes only, no tenant/student/source identifiers.

**Registry constraint summary:** CHECK bounded command and details object; index(operator_id,occurred_at,id); UPDATE/DELETE rejected by trigger

**Tenant classification / intended RLS:** `{"classification": "GLOBAL_OPERATOR", "scopeColumns": [], "intendedPolicy": "Access only through verified platform operator tooling; never exposed to tenant runtime routes.", "enforcement": "APPLICATION_GUARD", "owner": "platform", "closureGate": "PLATFORM"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id @db.Uuid` |
| `operatorId` | `operator_id` | `Uuid` | `no` | `@map("operator_id") @db.Uuid` |
| `command` | `command` | `VarChar(80)` | `no` | `@db.VarChar(80)` |
| `resourceType` | `resource_type` | `VarChar(80)` | `no` | `@map("resource_type") @db.VarChar(80)` |
| `resourceId` | `resource_id` | `Uuid` | `no` | `@map("resource_id") @db.Uuid` |
| `occurredAt` | `occurred_at` | `Timestamptz(3)` | `no` | `@map("occurred_at") @db.Timestamptz(3)` |
| `details` | `details` | `jsonb` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
// None in Prisma model.
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([operatorId,occurredAt,id],map:"vs_platform_operator_audit_actor_idx")
@@map("vs_platform_operator_audit")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
