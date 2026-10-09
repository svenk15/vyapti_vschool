# vs_people_person — Person

Observed source schema, not a new migration. Owner: people.

**Responsibility:** Canonical name/contact; email contact is not verified login ownership. Minimal pilot PII, no health/document fields.

**Registry constraint summary:** FK organization; UNIQUE(organization_id,id); index(organization_id,last_name,id); no email/name uniqueness

**Tenant classification / intended RLS:** `{"classification": "INSTITUTION", "scopeColumns": ["organization_id"], "intendedPolicy": "Require verified organization scope and current institution authorization; application resource permission remains required.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "people", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_people_person_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `firstName` | `first_name` | `VarChar(100)` | `no` | `@map("first_name") @db.VarChar(100)` |
| `lastName` | `last_name` | `VarChar(100)` | `no` | `@default("") @map("last_name") @db.VarChar(100)` |
| `contactEmail` | `contact_email` | `VarChar(254)` | `yes` | `@map("contact_email") @db.VarChar(254)` |
| `version` | `version` | `integer` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
organization Organization @relation(fields:[organizationId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_people_person_organization_fkey")
employees Employee[]
students Student[]
accountBinding AccountPersonBinding?
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,id],map:"vs_people_person_organization_id_key")
@@index([organizationId,lastName,id],map:"vs_people_person_name_idx")
@@map("vs_people_person")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
