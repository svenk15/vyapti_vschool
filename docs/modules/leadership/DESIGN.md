# Principal leadership — low-level design

Status: active first-release design · 16 October 2026.

## LDR-01 / LEA-01 design delta

The Access module owns Principal identity and branch membership. `PRINCIPAL` is a fixed `RoleGrant` code on an active `SchoolMembership`; it is not an operator, institution administrator, school administrator, or teacher alias. Only the existing verified operator `SetBranchMembership` command may add or remove this code in the first release. School staff-management commands reject any target membership containing `PRINCIPAL`, preventing self-grant, delegated grant, suspension, role replacement, or privilege expansion through the administrator UI.

`getLeadershipHome(identity, schoolId?)` is a transport-neutral Access query. It validates the live account/token version, active organization, active school, active exact membership, and exact Principal grant in one repeatable-read scope snapshot. The optional school ID is only a candidate. It returns the existing browser-safe `AdminHome` context with `leadership.read` and `self.read`; the Principal role grants no attendance, student, staff, finance, assessment, communication, export, or mutation capability.

The context directory returns each currently authorized branch and its server-derived fixed roles. `/choose-workspace` expands these facts into distinct role/branch choices. Confirmation calls the existing context-switch endpoint, which reauthorizes the branch before setting the account-bound candidate cookie. `/leadership` then independently calls `getLeadershipHome`; revoked or forged context returns no protected content. Branch changes clear the page through a full navigation and the existing cross-tab context notification.

The Principal shell uses the shared portal shell, school branding, mobile focus trap, branch control, account entry, and separate sign-out. The initial home intentionally contains no operational totals. It states that owner projections are unavailable rather than displaying fabricated zeroes. LDR-02 will add the bounded Attendance due-register projection only after its metric contract and module/capability gate are implemented.

### Persistence and migration

No new table is introduced. Forward migration `20261016000100_principal_branch_role` replaces only the `vs_access_role_grant_state_check` constraint so `code` accepts `SCHOOL_ADMIN`, `TEACHER`, or `PRINCIPAL`. Existing rows and indexes are unchanged. RoleGrant remains a branch-classified Access table with `(organization_id, school_id, membership_id)` scope and the existing unique key. Application authorization remains mandatory; TEN-03 still owns restricted runtime roles and RLS enforcement.

### Transactions and concurrency

Principal grant changes reuse the operator-only `SetBranchMembership` transaction, account/organization/school locks, expected membership version, idempotency key, redacted audit/outbox/receipt evidence, and retry policy. Reads do not acquire write locks. A stale or revoked grant fails on the next protected read. Administrator membership commands check for `PRINCIPAL` after locking and return `FORBIDDEN` without changing grants or evidence.

### Failure states and verification

- Missing/expired session returns to sign-in.
- Missing, revoked, suspended, foreign-branch, or forged Principal grant exposes no leadership page.
- Other roles never receive `leadership.read` implicitly.
- A multi-role account sees a distinct workspace choice; the selected role does not widen the underlying branch grant.
- Unavailable operational projections render an honest unavailable state without zero totals or dead actions.

Verification requires fixed-capability unit checks, real PostgreSQL grant/revocation/cross-branch/administrator-denial checks, migration compatibility, and desktop/mobile Playwright entry, role choice, revocation, keyboard, and screenshot comparison against the approved Principal pack. Human acceptance remains separate.

## Planned owner slices

LDR-02 owns the Attendance due-register read projection and exact metric definition. LDR-03 owns session evidence freshness. LDR-04 through LDR-06 require the approved Coordination write owner. No later approval or sensitive-record authority is inferred from this foundation.
