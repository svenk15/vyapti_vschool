# vs_access_auth_security_event — AuthSecurityEvent

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Redacted auth/recovery evidence including internal cross-institution policy decisions. request_id is the correlation ID; no password, raw token or raw unknown identifier.

**Registry constraint summary:** FK accounts when present; index(account_id,occurred_at,id); immutable except one guarded NULL→account_id association for an initially unknown reset attempt resolved in the same locked transaction; cross-institution details only via operator/security authorization

**Tenant classification / intended RLS:** `{"classification": "GLOBAL_SECURITY", "scopeColumns": [], "intendedPolicy": "Deny generic tenant DML; permit only narrow guarded Access token/security workflow and separately authorized redacted audit review.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_access_auth_security_event_pkey") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `yes` | `@map("account_id") @db.Uuid` |
| `kind` | `kind` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `occurredAt` | `occurred_at` | `Timestamptz(3)` | `no` | `@map("occurred_at") @db.Timestamptz(3)` |
| `requestId` | `request_id` | `Uuid` | `no` | `@map("request_id") @db.Uuid` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `yes` | `@map("actor_account_id") @db.Uuid` |
| `decision` | `decision` | `VarChar(12)` | `yes` | `@db.VarChar(12)` |
| `safeReason` | `safe_reason` | `VarChar(80)` | `yes` | `@map("safe_reason") @db.VarChar(80)` |
| `policySnapshot` | `policy_snapshot` | `jsonb` | `yes` | `@map("policy_snapshot")` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
account        UserAccount? @relation("SecuritySubject", fields: [accountId], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "vs_access_auth_security_event_r4_fkey")
actorAccount   UserAccount? @relation("SecurityActor", fields: [actorAccountId], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "vs_access_auth_security_event_r5_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([accountId], map: "vs_access_auth_security_event_r4_idx")
@@index([actorAccountId], map: "vs_access_auth_security_event_r5_idx")
@@index([accountId, occurredAt, id], map: "vs_access_auth_security_event_q0_idx")
@@map("vs_access_auth_security_event")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
