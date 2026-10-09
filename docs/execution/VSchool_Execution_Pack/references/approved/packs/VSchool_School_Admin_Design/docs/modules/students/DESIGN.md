# Students — School Administrator design

Edition 01 · Owner mapping: people, students · UX proposal; human review pending.

Register, enroll and maintain each student’s dated school record.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-18"></a>
## SA-18 — Register a student manually

**Phase:** 1 · **Authority:** student.manage

**Entry:** the Students workspace or its linked record. Prototype: `#/flow/SA-18`.

**Prerequisites:** SA-01, exact identity selection contract.

### Step 1 — Identity

Create a person or explicitly select an exact existing identity.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Identity selection (`match`) | select | Yes | Create new Person, Exact person ID, Exact admission number |
| Exact reference if selecting existing (`lookup`) | text | No | No prefilled user content |
| First name (`first`) | text | Yes | No prefilled user content |
| Last name (`last`) | text | No | No prefilled user content |

### Step 2 — School record

Admission number stays stable in this branch.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Admission number (`admission`) | text | Yes | No prefilled user content |
| Admission date (`joined`) | date | Yes | No prefilled user content |

### Step 3 — Review identity

Review a single exact candidate; do not match by email, name similarity or ranked results.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have verified that this is the intended student. (`identity`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A Student profile references the deliberately selected organization Person.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Same-institution identity lookup is exact admission number or person ID only; no broad person discovery.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Duplicate/racing admission numbers show the existing permitted record or a conflict; no automatic merge.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

People Person and Students Student are created through the owner contracts in the documented transaction.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-19"></a>
## SA-19 — Enroll and place a student

**Phase:** 1 · **Authority:** student.manage

**Entry:** the Students workspace or its linked record. Prototype: `#/flow/SA-19`.

**Prerequisites:** SA-18, SA-10.

### Step 1 — Enrollment

Choose the student and year.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Academic year (`year`) | select | Yes | 2026–27 |

### Step 2 — Class placement

Dates determine which class roster the pupil belongs to.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| Effective from (`from`) | date | Yes | No prefilled user content |
| Effective until (`to`) | date | Yes | No prefilled user content |
| Roll number (`roll`) | text | No | No prefilled user content |

### Step 3 — Review placement

Check overlapping placements and any frozen attendance sessions.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed roster impact. (`review`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

The enrollment and effective placement are saved.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

One enrollment per student/year and non-overlapping placement intervals; no rewriting frozen rosters.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

A conflicting placement or open session is shown with a recovery link.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Students owns Enrollment and SectionPlacement; authorized academics references and attendance impact query are checked.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-20"></a>
## SA-20 — Review or update a student record

**Phase:** 1 · **Authority:** student.read / student.manage

**Entry:** the Students workspace or its linked record. Prototype: `#/flow/SA-20`.

**Prerequisites:** SA-18.

### Step 1 — Student record

The student detail page groups identity, enrollment and permitted module panels.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Correct display name (`name`) | text | Yes | No prefilled user content |

### Step 2 — Review correction

Identity corrections preserve a change history.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The permitted correction is saved with a reason and revision.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Student 360 panels are separately entitled and authorized; a student view is not authority to edit Fees or Health.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Concurrent edits show a comparison; a restricted panel is omitted rather than partially leaking its data.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

People owns name facts, Students owns school identity/enrollment; compose reads through approved scoped joins.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-21"></a>
## SA-21 — Move a student to another section

**Phase:** 1 · **Authority:** student.manage

**Entry:** the Students workspace or its linked record. Prototype: `#/flow/SA-21`.

**Prerequisites:** SA-19, attendance impact contract.

### Step 1 — New placement

This is a dated move within the same branch.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| Effective from (`effective`) | date | Yes | No prefilled user content |

### Step 2 — Review roster changes

The current placement closes at the new placement boundary.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |
| No frozen or submitted session is being rewritten. (`impact`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

Current and new placement intervals remain contiguous and explainable.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Reject unsupported backdated changes; already frozen/submitted rosters remain unchanged.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Offer a future valid date when historical attendance conflicts; do not delete and recreate enrollment.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Students closes old SectionPlacement and appends new placement atomically after Attendance impact checks.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-22"></a>
## SA-22 — Promote, transfer or leave school

**Phase:** 3 · **Authority:** student.lifecycle.manage

**Entry:** the Students workspace or its linked record. Prototype: `#/flow/SA-22`.

**Prerequisites:** SA-19, destination / obligation contracts.

### Step 1 — Lifecycle action

Keep prior enrollment and attendance history intact.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Action (`action`) | select | Yes | Promote to next year, Transfer to another branch, Record withdrawal |
| Effective date (`effective`) | date | Yes | No prefilled user content |

### Step 2 — Destination and obligations

Destination access and open obligations are reviewed independently.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Destination / receiving school (`destination`) | text | Yes | No prefilled user content |
| Reviewed obligations and handoff (`review`) | textarea | Yes | No prefilled user content |

### Step 3 — Confirm lifecycle change

A cross-branch move creates a destination profile under that branch’s authority.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

A dated lifecycle case records the outcome and preserves source history.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Bulk promotion requires preview and per-student results; financial balances do not transfer by moving a student row.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Partial results, destination rejection, changed capacity and duplicate confirmation require recoverable receipts.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Students owns LifecycleCase and enrollment changes; Finance/Documents/Guardians use explicit follow-up contracts.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
