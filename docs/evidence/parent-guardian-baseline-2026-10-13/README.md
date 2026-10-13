# Parent/Guardian authority baseline — 13 October 2026

## Checkpoint

- Source inspected: `c55b202a9d74fd1a203cc9d2cfa364735e1c8607` on `work/stu-01-after-per02-wip`.
- Safe-boundary timestamp: 13 October 2026, 21:34 IST. Intended six-hour handover: 14 October 2026, 03:34 IST.
- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html`.
- Manifest integrity: reference SHA-256 `3f5fdc44d4d48dbb794dfa9cef61b1f09adbafadb737d73cbc99cdb71cc21f9e` exactly matches `implementation-spec/SOURCE_MANIFEST.json`.
- Reference status: Edition 01, `UX_DESIGN_PROPOSAL`, 52 catalog workflows. The database worksheet says its table contracts are proposals and that no migration or real database test is included.
- Product code, schema, migrations, database contents and demo configuration were not changed at this checkpoint.

## What is already real

The repository has a global active `UserAccount`, token-version session invalidation, organization-scoped verified `AccountPersonBinding`, institution/branch status, staff `SchoolMembership`, fixed `SCHOOL_ADMIN`/`TEACHER` roles, release/entitlement/activation guards, Students enrollment/placement, Attendance frozen rosters, and immutable published Timetable revisions. Current-session sign-out and generic public recovery exist for the approved staff/institution grant model.

Those records do not establish family authority. The live schema and code have no guardian-to-Student relationship, purpose grant, relationship verifier, family invitation binding, family principal, family permission registry, protected Parent route, or family seed helper. No application route/component/backend file contains a Parent/Guardian implementation. Existing staff invitations deliberately create staff membership and cannot be reused.

The Administrator matrix already records SA-32 as `BLOCKED_PRODUCT_DECISION`; SA-33 and SA-34 are design-readiness tasks. The Parent pack also states that its proposed capability names do not prove that the live permission registry contains them.

## Smallest decision set required

These are proposals for explicit approval, not implemented or accepted behavior.

1. **Verification authority and evidence** — Recommend a distinct `family.verify_relationship` capability granted only to designated school administrators. The verifier records an opaque, bounded verification reference and method code; general audit stores identifiers/status only, never evidence content. Consequence: a normal staff admin without this capability cannot create or verify a relationship.
2. **Relationship lifecycle** — Recommend an effective-dated, append-preserving Guardian relationship between an organization-scoped adult Person and scoped Student, with `PENDING_VERIFICATION`, `ACTIVE`, `RESTRICTED`, `REVOKED`, and `EXPIRED` states and optimistic versioning. Relationship labels carry no access by themselves. Consequence: history remains auditable and branch transfer never widens access automatically.
3. **Purpose grants** — Recommend an explicit allowlist of separately effective-dated grants per relationship, organization, school and Student. No wildcard or inheritance between children; overlapping active rows for the same relationship/scope/purpose are rejected. Initial release keys should be approved individually, beginning with `child.summary.read`, `attendance.read_child`, and `timetable.read_child`. Consequence: the first read-only workspace can ship without authorizing requests, payments, consent or acting for the child.
4. **Invitation/account binding and revocation** — Recommend that Access owns a single-use hashed token bound to the already-verified relationship and intended global account. Atomic consume activates only pre-approved grants; wrong account, expiry, delivery failure, relationship change, or revocation fails generically. Same completed token/account returns the existing safe receipt. Revocation becomes effective on every subsequent protected request and clears child data in the browser. Consequence: mailbox control cannot create or expand a relationship.
5. **Account-wide recovery** — Recommend that recovery eligibility includes family access without creating staff membership, while issuance and consumption apply the strictest active institution trust policy across staff, operator and family access. Compromised-mailbox recovery stays on a separately verified owner channel. Consequence: adding family access cannot weaken an existing account's recovery controls.

Approval must also name who may grant/restrict/revoke each purpose and whether that authority differs from relationship verification. Without that mapping, the runtime cannot distinguish a verified fact from permission to read or act.

## First implementation after approval

The narrow first vertical slice is Guardians foundation + PAR-01/PAR-04:

- portable Guardians domain for relationship/purpose effective-state validation;
- application ports for accepting a pre-verified invitation and listing permitted children;
- concrete Prisma adapter and typed composition factory;
- Access-owned invitation extension, browser-safe family DTOs, and thin Next adapters;
- forward-only `vs_guardians_*` migration with composite organization/school/Student constraints, live-query indexes and TEN-03 classification;
- transactional token consume, relationship/grant recheck, receipt/audit/outbox, exact replay and current-account validation;
- real PostgreSQL tests for wrong child/account/branch, pending/revoked/expired relationship, purpose separation, replay and concurrent revocation;
- Parent entry, no-link/pending/one-child/multiple-child states and direct approved-reference comparison.

No attendance/timetable query should be added until this authority port is verified. The next independent read slices are child overview, child attendance history and TT-06 Parent published timetable, each consuming the same current relationship/purpose port and its owner module's scoped query.

## Verification performed

No product tests or builds were rerun. This checkpoint used read-only source/schema inspection and the manifest hash command. `pnpm check:docs` is the only applicable repository check after adding the matrix/evidence. Human acceptance, font portability, native accessibility, TEN-03 and production readiness remain pending.
