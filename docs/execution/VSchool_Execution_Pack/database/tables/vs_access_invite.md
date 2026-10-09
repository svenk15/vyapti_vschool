# vs_access_invite — AccessInvite

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Email invitation bound to the target global account and scoped pending membership; acceptance never creates Person or Employee bindings.

**Registry constraint summary:** FK account, organization, scoped school and inviter; UNIQUE(token_hash); CHECK delivery status, roles and expiry/failure relation; indexes(scope,delivery_status,created_at),(account_id,expires_at)

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_access_invite_pkey") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `no` | `@map("account_id") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `inviterAccountId` | `inviter_account_id` | `Uuid` | `no` | `@map("inviter_account_id") @db.Uuid` |
| `tokenHash` | `token_hash` | `Char(64)` | `no` | `@unique(map:"vs_access_invite_token_hash_key") @map("token_hash") @db.Char(64)` |
| `proposedRoles` | `proposed_roles` | `text[]` | `no` | `@map("proposed_roles")` |
| `membershipVersion` | `membership_version` | `integer` | `no` | `@map("membership_version")` |
| `organizationConfigurationVersion` | `organization_configuration_version` | `integer` | `no` | `@map("organization_configuration_version")` |
| `schoolConfigurationVersion` | `school_configuration_version` | `integer` | `no` | `@map("school_configuration_version")` |
| `deliveryStatus` | `delivery_status` | `VarChar(24)` | `no` | `@map("delivery_status") @db.VarChar(24)` |
| `deliveryFailedAt` | `delivery_failed_at` | `Timestamptz(3)` | `yes` | `@map("delivery_failed_at") @db.Timestamptz(3)` |
| `deliveryFailureReason` | `delivery_failure_reason` | `VarChar(120)` | `yes` | `@map("delivery_failure_reason") @db.VarChar(120)` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |
| `expiresAt` | `expires_at` | `Timestamptz(3)` | `no` | `@map("expires_at") @db.Timestamptz(3)` |
| `acceptedAt` | `accepted_at` | `Timestamptz(3)` | `yes` | `@map("accepted_at") @db.Timestamptz(3)` |
| `revokedAt` | `revoked_at` | `Timestamptz(3)` | `yes` | `@map("revoked_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
account UserAccount @relation("InviteAccount",fields:[accountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_invite_account_fkey")
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_invite_organization_fkey")
school School @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_invite_school_fkey")
inviter UserAccount @relation("InviteIssuer",fields:[inviterAccountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_invite_inviter_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([organizationId,schoolId,deliveryStatus,createdAt],map:"vs_access_invite_scope_delivery_idx")
@@index([accountId,expiresAt],map:"vs_access_invite_account_expiry_idx")
@@map("vs_access_invite")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
