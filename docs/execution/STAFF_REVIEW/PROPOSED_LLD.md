# Proposed Staff completion LLD

Status: proposed technical design. Existing rules are cited; PD-STF-01–04 in `DECISION_REGISTER.md` remain unapproved product decisions. No schema or production code is changed by this package.

## 1. Boundary map

- `backend/modules/people/domain`: Person/Employee normalization, linkage and employment-episode invariants.
- `backend/modules/people/application`: Staff queries/commands and ports; no Next/Prisma imports.
- `backend/modules/people/contracts`: minimal Person/Employee facts consumed by Access/Academics and minimal foreign projections consumed by Staff profile.
- `backend/modules/people/infrastructure`: scoped Prisma queries, locks, mappings, receipts and restricted People evidence.
- `backend/modules/academics`: owns Teacher eligibility intervals and assignments.
- `backend/modules/access`: owns Account, binding, membership, roles, invitation and session consequences.
- `backend/composition`: injects People ↔ Access/Academics ports and orchestration without foreign repositories.
- `lib/server` and `app/api/v1`: authenticated host adapters and thin delivery.
- `shared/contracts/people.ts`: JSON-safe Staff DTOs only.

## 2. Directory slice STF-01

### Contract

`StaffDirectoryQuery = { by: 'name'|'employeeCode'; q: string; categories: StaffCategory[]; employment: ('ACTIVE'|'ENDED')[]; teaching: ('NOT_ENABLED'|'ENABLED'|'DISABLED')[]; access: ('UNLINKED'|'LINKED'|'ACTIVE')[]; sort: 'name'|'employeeCode'|'employment'|'teaching'|'access'; order: 'asc'|'desc'; after?: string; before?: string; limit: 1..100 }`.

Repository returns `{ items, nextCursor, previousCursor, total?: number }`. Cursors are HMAC-signed and bind organization, branch, actor authorization version, normalized query, direction and final sort tuple. Sorting always ends with Employee `id`. Name/code search remains a Staff directory query and never becomes Person identity resolution.

Reads `vs_people_employee`, `vs_people_person`, current `vs_academics_teacher`, verified Access binding/membership facts through typed projection ports. It does not read Access/Academics private tables in People infrastructure.

## 3. Existing-Person Employee slice STF-02

### Proposed application contracts

```ts
type ResolveEmployeePersonCandidate = {
  organizationId: string;
  schoolId: string;
  personId: string;
};

type CreateEmployeeForExistingPerson = {
  personId: string;
  personVersion: number;
  staffNumber: string;
  category: StaffCategory;
  employedFrom: CivilDate;
  verificationReference: string;
  reason: string;
  confirmed: true;
  key: UUID;
};
```

Candidate output is bounded: Person ID, display name, masked contact hint if allowed, Person version, existing branch-Employee yes/no and safe evidence prompt. No list/fuzzy/email/name endpoint is added.

### Authorization and transaction

Resolve current account/token → active institution/branch → `class.manage` → Staff release/entitlement/activation → proposed identity-attester grant → exact organization Person. Creation lock order preserves account → Organization → School → Person → scoped Employee uniqueness. Recheck attestation authority before receipt disclosure. Same Person/branch Employee rejects atomically. Create only Employee, restricted linkage evidence, school revision, platform audit/outbox and People receipt.

### Proposed persistence (after PD-STF-01)

`vs_people_employee_linkage_evidence`: `id`, `organization_id`, `school_id`, `employee_id`, `person_id`, `attested_by_account_id`, `verification_reference`, `reason`, `occurred_at`. Scope-inclusive foreign keys; unique Employee linkage evidence for creation; indexes on `(organization_id, school_id, employee_id)` and `(organization_id, person_id, occurred_at desc)`. Restricted body never enters ordinary DTOs/logs. No Person merge table.

## 4. Profile and corrections STF-03

### Read model

People profile facade composes:

- People: Person display/contact-safe facts, Employee code/category/current employment/version and People history.
- Academics port: Teacher ID, dated eligibility, current/historical assignment summaries and safe impact links.
- Access port: binding present, membership/invitation lifecycle, roles and safe action eligibility. No email/token/evidence body beyond authorized DTO.

