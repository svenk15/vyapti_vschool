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

`StaffDirectoryQuery = { by: 'name'|'employeeCode'; q: string; categories: StaffCategory[]; employment: ('ACTIVE'|'ENDED'|'UNKNOWN')[]; teaching: ('NOT_ENABLED'|'ENABLED'|'DISABLED'|'UNKNOWN')[]; access: ('NO_ACCOUNT'|'INVITATION_PENDING'|'ACTIVE'|'SUSPENDED'|'REVOKED'|'UNKNOWN')[]; sort: 'name'|'employeeCode'|'employment'|'teaching'|'access'; order: 'asc'|'desc'; after?: string; before?: string; limit: 1..100 }`.

Repository returns `{ items, nextCursor, previousCursor, total?: number }`. Cursors are HMAC-signed and bind organization, branch, actor authorization version, the complete normalized query, direction, People configuration version, Academics projection revision, Access projection revision and the final sort tuple. Any query, permission or owner-projection revision change invalidates the cursor and restarts at the first page with `STALE_DIRECTORY_CURSOR`. Sorting always ends with normalized Staff code and Employee `id`; these tie-breakers remain ascending even when the selected primary order is descending. Name/code search remains a Staff directory query and never becomes Person identity resolution.

### Full-result query semantics

People-native name, Staff code, category and employment predicates execute in the scoped People query. Teaching and Access values are not inferred from People rows and are never hydrated after People pagination. Academics and Access must each publish a versioned, scope-keyed **read contract** for this directory:

- Academics publishes one current Staff-directory fact per Employee: `ENABLED`, `NOT_ENABLED`, `DISABLED` or `UNKNOWN`, plus an owner projection revision.
- Access publishes one current Staff-directory fact per exact Employee/Person binding: `NO_ACCOUNT`, `INVITATION_PENDING`, `ACTIVE`, `SUSPENDED`, `REVOKED` or `UNKNOWN`, plus an owner projection revision.
- The contracts may be implemented as owner-controlled database views or another reviewed database-side projection. They are not private-table access and do not confer mutation authority.

The composed `StaffDirectoryQueryPort` joins the scoped People base with those published read contracts, applies **all** search predicates, filters and the primary ordering in the database, and only then applies the signed keyset cursor and `limit + 1`. The count, when requested, uses the identical predicate over the full authorized result set. Browser code and a People page result may not filter, sort or count an already-paginated page.

The current Academics and Access contracts expose per-record display facts but no database-side selection/order contract. Therefore production Teaching/Access filter and sort controls remain an **engineering design gap** until those published projections and revision semantics are implemented. The local prototype demonstrates the interaction over its complete four-record fictional set; it is not evidence that the current production query supports those controls.

### Null, unknown and deterministic order

- A proven absence of an exact Account binding maps to `NO_ACCOUNT`; a missing, stale, conflicting or unauthorized Access projection maps to `UNKNOWN`, never `NO_ACCOUNT`.
- No Teacher row maps to `NOT_ENABLED` only when Academics can authoritatively establish that absence. An unavailable or stale projection maps to `UNKNOWN`.
- `Any` includes unknown values. Selecting a concrete value excludes `UNKNOWN`; an explicit Unknown filter may be exposed only if product copy is approved.
- Ascending state ranks are employment `ACTIVE, ENDED, UNKNOWN`; teaching `ENABLED, NOT_ENABLED, DISABLED, UNKNOWN`; and access `ACTIVE, INVITATION_PENDING, SUSPENDED, REVOKED, NO_ACCOUNT, UNKNOWN`. Descending reverses only the primary rank.
- Name sorts by NFC-normalized, case-folded display name; Staff code sorts by NFC-normalized, case-folded code. Both end with normalized Staff code and Employee ID.

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

### Correction intent and recovery

Selecting Save creates an immutable browser/application operation snapshot for exactly one owner section: target ID, normalized submitted fields, bounded reason, owner expected version and original request key. Both sections remain independent editable drafts. While either owner operation is `UNKNOWN`, both Save actions are disabled so a second operation cannot replace or clear the pending snapshot. Closing and reopening retains that snapshot and both drafts. Status/replay resolves the immutable snapshot rather than current form values. Exact repeated recovery returns the original result and does not append a second revision. Once the unknown result is resolved, Save is enabled and the other section may start a distinct operation with its own payload, version and key.

