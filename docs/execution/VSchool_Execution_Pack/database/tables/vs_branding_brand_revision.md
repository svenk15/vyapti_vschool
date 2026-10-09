# vs_branding_brand_revision — BrandRevision

Observed source schema, not a new migration. Owner: branding.

**Responsibility:** Private draft or immutable published sign-in identity.

**Registry constraint summary:** UNIQUE(profile_id,revision); one DRAFT per profile; exact null-safe profile/asset owner trigger; published rows cannot update/delete; publisher/time both present only for PUBLISHED

**Tenant classification / intended RLS:** `{"classification": "TENANT_PRIVATE_WITH_SANITIZED_PUBLIC_READ", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Private access requires current verified tenant scope and capability; public access only through sanitized public DTO/view.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "branding", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_branding_brand_revision_pkey") @db.Uuid` |
| `profileId` | `profile_id` | `Uuid` | `no` | `@map("profile_id") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `yes` | `@map("school_id") @db.Uuid` |
| `revision` | `revision` | `integer` | `no` | `—` |
| `state` | `state` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `displayName` | `display_name` | `VarChar(160)` | `no` | `@map("display_name") @db.VarChar(160)` |
| `branchLabel` | `branch_label` | `VarChar(160)` | `yes` | `@map("branch_label") @db.VarChar(160)` |
| `logoAssetId` | `logo_asset_id` | `Uuid` | `yes` | `@map("logo_asset_id") @db.Uuid` |
| `palette` | `palette` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `welcome` | `welcome` | `VarChar(180)` | `no` | `@db.VarChar(180)` |
| `supportEmail` | `support_email` | `VarChar(254)` | `no` | `@map("support_email") @db.VarChar(254)` |
| `locale` | `locale` | `VarChar(35)` | `no` | `@db.VarChar(35)` |
| `publishedAt` | `published_at` | `Timestamptz(3)` | `yes` | `@map("published_at") @db.Timestamptz(3)` |
| `publishedBy` | `published_by` | `Uuid` | `yes` | `@map("published_by") @db.Uuid` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
profile BrandProfile @relation("BrandProfileRevisions",fields:[profileId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_revision_profile_fkey")
currentFor BrandProfile[] @relation("BrandProfileCurrent")
logoAsset BrandAsset? @relation(fields:[logoAssetId,organizationId,schoolId],references:[id,organizationId,schoolId],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_revision_asset_fkey")
publisher UserAccount? @relation(fields:[publishedBy],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_revision_publisher_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([profileId,revision],map:"vs_branding_brand_revision_profile_revision_key")
@@unique([id,organizationId,schoolId],map:"vs_branding_brand_revision_owner_key")
@@index([organizationId,schoolId,state,revision],map:"vs_branding_brand_revision_scope_state_idx")
@@map("vs_branding_brand_revision")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
