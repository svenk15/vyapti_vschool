# vs_access_account_person_binding — AccountPersonBinding

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Deliberate verified account-to-person link; People supplies scoped Person reference.

**Registry constraint summary:** FK organization/account/verifier; FK(organization_id,person_id)→Person; UNIQUE(organization_id,account_id); UNIQUE(organization_id,person_id)

**Tenant classification / intended RLS:** `{"classification": "INSTITUTION", "scopeColumns": ["organization_id"], "intendedPolicy": "Require verified organization scope and current institution authorization; application resource permission remains required.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_access_account_person_binding_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `accountId` | `account_id` | `Uuid` | `no` | `@map("account_id") @db.Uuid` |
| `personId` | `person_id` | `Uuid` | `no` | `@map("person_id") @db.Uuid` |
| `verifiedAt` | `verified_at` | `Timestamptz(3)` | `no` | `@map("verified_at") @db.Timestamptz(3)` |
| `verifiedBy` | `verified_by` | `Uuid` | `no` | `@map("verified_by") @db.Uuid` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_person_binding_organization_fkey")
account UserAccount @relation("PersonAccountBinding",fields:[accountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_person_binding_account_fkey")
person Person @relation(fields:[organizationId,personId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_person_binding_person_fkey")
verifier UserAccount @relation("PersonBindingVerifier",fields:[verifiedBy],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_access_account_person_binding_verifier_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,accountId],map:"vs_access_account_person_binding_org_account_key")
@@unique([organizationId,personId],map:"vs_access_account_person_binding_org_person_key")
@@map("vs_access_account_person_binding")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
