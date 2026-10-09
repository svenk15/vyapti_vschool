# vs_access_user_account — UserAccount

Observed source schema, not a new migration. Owner: access.

**Responsibility:** Globally unique login; reset requires a previously verified address; no school access without membership. Never return hash/counters.

**Registry constraint summary:** UNIQUE(normalized_email); counters>=0; index(status,id)

**Tenant classification / intended RLS:** `{"classification": "GLOBAL_IDENTITY", "scopeColumns": ["account_id"], "intendedPolicy": "Runtime access self-scoped to app.account_id; exact account-wide lookup only through guarded Access authentication/recovery workflow.", "enforcement": "PATH_A_DEFERRED_TEN_03", "owner": "access", "closureGate": "TEN-03"}`

## Stored columns
| Prisma field | Physical column | PostgreSQL/native type | Nullable | Exact Prisma attributes (including defaults) |
|---|---|---|---|---|
| `id` | `id` | `Uuid` | `no` | `@id(map: "vs_access_user_account_pkey") @db.Uuid` |
| `normalizedEmail` | `normalized_email` | `VarChar(254)` | `no` | `@map("normalized_email") @db.VarChar(254)` |
| `emailVerifiedAt` | `email_verified_at` | `Timestamptz(3)` | `yes` | `@map("email_verified_at") @db.Timestamptz(3)` |
| `passwordHash` | `password_hash` | `text` | `yes` | `@map("password_hash")` |
| `status` | `status` | `VarChar(20)` | `no` | `@db.VarChar(20)` |
| `tokenVersion` | `token_version` | `integer` | `no` | `@map("token_version")` |
| `failedAttempts` | `failed_attempts` | `integer` | `no` | `@map("failed_attempts")` |
| `lockedUntil` | `locked_until` | `Timestamptz(3)` | `yes` | `@map("locked_until") @db.Timestamptz(3)` |
| `version` | `version` | `integer` | `no` | `—` |
| `createdAt` | `created_at` | `Timestamptz(3)` | `no` | `@map("created_at") @db.Timestamptz(3)` |

Unannotated native types above use Prisma PostgreSQL scalar defaults; migration SQL is authoritative for deployed DDL and any historical difference. Relationship-only fields are not stored columns.

## Relationships (exact scoped FK declarations)
```prisma
institutionGrants InstitutionGrant[]
configurationChanges ConfigurationChange[]
tenantReceipts TenantCommandReceipt[]
memberships         SchoolMembership[]
securityEvents      AuthSecurityEvent[] @relation("SecuritySubject")
actorSecurityEvents AuthSecurityEvent[] @relation("SecurityActor")
activations AccountActivation[] @relation("ActivationAccount")
accessInvites AccessInvite[] @relation("InviteAccount")
issuedInvites AccessInvite[] @relation("InviteIssuer")
passwordResetTokens PasswordResetToken[] @relation("ResetAccount")
createdActivations AccountActivation[] @relation("ActivationCreator")
auditEntries        AuditEntry[]
exportRuns          ExportRun[]
commandReceipts     CommandReceipt[]
publishedBrandRevisions BrandRevision[]
publishedAcademicCalendarRevisions CalendarRevision[] @relation("AcademicRevisionPublisher")
personBindings AccountPersonBinding[] @relation("PersonAccountBinding")
verifiedPersonBindings AccountPersonBinding[] @relation("PersonBindingVerifier")
createdImportJobs ImportJob[] @relation("ImportJobActor")
attendanceRevisions AttendanceRevision[] @relation("AttendanceRevisionActor")
```

## Keys and indexes (exact Prisma declarations)
```prisma
@@unique([normalizedEmail], map: "vs_access_user_account_u0_key")
@@index([status, id], map: "vs_access_user_account_q0_idx")
@@map("vs_access_user_account")
```

SQL-only CHECK constraints, partial/exclusion indexes and triggers are retained in engineering/source-reference/prisma/migrations. Never treat this model excerpt as sufficient to recreate deployed DDL. Cross-check live migration head in EX-00. Zero schema change is needed for presentation-only adoption.
