# Guardians — detailed design

Last reconciled: 13 October 2026. This live LLD implements the owner-approved simplified Parent/Guardian foundation and supersedes the five-state relationship proposal recorded at `20cdd8b`.

## Scope and invariants

Guardians owns a school's explicit authorization for one adult contact to read one Student's approved family bundle. Access continues to own global accounts, password/session policy and token hashing; People owns Person identity; Students, Attendance and Academics remain the sources of child, roster and timetable data.

Student registration commits before guardian onboarding. Its receipt links to the existing guarded Guardian composition for that exact Student, where the authorized manager enters the guardian name/email, reviews the fixed read bundle and initiates the invitation. Guardian delivery occurs after both Student registration and Guardian authorization commit; a delivery failure can undo neither record, and retry keeps the existing Student identity rather than registering it again.

`family.access.manage` is a separately provisioned branch capability. A current active School Administrator needs an active manager grant to authorize, resend, correct an outstanding recipient or remove access. It is never inferred from `SCHOOL_ADMIN`, cannot be delegated in the portal, and cannot authorize the actor's own account. Guardians are not SchoolMemberships and receive no RoleGrant.

The fixed first-release bundle is `child.summary.read`, `attendance.read_child`, and `timetable.read_child`. Each is stored and checked separately, but ordinary onboarding grants all three together. Matching email, contact data, invitation possession, account activation, a relationship label or access to another child grants nothing. A relationship label is descriptive only.

Access becomes usable only when the intended account accepts a live invitation, the child authorization is not revoked, the requested purpose exists, the organization/school/Student scope matches, and the consuming owner module is currently released, entitled and active. `access_from` is the branch-local authorization date; Attendance and Timetable exclude earlier records. No backdating UI exists.

## Physical schema

All four tables are Path A branch-owned tenant tables. Application authorization remains mandatory; RLS ENABLE/FORCE and policies stay at the TEN-03 production gate.

| Model / physical table | Fields | Constraints and indexes |
|---|---|---|
| `vs_guardians_access_manager_grant` (FamilyAccessManagerGrant) | id uuid PK; organization_id uuid; school_id uuid; membership_id uuid; account_id uuid; granted_by_operator_id uuid; granted_at timestamptz(3); revoked_at timestamptz(3) nullable; version int | Scoped School and SchoolMembership FKs; unique scope/account; positive version; active capability lookup index; current administrator membership rechecked by application |
| `vs_guardians_child_access` (GuardianChildAccess) | id uuid PK; organization_id uuid; school_id uuid; student_id uuid; display_name varchar(160); normalized_email varchar(254); account_id/person_id nullable; authorized_by_account_id uuid; authorized_at timestamptz(3); access_from date; accepted_at/revoked_at/revoked_by_account_id/revocation_reason nullable; version int; created_at timestamptz(3) | Scoped Student/Person and global account/actor FKs; coherent acceptance/revocation evidence; partial unique non-revoked child/email; scope/student and account indexes |
| `vs_guardians_purpose_grant` (GuardianPurposeGrant) | id uuid PK; organization_id uuid; school_id uuid; access_id uuid; student_id uuid; purpose varchar(40); granted_at timestamptz(3) | Scoped access+Student FK; allowed-purpose check; unique access/purpose; scoped purpose lookup index |
| `vs_guardians_invitation` (FamilyInvitation) | id uuid PK; organization_id uuid; school_id uuid; access_id uuid; intended_account_id uuid; token_hash char(64); delivery_status varchar(24); delivered_at/delivery_failed_at/delivery_failure_reason nullable; created_by_account_id uuid; created_at/expires_at timestamptz(3); accepted_at/revoked_at nullable; version int | Scoped access FK; global intended-account/creator FKs; unique token hash; delivery-state/evidence and expiry checks; access history and account expiry indexes |

The physical migration also adds the required scoped composite keys to Guardian rows, CHECK constraints, the partial uniqueness for a non-revoked child/email authorization, and the canonical TEN-ADR-006 Path A comments. No row contains a raw token, password, identity document or sensitive narrative.

## Ports and use cases

