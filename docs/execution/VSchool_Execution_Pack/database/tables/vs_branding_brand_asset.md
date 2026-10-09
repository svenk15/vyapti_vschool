# vs_branding_brand_asset — BrandAsset

Observed source schema, not a new migration. Owner: branding.

**Responsibility:** Sanitized canonical PNG derivative, submitted source discarded.

**Registry constraint summary:** Scoped organization/nullable School FKs; exact-owner checks; bytea length=bytes<=2 MiB; dims 1..2048; SHA-256; approved content immutable

**Tenant classification / intended RLS:** `{"classification": "TENANT_PRIVATE_WITH_SANITIZED_PUBLIC_READ", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Private access requires current verified tenant scope and capability; public access only through sanitized public DTO/view.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "branding", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_branding_brand_asset_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `yes` | `@map("school_id") @db.Uuid` |
| `sha256` | `sha256` | `Char(64)` | `no` | `@db.Char(64)` |
| `mime` | `mime` | `VarChar(100)` | `no` | `@db.VarChar(100)` |
| `contentBytes` | `content_bytes` | `ByteA` | `no` | `@map("content_bytes") @db.ByteA` |
| `bytes` | `bytes` | `integer` | `no` | `—` |
| `width` | `width` | `integer` | `no` | `—` |
| `height` | `height` | `integer` | `no` | `—` |
| `state` | `state` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@default(now()) @map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_asset_org_fkey")
school School? @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_asset_school_fkey")
revisions BrandRevision[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([id,organizationId,schoolId],map:"vs_branding_brand_asset_owner_key")
@@index([organizationId,schoolId,sha256],map:"vs_branding_brand_asset_digest_idx")
@@map("vs_branding_brand_asset")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
