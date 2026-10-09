# vs_access_role_grant — RoleGrant

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Fixed permission mapping in code; no arbitrary permission JSON.

**Registry constraint summary:** FK(scope,membership_id)→membership; UNIQUE(scope,membership_id,code)

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_access_role_grant_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `membershipId` | `membership_id` | `Uuid` | `no` | `@map("membership_id") @db.Uuid` |
| `code` | `code` | `VarChar(40)` | `no` | `@db.VarChar(40)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
membership     SchoolMembership @relation(fields: [organizationId, schoolId, membershipId], references: [organizationId, schoolId, id], onDelete: Restrict, onUpdate: Restrict, map: "vs_access_role_grant_r3_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId, schoolId, membershipId, code], map: "vs_access_role_grant_u0_key")
@@index([organizationId, schoolId, membershipId], map: "vs_access_role_grant_r3_idx")
@@map("vs_access_role_grant")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