- `grantManager(operator, scope, accountId)` is trusted local operator tooling only. It verifies an active School Administrator membership and upserts the branch grant; it does not change roles.
- `authorizeChild(actor, studentId, contact, key)` validates the fixed bundle, locks account → organization → school, checks `family.access.manage`, rejects self-authorization, creates/reuses the intended global account without overwriting an existing password, writes the authorization, purpose rows, invitation and platform evidence atomically, then attempts delivery after commit. HYBRID/EMAIL use the file/email adapter; OPERATOR_CLI returns `OPERATOR_REQUIRED` without pretending an email was sent.
- `listChildAccess(actor, studentId)` applies the same live manager guard and returns contact, derived invitation/access label, version and permitted actions. It exposes no token or other guardian information to Parents.
- `resendInvitation(actor, accessId, key)` locks the same guards and access row, revokes outstanding invitations, creates one fresh invitation for the same scope/account and delivers after commit. It never duplicates the authorization.
- `removeAccess(actor, accessId, expectedVersion, reason, key)` revokes only that child authorization and outstanding invitations, preserving rows/history and unrelated child links.
- `acceptInvitation(identity?, token, initialPassword?)` locks the intended account, scope and access; rechecks live invitation and authorization. An active existing account must be authenticated as the intended account. A pending account may set an approved password through this command. Acceptance establishes/reuses the organization AccountPersonBinding and marks the exact access/invitation accepted atomically. Repeat accepted use returns the existing outcome only to the intended current account.
- `listChildren(actor)` begins from accepted, non-revoked access rows for the current active account and returns minimal Student/current placement/school data plus available purpose keys. It never starts from Student search.
- `familyTimetable(actor, studentId, week)` resolves the effective immutable publication for every school-local date through Academics and returns configured teaching days plus ordered LESSON/BREAK periods even when no lesson occurrence exists. It never assumes five weekdays; active Enrollment/Placement and `access_from` remain date-effective bounds.

Browser-safe DTOs live in `shared/contracts/guardians.ts`; application ports/facade live in `backend/modules/guardians/application`; Prisma and email status persistence live in infrastructure; framework-free construction lives in `backend/composition`; Next authentication/origin/body/error adapters live in `lib/server`; pages/components contain presentation only.

## Transactions, locks and replay

Commands use READ COMMITTED with `SELECT ... FOR UPDATE` in account → organization → school order, followed by the exact access/invitation row. Student is read with the scoped key after the school lock. Platform command receipt lookup is scoped by organization/school/actor/command/key; same key and canonical input replays, while changed input conflicts. Business rows and audit/outbox/receipt commit together. Email occurs after commit, and its result updates only a pending delivery record. Delivery failure does not roll back Student or guardian authorization.

Invitation acceptance and revocation serialize on the access and invitation rows. Exactly one can transition the invitation; a later operation re-reads the committed state. Revocation never deletes history or increments the global account token version because unrelated links/sessions remain valid; every protected Parent request rechecks the exact link so access disappears immediately.

## Reads and failure states

Admin lookup is `actor account → active SchoolMembership + SCHOOL_ADMIN → active manager grant → scoped Student → child access/invitations`. Parent lookup is `active account/token → accepted non-revoked child access → exact purpose row → active organization/school → scoped Student → current Enrollment/Placement`. Consuming modules add their release/entitlement/activation and resource checks. Lists are ordered by child display name then stable access ID and limited to 100 in the first slice; no public pagination or child search is introduced.

Failures are `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, `CONFLICT`, `STALE_VERSION`, `IDEMPOTENCY_CONFLICT`, `INVITATION_INVALID`, `RELEASE_UNAVAILABLE`, `MODULE_NOT_LICENSED`, `MODULE_DISABLED`, and `UNAVAILABLE`. Public invitation and recovery errors remain non-enumerating. UI states are no link, invite sent, delivery failed, access enabled, access removed and module unavailable; these are derived labels, not stored relationship states.

## Verification contract

Real PostgreSQL proves designated manager authorization, self-authorization denial, email-only denial, new/existing account acceptance, wrong account/expired/revoked/reused token handling, acceptance-versus-revocation serialization, exact replay, delivery failure persistence, per-child revocation, purpose/scope/date bounds and mixed recovery policy. Playwright proves Administrator link/resend/remove, guardian activation/sign-in/child selection, home, Attendance, Timetable and sign-out at desktop/mobile with keyboard focus. Human visual review, font portability, native accessibility, TEN-03 and production email remain separate gates.
