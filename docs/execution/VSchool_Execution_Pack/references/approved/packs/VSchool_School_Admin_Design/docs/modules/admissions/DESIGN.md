# Admissions — School Administrator design

Edition 01 · Owner mapping: admissions, students · UX proposal; human review pending.

Move an application from inquiry to an enrolled student.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-38"></a>
## SA-38 — Capture inquiry and start an application

**Phase:** 3 · **Authority:** admissions.manage

**Entry:** the Admissions workspace or its linked record. Prototype: `#/flow/SA-38`.

**Prerequisites:** admission cycle and application LLD.

### Step 1 — Applicant

An applicant is distinct from an enrolled student.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Applicant name (`name`) | text | Yes | No prefilled user content |
| Applying for (`grade`) | select | Yes | Grade 6, Grade 7 |
| Applicant contact email (`contact`) | email | Yes | No prefilled user content |

### Step 2 — Cycle and checklist

Choose the relevant intake and required evidence.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Admission cycle (`cycle`) | select | Yes | 2027–28 |
| The approved collection notice has been provided. (`notice`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

An application has a reference, checklist and next action.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Admission must work without Fees; collect only information needed for the current stage.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Duplicate candidate suggests deliberate review; do not auto-merge applicants or existing pupils.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Admissions owns Applicant, Application, Cycle and checklist; no Student row until accepted conversion.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-39"></a>
## SA-39 — Review application and make a decision

**Phase:** 3 · **Authority:** admissions.review / decision delegation

**Entry:** the Admissions workspace or its linked record. Prototype: `#/flow/SA-39`.

**Prerequisites:** SA-38, capacity / decision authority.

### Step 1 — Review evidence

Review only the documents within your assigned role.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Application (`application`) | select | Yes | APP-2712 · Nisha Patel |
| Review stage (`review`) | select | Yes | Checklist review, Interview, Decision review |

### Step 2 — Decision

Separate reviewer recommendation from authorized decision.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Decision (`decision`) | select | Yes | Recommend offer, Waitlist, Decline, Request information |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The decision revision and next action are recorded.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Seat reservation and offer expiry must be atomic; subjective notes remain restricted.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Last-seat conflicts and expired decision authority require refreshed capacity and delegation.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Admissions decision revision, capacity/offer reservation and audit; document download reauthorizes.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-40"></a>
## SA-40 — Accept an offer and enroll once

**Phase:** 3 · **Authority:** admissions.convert + student.manage

**Entry:** the Admissions workspace or its linked record. Prototype: `#/flow/SA-40`.

**Prerequisites:** SA-39, SA-19.

### Step 1 — Accepted offer

Conversion follows verified acceptance and required evidence.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Application (`application`) | select | Yes | APP-2712 · Accepted |
| Enrollment start (`start`) | date | Yes | No prefilled user content |

### Step 2 — Student handoff

Preview the new student, placement and guardian verification work.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Admission number (`admission`) | text | Yes | No prefilled user content |
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| I have reviewed identity and enrollment details. (`convert`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

One student conversion receipt links the application to enrollment.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

A repeated request returns the same conversion; do not create duplicate students or automatic guardian grants.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Invalid capacity, changed acceptance or incomplete identity evidence pauses conversion safely.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Admissions conversion intent and Students owner transaction produce durable linkage; optional Finance/Documents handoffs are explicit.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
