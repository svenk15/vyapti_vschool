# Academics — School Administrator design

Edition 01 · Owner mapping: academics · UX proposal; human review pending.

Prepare years, classes, subjects and teaching assignments.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-09"></a>
## SA-09 — Create an academic year and calendar

**Phase:** 1 · **Authority:** school.manage

**Entry:** the Academics workspace or its linked record. Prototype: `#/flow/SA-09`.

**Prerequisites:** SA-06.

### Step 1 — Academic year

Use the school’s civil dates.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Year name (`name`) | text | Yes | 2026–27 |
| Start date (`from`) | date | Yes | No prefilled user content |
| End date (`to`) | date | Yes | No prefilled user content |

### Step 2 — Teaching days

Calendar changes create a reviewed revision.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Teaching week (`week`) | select | Yes | Monday–Friday, Monday–Saturday |
| Holiday dates and descriptions (`holidays`) | textarea | Yes | No prefilled user content |

### Step 3 — Review impact

Check date bounds and existing scheduled sessions before saving.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed calendar conflicts. (`impact`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A valid year and immutable calendar revision are available.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Reject invalid/reversed ranges and incompatible scheduled dates; existing sessions keep their pinned calendar revision.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

A concurrent calendar update requires reload and impact review.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Academics owns AcademicYear and CalendarRevision; sessions reference the selected calendar version.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-10"></a>
## SA-10 — Configure grades, sections and subjects

**Phase:** 1 · **Authority:** class.manage

**Entry:** the Academics workspace or its linked record. Prototype: `#/flow/SA-10`.

**Prerequisites:** SA-09.

### Step 1 — Class structure

Codes are unique within the documented branch/year scope.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Grade (`grade`) | select | Yes | Grade 6, Grade 7, Grade 8 |
| Section code (`section`) | text | Yes | C |
| Subject name (`subject`) | text | Yes | Science |

### Step 2 — Review dependencies

Referenced records can be retired prospectively, never deleted from history.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The class and subject are available for offering setup.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Do not silently merge duplicate names; enforce scoped code constraints.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

An in-use record shows dependency counts and a supported retirement path.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Academics owns Grade, Section and Subject; enrollment placements and offerings reference their identities.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-11"></a>
## SA-11 — Create an offering and assign a teacher

**Phase:** 1 · **Authority:** class.manage

**Entry:** the Academics workspace or its linked record. Prototype: `#/flow/SA-11`.

**Prerequisites:** SA-10, SA-16.

### Step 1 — Teaching context

An offering connects class, subject and academic year.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| Subject (`subject`) | select | Yes | Mathematics, English, Science |
| Academic year (`year`) | text | Yes | 2026–27 |

### Step 2 — Teacher and dates

Only verified, eligible teachers appear.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Teacher (`teacher`) | select | Yes | Ananya Rao · EMP-001, Rohan Das · EMP-002 |
| Effective from (`from`) | date | Yes | No prefilled user content |
| Effective until (`to`) | date | Yes | No prefilled user content |

### Step 3 — Review assignment

Check teacher eligibility and schedule clashes.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the assignment period. (`confirmed`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A dated teaching assignment is saved.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Identity binding and teacher eligibility are separate from account activation; enforce non-overlap under the documented guard.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

A teacher becoming ineligible before save rejects the command and retains safe form input.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Academics owns Offering and Assignment; published People/Access contracts verify Employee, Person binding and membership.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-12"></a>
## SA-12 — Change calendar or teaching assignment

**Phase:** 1 · **Authority:** class.manage / school.manage

**Entry:** the Academics workspace or its linked record. Prototype: `#/flow/SA-12`.

**Prerequisites:** SA-11, SA-25.

### Step 1 — Choose the change

Show the effective date and affected future sessions.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Change (`change`) | select | Yes | Calendar revision, Teacher assignment end date |
| Effective date (`effective`) | date | Yes | No prefilled user content |

### Step 2 — Review affected sessions

Open and submitted sessions cannot be silently rewritten.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reviewed impact reference (`impact`) | textarea | Yes | No prefilled user content |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

A supported future-dated change preserves historical references.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Block changes affecting frozen/submitted roster history in the first release; substitutions are a later explicit workflow.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

List conflicting sessions and let the administrator resolve them before retrying.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Owner use case reads dependent AttendanceSession references; new academic revision/dates plus transactional audit.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
