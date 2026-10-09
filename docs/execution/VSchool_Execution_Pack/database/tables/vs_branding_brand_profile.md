# vs_branding_brand_profile — BrandProfile

Observed source schema, not a new migration. Owner: branding.

**Responsibility:** Owns one editable draft and append-only published identity revisions.

**Registry constraint summary:** one institution default and one per branch via separate partial unique indexes; scoped School FK; globally UNIQUE(public_slug); lowercase slug check; pointer trigger requires same profile/scope published revision

**Tenant classification / intended RLS:** `{"classification": "TENANT_PRIVATE_WITH_SANITIZED_PUBLIC_READ", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Private access requires current verified tenant scope and capability; public access only through sanitized public DTO/view.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "branding", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_branding_brand_profile_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `yes` | `@map("school_id") @db.Uuid` |
| `version` | `version` | `integer` | `no` | `—` |
| `currentRevisionId` | `current_revision_id` | `Uuid` | `yes` | `@map("current_revision_id") @db.Uuid` |
| `publicSlug` | `public_slug` | `VarChar(80)` | `no` | `@unique(map:"vs_branding_brand_profile_slug_key") @map("public_slug") @db.VarChar(80)` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@default(now()) @map("created_at") @db.Timestamptz(3)` |
| `updatedAt` | `updated_at` | `Timestamptz(3)` | `no` | `@updatedAt @map("updated_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_profile_org_fkey")
school School? @relation(fields:[organizationId,schoolId],references:[organizationId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_profile_school_fkey")
revisions BrandRevision[] @relation("BrandProfileRevisions")
currentRevision BrandRevision? @relation("BrandProfileCurrent",fields:[currentRevisionId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_branding_brand_profile_current_revision_fkey")
hosts VerifiedBrandHost[]
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,id],map:"vs_branding_brand_profile_scope_id_key")
@@unique([id,organizationId,schoolId],map:"vs_branding_brand_profile_owner_key")
@@map("vs_branding_brand_profile")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
