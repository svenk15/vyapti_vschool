# vs_branding_verified_brand_host — VerifiedBrandHost

Observed source schema, not a new migration. Owner: branding.

**Responsibility:** Exact DNS TXT ownership proof for one published profile host mapping.

**Registry constraint summary:** globally unique canonical lowercase hostname; exact null-safe profile scope; no wildcard/IP; verified_at iff VERIFIED; deployment TLS/trusted-host requirement

**Tenant classification / intended RLS:** `{"classification": "TENANT_PRIVATE_WITH_SANITIZED_PUBLIC_READ", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Private access requires current verified tenant scope and capability; public access only through sanitized public DTO/view.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "branding", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_branding_verified_brand_host_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `yes` | `@map("school_id") @db.Uuid` |
| `hostname` | `hostname` | `VarChar(253)` | `no` | `@db.VarChar(253)` |
| `verificationTokenHash` | `verification_token_hash` | `Char(64)` | `no` | `@map("verification_token_hash") @db.Char(64)` |
| `state` | `state` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `verifiedAt` | `verified_at` | `Timestamptz(3)` | `yes` | `@map("verified_at") @db.Timestamptz(3)` |
| `profileId` | `profile_id` | `Uuid` | `no` | `@map("profile_id") @db.Uuid` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_verified_brand_host_org_fkey")
school School? @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_verified_brand_host_school_fkey")
profile BrandProfile @relation(fields:[profileId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_verified_brand_host_profile_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@index([hostname,state],map:"vs_branding_verified_brand_host_lookup_idx")
@@map("vs_branding_verified_brand_host")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
