# vs_platform_audit_entry — AuditEntry

Observed source schema, not a new migration. Owner: platform.

**Responsibility:** Redacted business changes only; immutable. before/after are small allowlisted diffs, never password/token/CSV bodies.

**Registry constraint summary:** FK school scope; actor account FK; index(scope,module,resource_id,occurred_at,id); DB trigger denies UPDATE/DELETE to app role

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "platform", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_platform_audit_entry_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `no` | `@map("actor_account_id") @db.Uuid` |
| `module` | `module` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `command` | `command` | `VarChar(80)` | `no` | `@db.VarChar(80)` |
| `resourceType` | `resource_type` | `VarChar(80)` | `no` | `@map("resource_type") @db.VarChar(80)` |
| `resourceId` | `resource_id` | `Uuid` | `no` | `@map("resource_id") @db.Uuid` |
| `before` | `before` | `jsonb` | `no` | `—` |
| `after` | `after` | `jsonb` | `no` | `—` |
| `reason` | `reason` | `VarChar(500)` | `yes` | `@db.VarChar(500)` |
| `requestId` | `request_id` | `Uuid` | `no` | `@map("request_id") @db.Uuid` |
| `occurredAt` | `occurred_at` | `Timestamptz(3)` | `no` | `@map("occurred_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school         School      @relation(fields: [organizationId, schoolId], references: [organizationId, id], onDelete: Restrict, onUpdate: Restrict, map: "vs_platform_audit_entry_r6_fkey")
actorAccount   UserAccount @relation(fields: [actorAccountId], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "vs_platform_audit_entry_r7_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId, schoolId], map: "vs_platform_audit_entry_r6_idx")
@@index([actorAccountId], map: "vs_platform_audit_entry_r7_idx")
@@index([organizationId, schoolId, module, resourceId, occurredAt, id], map: "vs_platform_audit_entry_q0_idx")
@@map("vs_platform_audit_entry")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
