# vs_access_account_activation_membership — AccountActivationMembership

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Owned immutable relational membership intent snapshot for one activation.

**Registry constraint summary:** UNIQUE(activation_id,membership_id); scoped account/membership FK and activation/account FK; CHECK expected_version>0

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_access_account_activation_membership_pkey") @db.Uuid` |
| `activationId` | `activation_id` | `Uuid` | `no` | `@map("activation_id") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `no` | `@map("account_id") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `membershipId` | `membership_id` | `Uuid` | `no` | `@map("membership_id") @db.Uuid` |
| `expectedVersion` | `expected_version` | `integer` | `no` | `@map("expected_version")` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
activation AccountActivation @relation(fields:[accountId,activationId],references:[accountId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_activation_membership_r0_fkey")
membership SchoolMembership @relation(fields:[organizationId,schoolId,membershipId,accountId],references:[organizationId,schoolId,id,accountId],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_activation_membership_r1_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([activationId,membershipId],map:"vs_access_account_activation_membership_u0_key")
@@index([accountId,activationId],map:"vs_access_account_activation_membership_r0_idx")
@@index([organizationId,schoolId,membershipId,accountId],map:"vs_access_account_activation_membership_r1_idx")
@@map("vs_access_account_activation_membership")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