Each foreign port reauthorizes its owner facts. People cannot infer authority from receiving the projection.

### Proposed commands after PD-STF-02

- `CorrectStaffPerson(personId, expectedVersion, allowedPatch, reason, key)`.
- `CorrectEmployeeDetails(employeeId, expectedVersion, allowedPatch, reason, key)`.

Contact email is descriptive People data and never changes `UserAccount.normalizedEmail`. Staff code uniqueness remains `(organization_id, school_id, staff_number)`. Unsafe initial-date changes fail with an impact result; they do not rewrite assignments, Timetable, Attendance or receipts.

### Proposed persistence

Extend the existing `vs_people_person_name_revision` only if its invariant can represent all approved Person patches; otherwise add `vs_people_person_revision` with versioned, redacted structured changes. Add `vs_people_employee_revision` for code/category/date changes. Do not migrate until PD-STF-02 fixes the field/evidence contract. Previous codes remain reserved through a scoped historical uniqueness strategy if approved.

## 5. Dated Teacher eligibility STF-05

Academics replaces boolean-only eligibility semantics with immutable revisions and one current bounded interval. Proposed table `vs_academics_teacher_eligibility_period`: scope IDs, Teacher ID, `valid_from`, nullable `valid_to` exclusive, version, reason, actor and timestamp; no overlapping periods per Teacher. Existing Teacher `active` remains a compatibility projection during forward migration.

Before create/change/end, Academics checks every current/future TeacherAssignment interval and existing frozen session impact through owner ports. Blocking results return safe assignment identifiers/labels and dates. No assignment/history rewrite occurs. Access Teacher role remains independent.

## 6. Access invitation/lifecycle STF-06

Keep existing Access tables, recovery guard, lock order, token replacement and provider-result update. Add a bounded administrator reason to the resend application input, input hash, restricted evidence and audit. Employee-context projection maps invitation states `PENDING_DELIVERY|SENT|FAILED|EXPIRED|CONSUMED|REVOKED` without exposing token hashes. Replay reauthorizes current actor/target before revealing the original result.

## 7. Employment end STF-07

### People command retained

Current `endEmployment(employeeId, expectedVersion, effectiveDate=today, reason, key)` remains the People owner operation and continues to disable Teacher through its approved port and guard assignment impact.

### Proposed orchestration after PD-STF-03

`EndStaffEmploymentPlan` reads current People/Academics/Access impacts with versions. Final confirmation contains the exact plan hash and separate owner keys. The application coordinator:

1. reauthorizes and re-previews;
2. performs the Access suspension if required and authorized;
3. performs People end-employment with its own key;
4. stores a coordination result containing owner receipt references and state `COMPLETE|PENDING_RECONCILIATION|BLOCKED`.

If a shared enlisted transaction is not technically available, do not label the operation atomic. A lost response recovers each owner outcome by its original key, then continues only the missing safe step. Compensation never reactivates a membership or rewrites employment automatically. Last-admin and assignment blocks are terminal until the underlying supported condition changes.

## 8. Rejoining STF-08

After PD-STF-04, add `vs_people_employment_episode` with scope IDs, Employee ID, `valid_from`, nullable exclusive `valid_to`, version, reason/actor/timestamps, no-overlap constraint and one open episode. Forward migration backfills exactly one episode from every existing Employee row; it preserves Employee IDs and existing dates. `startEmploymentEpisode` checks no open episode and expected Employee version. Access, Teacher and assignments remain unchanged/off until independently restored.

## 9. Recovery and browser state

Every changed mutation adapter exposes `IDLE|PENDING|UNKNOWN|FOUND|COMMITTED_REFRESH_FAILED|STALE_REVIEW_REQUIRED|DENIED`. Owner status/replay endpoints never use a generic receipt repository. Protected receipt reads repeat current account/token, branch, capability, module and resource checks. Changed input with the same key conflicts. After `FOUND`, refresh uses GET only. Close/Cancel/Escape cannot convert confirmed success to unknown.

## 10. Migration and registry plan

Each approved persistence slice gets a separate forward migration, populated upgrade test and `docs/database/TABLE_REGISTRY.json` update. No migration is authored until its product decision is accepted. Development/test migration states are recorded separately; no reset, applied-migration edit or synthetic backfill is permitted.
