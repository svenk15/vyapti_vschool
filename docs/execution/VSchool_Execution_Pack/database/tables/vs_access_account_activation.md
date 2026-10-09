# vs_access_account_activation — AccountActivation

Observed source schema, not a new migration. Owner: access.

**Responsibility:** One-time 256-bit random opaque activation, hash stored; 24h expiry. Raw token shown once to authorized local operator, never audit/log/URL query.

**Registry constraint summary:** UNIQUE(token_hash); FK account and created_by (subject account, with explicit operator provenance); UNIQUE(account_id,id); index(account_id,expires_at)

**Tenant classification / intended RLS:** `{"classification": "GLOBAL_SECURITY", "scopeColumns": [], "intendedPolicy": "Deny generic tenant DML; permit only narrow guarded Access token/security workflow and separately authorized redacted audit review.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_access_account_activation_pkey") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `no` | `@map("account_id") @db.Uuid` |
| `tokenHash` | `token_hash` | `Char(64)` | `no` | `@map("token_hash") @db.Char(64)` |
| `expiresAt` | `expires_at` | `Timestamptz(3)` | `no` | `@map("expires_at") @db.Timestamptz(3)` |
| `consumedAt` | `consumed_at` | `Timestamptz(3)` | `yes` | `@map("consumed_at") @db.Timestamptz(3)` |
| `revokedAt` | `revoked_at` | `Timestamptz(3)` | `yes` | `@map("revoked_at") @db.Timestamptz(3)` |
| `createdBy` | `created_by` | `Uuid` | `no` | `@map("created_by") @db.Uuid` |
| `operatorId` | `operator_id` | `Uuid` | `no` | `@map("operator_id") @db.Uuid` |
| `caseReference` | `case_reference` | `VarChar(80)` | `no` | `@map("case_reference") @db.VarChar(80)` |
| `reason` | `reason` | `VarChar(500)` | `no` | `@db.VarChar(500)` |
| `issuedTokenVersion` | `issued_token_version` | `integer` | `no` | `@map("issued_token_version")` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
account UserAccount @relation("ActivationAccount",fields:[accountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_activation_r0_fkey")
creator UserAccount @relation("ActivationCreator",fields:[createdBy],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_activation_r1_fkey")
intents AccountActivationMembership[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([tokenHash],map:"vs_access_account_activation_u0_key")
@@unique([accountId,id],map:"vs_access_account_activation_u1_key")
@@index([accountId,expiresAt],map:"vs_access_account_activation_r0_idx")
@@index([createdBy],map:"vs_access_account_activation_r1_idx")
@@map("vs_access_account_activation")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
