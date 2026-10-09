# vs_attendance_revision — AttendanceRevision

Observed source schema, not a new migration. Owner: attendance.

**Responsibility:** Immutable status diff with old/new values and affected student IDs; SUBMIT includes the complete initial status set and counts. No names, roll values or raw private notes in changes.

**Registry constraint summary:** Scoped session FK; global UserAccount actor FK; UNIQUE(scope,session_id,number); number>=1; CHECK recognized kind; SUBMIT requires null reason and CORRECT/CANCEL require reason length 5..500; append-only trigger; unique key supports ordered history

**Tenant classification / intended RLS:** `{"classification": "BRANCH", "scopeColumns": ["organization_id", "school_id"], "intendedPolicy": "Require organization_id and school_id tenant context plus active membership; application checks current attendance permission and dated assignment; WITH CHECK binds both keys. Owner/operator exceptions remain TEN-03-controlled.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "attendance", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map:"vs_attendance_revision_pkey") @db.Uuid` |
| `organizationId` | `organization_id` | `Uuid` | `no` | `@map("organization_id") @db.Uuid` |
| `schoolId` | `school_id` | `Uuid` | `no` | `@map("school_id") @db.Uuid` |
| `sessionId` | `session_id` | `Uuid` | `no` | `@map("session_id") @db.Uuid` |
| `number` | `number` | `integer` | `no` | `—` |
| `kind` | `kind` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `actorAccountId` | `actor_account_id` | `Uuid` | `no` | `@map("actor_account_id") @db.Uuid` |
| `occurredAt` | `occurred_at` | `Timestamptz(3)` | `no` | `@map("occurred_at") @db.Timestamptz(3)` |
| `reason` | `reason` | `VarChar(500)` | `yes` | `@db.VarChar(500)` |
| `changes` | `changes` | `jsonb` | `no` | `—` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
session AttendanceSession @relation(fields:[organizationId,schoolId,sessionId],references:[organizationId,schoolId,id],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_revision_session_fkey")
actor UserAccount @relation("AttendanceRevisionActor",fields:[actorAccountId],references:[id],onDelete:Restrict,onUpdate:Restrict,map:"vs_attendance_revision_actor_fkey")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([organizationId,schoolId,sessionId,number],map:"vs_attendance_revision_number_key")
@@map("vs_attendance_revision")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
