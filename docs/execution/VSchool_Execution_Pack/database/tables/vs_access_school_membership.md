# vs_access_school_membership — SchoolMembership

Observed source schema, not a new migration. Owner: access.

**Responsibility:** School access root; granting role does not prove teacher eligibility.

**Registry constraint summary:** FK school; FK account; UNIQUE(scope,id); UNIQUE(scope,account_id)

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require both verified tenant keys and current active membership; WITH CHECK binds both keys on inserts/updates.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_access_school_membership_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `no` | `@map("account_id") @db.Uuid` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `version` | `version` | `integer` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
school         School      @relation(fields: [organizationId, schoolId], references: [organizationId, id], onDelete: Restrict, onUpdate: Restrict, map: "vs_access_school_membership_r1_fkey")
account        UserAccount @relation(fields: [accountId], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "vs_access_school_membership_r2_fkey")
grants         RoleGrant[]
activationIntents AccountActivationMembership[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId, schoolId, id], map: "vs_access_school_membership_u0_key")
@@unique([organizationId, schoolId, accountId], map: "vs_access_school_membership_u1_key")
@@unique([organizationId, schoolId, id, accountId], map: "vs_access_school_membership_u2_key")
@@index([organizationId, schoolId], map: "vs_access_school_membership_r1_idx")
@@index([accountId], map: "vs_access_school_membership_r2_idx")
@@map("vs_access_school_membership")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
