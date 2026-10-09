# vs_access_institution_grant — InstitutionGrant

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Institution configuration grant; no implicit pupil access.

**Registry constraint summary:** FKs organization/account; UNIQUE(organization_id,account_id,role); INDEX(account_id,status,organization_id); role/status/version checks

**Tenant classification / intended RLS:** `{"classification": "INSTITUTION", "scopeColumns": ["organization_id"], "intendedPolicy": "Require verified organization scope and current institution authorization; application resource permission remains required.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_access_institution_grant_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `no` | `@map("account_id") @db.Uuid` |
| `role` | `role` | `VarChar(40)` | `no` | `@db.VarChar(40)` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |
| `grantedAt` | `granted_at` | `Timestamptz(3)` | `no` | `@map("granted_at") @db.Timestamptz(3)` |
| `grantedBy` | `granted_by` | `Uuid` | `no` | `@map("granted_by") @db.Uuid` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_institution_grant_organization_fkey")
account UserAccount @relation(fields:[accountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_institution_grant_account_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,accountId,role],map:"vs_access_institution_grant_scope_role_key")
@@index([accountId,status,organizationId],map:"vs_access_institution_grant_account_idx")
@@map("vs_access_institution_grant")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
