# Admissions — live low-level design

Status: SA-38 design ready on 11 October 2026. This live contract adopts only the approved inquiry/application-start slice. SA-39 decision capacity and SA-40 Student conversion remain separate tasks. The `admissions` release, institution entitlement and branch activation must all be current; this implementation does not enable them for an existing client.

## SA-38 invariants and ownership

Admissions owns `AdmissionCycle`, `Applicant` and `AdmissionApplication`. An Applicant is branch-scoped intake identity, not a People `Person` and not a Student. Starting an application never creates or merges a Person, Student, Enrollment, guardian link, invoice or message. Applicant name and contact email are collected only for the application purpose. The required collection-notice acknowledgement is stored as a timestamp. An exact same normalized name + contact + cycle + grade is a duplicate candidate and returns `CONFLICT`; it is never auto-merged. Different applicants may share an email.

An OPEN cycle is selectable only while school-local today is within its inclusive `opens_on`/`closes_on` window. Applying grade must be an active branch GradeLevel. Application state starts at `STARTED`, version 1. Reference is an opaque branch-unique `APP-…` value. No durable browser draft exists in this slice. Retention deletion is unsupported; real-client retention remains a release-policy gate and must use a future explicit purge contract.

## Physical schema and reads

| Table | Columns and constraints | Reads/indexes |
|---|---|---|
| `vs_admissions_cycle` (AdmissionCycle; ADM-01) | id uuid PK; organization_id uuid; school_id uuid; code varchar(40); name varchar(160); opens_on date; closes_on date; state varchar(20); version int | Branch admission intake window selectable by SA-38. | Scoped organization/school FKs and unique id/code; valid inclusive date range; OPEN/CLOSED state; positive version; open-cycle context index |
| `vs_admissions_applicant` (AdmissionApplicant; ADM-01) | id uuid PK; organization_id uuid; school_id uuid; display_name varchar(160); normalized_name varchar(160); contact_email varchar(254); created_at timestamptz(3) | Purpose-bound intake identity; never an automatic Person or Student. | Scoped organization/school FKs and unique id; bounded text/email; scoped contact lookup index |
| `vs_admissions_application` (AdmissionApplication; ADM-01) | id uuid PK; organization_id uuid; school_id uuid; applicant_id uuid; cycle_id uuid; grade_id uuid; reference varchar(40); state varchar(20); collection_notice_provided_at timestamptz(3); dedupe_key char(64); version int; created_by uuid; created_at timestamptz(3) | Started application with notice evidence, exact duplicate guard and next-action receipt. | Scoped Applicant/Cycle/Grade FKs; actor FK; unique scoped id/reference and cycle/dedupe key; STARTED state; positive version; scoped created-at index |

Context joins `Cycle` and active Academic `GradeLevel` with exact organization/school predicates. Receipt replay resolves the exact scoped Application and Applicant. No read joins People/Students. All three tables are BRANCH classified and registered for the Path A TEN-03 closure gate; application authorization remains active on every read/write.

## Ports, transaction and authorization

`shared/contracts/admissions.ts` owns JSON-safe context/input/result DTOs. Domain validates NFC/trimmed name (1–160), normalized email (<=254), UUID cycle/grade, notice=true and 16–100 ASCII command key. Application exposes a transport-neutral `AdmissionsFacade`; infrastructure owns Prisma and evidence writes; `backend/composition/admissions.ts` injects database URL, released-module manifest and clock; `lib/server` supplies current scope and Next HTTP handling.

Both context and create recheck active account/token, Organization, School, active SCHOOL_ADMIN membership, `admissions.manage`, admissions + student_core current release/entitlement/activation. The create lock order is account UPDATE → Organization SHARE → School UPDATE. Within that serializable transaction it rechecks cycle window and grade, then checks the scoped command receipt. Same key/same input reauthorizes and returns the original result; changed input returns `IDEMPOTENCY_CONFLICT`. Applicant, Application, platform audit/outbox and command receipt commit atomically. Platform evidence excludes applicant name/email and stores only application/cycle/grade IDs, state and version. SQL serialization/deadlock maps to `STALE_VERSION`; duplicate candidate/reference maps to `CONFLICT`.

## UI, failures and recovery

`/admin/admissions` follows approved stages **Applicant → Cycle and checklist → Confirm**. In-flow values survive Back/Continue; final Confirm alone sends the command. Lost acknowledgement keeps the exact payload/key and retries it. Success shows the reference, `STARTED` state and next action “Checklist review”. `Save draft and leave` remains disabled. Empty context distinguishes no open cycle from no active grade. Revocation clears protected form state on the next server response. Failure mapping: 400 validation/header mismatch; 401 unauthenticated; 403 permission; 404 scope/reference; 409 duplicate/idempotency/stale; 503 unavailable.

```mermaid
sequenceDiagram
  actor A as School administrator
  participant W as Admissions page/API
  participant U as Admissions facade
  participant R as PrismaAdmissionsRepository
  participant D as PostgreSQL
  A->>W: applicant + grade + cycle + notice + key
  W->>U: current identity and branch scope
  U->>R: startApplication
  R->>D: lock account → organization → school; reauthorize module and role
  R->>D: validate open cycle + active grade + receipt/dedup
  R->>D: Applicant + Application + audit/outbox/receipt atomically
  D-->>R: reference and STARTED result
  R-->>W: safe receipt
  W-->>A: application reference and next action
```

## Verification criteria

Unit: normalization, bounds, notice and key. Real PostgreSQL: current module/role/scope denial, no Student/Person writes, exact duplicate conflict without partial Applicant, rollback, same-key replay/changed-input conflict, cycle/grade rejection and cross-branch isolation. Browser desktop/mobile: exact stages, retained Back values, final-only write, response-loss replay, receipt, empty/error/permission states, keyboard focus and matched approved screenshots. Migration tests use populated existing tables and forward-only history. TEN-03, production retention, native accessibility and human review remain separate gates.

## SA-39 / SA-40 readiness boundary — 11 October 2026

SA-39 cannot be implemented safely from the catalog fields alone. The approved outcome requires an atomic seat reservation and offer expiry plus current delegated decision authority, but the live contract does not define capacity ownership and units, reservation creation/release/expiry, offer duration, delegation grant scope or expiry, restricted-note visibility, or document-review grants. `admissions.manage` must not be silently widened into decision authority. The smallest product decision is to approve those six rules and the distinct `admissions.review` capability; the recommended model is capacity per cycle and grade, one active reservation per application, school-local exclusive expiry, explicit dated branch delegation, reviewer-only reason text, and purpose-scoped document grants. Alternatives are advisory recommendations without offers, or deferring offers until a capacity owner exists; the former cannot satisfy SA-39's approved outcome.

SA-40 consequently remains blocked by SA-39 and the accepted one-time conversion handoff to Students. No Application state, reservation, offer or Student conversion table is added by ADM-01, and no browser action may simulate those outcomes.
