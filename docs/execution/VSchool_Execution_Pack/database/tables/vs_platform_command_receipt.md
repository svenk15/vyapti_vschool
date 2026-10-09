# vs_platform_command_receipt — CommandReceipt

Observed source schema, not a new migration. Owner: platform.

**Responsibility:** Only committed safe success response; all fields immutable. Unsuccessful transaction writes no receipt.

**Registry constraint summary:** UNIQUE(scope,actor_account_id,command,key); FK school and account; hash/key format checks; immutable trigger

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "platform", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_platform_command_receipt_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `no` | `@map("actor_account_id") @db.Uuid` |
| `command` | `command` | `VarChar(80)` | `no` | `@db.VarChar(80)` |
| `key` | `key` | `VarChar(100)` | `no` | `@db.VarChar(100)` |
| `inputHash` | `input_hash` | `Char(64)` | `no` | `@map("input_hash") @db.Char(64)` |
| `response` | `response` | `jsonb` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school         School      @relation(fields: [organizationId, schoolId], references: [organizationId, id], onDelete: Restrict, onUpdate: Restrict, map: "vs_platform_command_receipt_r9_fkey")
actorAccount   UserAccount @relation(fields: [actorAccountId], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "vs_platform_command_receipt_r10_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId, schoolId, actorAccountId, command, key], map: "vs_platform_command_receipt_u0_key")
@@index([organizationId, schoolId], map: "vs_platform_command_receipt_r9_idx")
@@index([actorAccountId], map: "vs_platform_command_receipt_r10_idx")
@@map("vs_platform_command_receipt")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
