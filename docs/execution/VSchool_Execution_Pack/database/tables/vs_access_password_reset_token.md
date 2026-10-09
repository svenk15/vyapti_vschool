# vs_access_password_reset_token — PasswordResetToken

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Account-global password recovery token; issue and consume snapshots include every active school membership and institution grant trust mode/version.

**Registry constraint summary:** FK account and optional issuer; UNIQUE(token_hash); CHECK delivery status and expiry/failure relation; indexes(account_id,created_at),(issuing_organization_id,created_at)

**Tenant classification / intended RLS:** `{"classification": "GLOBAL_SECURITY", "scopeColumns": [], "intendedPolicy": "Deny generic tenant DML; permit only narrow guarded Access token/security workflow and separately authorized redacted audit review.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_access_password_reset_token_pkey") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `no` | `@map("account_id") @db.Uuid` |
| `issuingOrganizationId` | `issuing_organization_id` | `Uuid` | `yes` | `@map("issuing_organization_id") @db.Uuid` |
| `tokenHash` | `token_hash` | `Char(64)` | `no` | `@unique(map:"vs_access_password_reset_token_hash_key") @map("token_hash") @db.Char(64)` |
| `deliveryStatus` | `delivery_status` | `VarChar(24)` | `no` | `@map("delivery_status") @db.VarChar(24)` |
| `policySnapshot` | `policy_snapshot` | `jsonb` | `no` | `@map("policy_snapshot")` |
| `organizationConfigurationVersions` | `organization_configuration_versions` | `jsonb` | `no` | `@map("organization_configuration_versions")` |
| `deliveryFailedAt` | `delivery_failed_at` | `Timestamptz(3)` | `yes` | `@map("delivery_failed_at") @db.Timestamptz(3)` |
| `deliveryFailureReason` | `delivery_failure_reason` | `VarChar(120)` | `yes` | `@map("delivery_failure_reason") @db.VarChar(120)` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |
| `expiresAt` | `expires_at` | `Timestamptz(3)` | `no` | `@map("expires_at") @db.Timestamptz(3)` |
| `consumedAt` | `consumed_at` | `Timestamptz(3)` | `yes` | `@map("consumed_at") @db.Timestamptz(3)` |
| `revokedAt` | `revoked_at` | `Timestamptz(3)` | `yes` | `@map("revoked_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
account UserAccount @relation("ResetAccount",fields:[accountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_password_reset_token_account_fkey")
organization Organization? @relation(fields:[issuingOrganizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_password_reset_token_organization_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([accountId,createdAt],map:"vs_access_password_reset_token_account_created_idx")
@@index([issuingOrganizationId,createdAt],map:"vs_access_password_reset_token_issuer_created_idx")
@@map("vs_access_password_reset_token")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