A stale response retains three distinct values: latest owner values/version, attempted submitted values and any unrelated-section draft. The UI compares every changed field and requires explicit review before a new operation with the latest expected version and a new key. `UNKNOWN` never becomes stale merely because a later read differs. `COMMITTED_REFRESH_FAILED` is confirmed success: Close/Escape preserves it and recovery performs an authorized read only.

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

`EndStaffEmploymentPlan` reads current People/Academics/Access impacts with versions. Final confirmation contains the exact plan hash, reviewed branch-local effective date and separate owner keys. After PD-STF-03 approval, a **People-owned employment-end intent** records the plan hash, target Employee, initiating actor, `accessCommandKey`, `employmentCommandKey`, safe owner receipt references and step state. It is not a generic Coordination case and grants no authority. The application coordinator:

1. reauthorizes and re-previews;
2. performs the Access suspension if required and authorized, resolving any unknown Access result before proceeding;
3. performs People end-employment with its own key;
4. updates the People intent with owner receipt references and state `NOT_STARTED|ACCESS_UNKNOWN|ACCESS_COMMITTED|EMPLOYMENT_UNKNOWN|COMPLETE|BLOCKED|RECOVERY_DENIED`.

If a shared enlisted transaction is not technically available, do not label the operation atomic. A lost response recovers each owner outcome by its original owner key, then continues only the missing safe step. People never starts while Access is `UNKNOWN`. Compensation never reactivates a membership or rewrites employment automatically. Last-admin and known assignment blocks stop before mutation; a new blocker discovered after Access commits becomes an explicit partial state. Any currently authorized administrator with the capabilities required by the stored Access disposition may resume the People intent; receipt disclosure is reauthorized first. An actor without Access authority cannot initiate the combined operation when a membership suspension is required.

An authoritative `NO_RELEVANT_ACTIVE_MEMBERSHIP` result records Access as `NOT_REQUIRED` and creates no Access key or receipt. The completion text describes only the People result. The reviewed effective date remains part of the People payload/key across recovery. Crossing branch-local midnight never changes it silently: resolve unknown outcomes first, then create a fresh reviewed People operation/key if the date must change. The full state/action contract is in `EMPLOYMENT_END_FAILURE_CONTRACT.md`.

### Proposed persistence after PD-STF-03

`vs_people_employment_end_intent`: scope IDs, Employee ID, expected Employee version, reviewed branch-local effective date, plan hash, nullable Access membership ID/version, `access_disposition` (`REQUIRED|NOT_REQUIRED`), initiating actor, nullable Access command key, People command key, safe nullable Access receipt reference, safe People receipt reference, state, last safe failure code, created/updated timestamps. Unique active intent per scoped Employee; unique non-null scoped owner keys. Restricted receipt bodies stay with their owners.

## 8. Rejoining STF-08

After PD-STF-04, add `vs_people_employment_episode` with scope IDs, Employee ID, `valid_from`, nullable exclusive `valid_to`, version, reason/actor/timestamps, no-overlap constraint and one open episode. Forward migration backfills exactly one episode from every existing Employee row; it preserves Employee IDs and existing dates. `startEmploymentEpisode` checks no open episode and expected Employee version. Access, Teacher and assignments remain unchanged/off until independently restored.

## 9. Recovery and browser state

Every changed mutation adapter exposes `IDLE|PENDING|UNKNOWN|FOUND|COMMITTED_REFRESH_FAILED|STALE_REVIEW_REQUIRED|DENIED`. Owner status/replay endpoints never use a generic receipt repository. Protected receipt reads repeat current account/token, branch, capability, module and resource checks. Changed input with the same key conflicts. After `FOUND`, refresh uses GET only. Close/Cancel/Escape cannot convert confirmed success to unknown.

## 10. Migration and registry plan

Each approved persistence slice gets a separate forward migration, populated upgrade test and `docs/database/TABLE_REGISTRY.json` update. No migration is authored until its product decision is accepted. Development/test migration states are recorded separately; no reset, applied-migration edit or synthetic backfill is permitted.
