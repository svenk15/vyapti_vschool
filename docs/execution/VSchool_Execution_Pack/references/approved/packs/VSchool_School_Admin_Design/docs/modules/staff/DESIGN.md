# Staff & access — School Administrator design

Edition 01 · Owner mapping: people, access, academics · UX proposal; human review pending.

Maintain staff records, verified identities and scoped access.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-13"></a>
## SA-13 — Create a staff profile

**Phase:** 1 · **Authority:** people.manage / current repository equivalent

**Entry:** the Staff & access workspace or its linked record. Prototype: `#/flow/SA-13`.

**Prerequisites:** SA-01.

### Step 1 — Staff details

A staff record can exist without a login.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| First name (`first`) | text | Yes | No prefilled user content |
| Last name (`last`) | text | No | No prefilled user content |
| Employee code (`code`) | text | Yes | No prefilled user content |
| Work email (`email`) | email | No | No prefilled user content |

### Step 2 — Employment

Choose a role label and effective employment dates.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Staff category (`type`) | select | Yes | Teaching, Administration, Support |
| Start date (`from`) | date | Yes | No prefilled user content |

### Confirm and outcome

An organization Person and branch Employee profile are linked deliberately.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Email/name matches are not proof of identity or authority to merge people.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Exact identity candidates need an explicit review; duplicate employee codes are rejected.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

People owns Person and Employee with scoped uniqueness and explicit links. No account is automatically created.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-14"></a>
## SA-14 — Grant staff sign-in access

**Phase:** 1 · **Authority:** user.manage

**Entry:** the Staff & access workspace or its linked record. Prototype: `#/flow/SA-14`.

**Prerequisites:** SA-13, existing identity acceptance gates.

### Step 1 — Select staff

Access is a separate operation from creating an employee.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Employee (`employee`) | select | Yes | Ananya Rao · EMP-001, Rohan Das · EMP-002, Meera Iyer · EMP-003 |
| Account email (`email`) | email | Yes | No prefilled user content |

### Step 2 — Verify and scope

A non-sensitive reference records the out-of-band verification.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Identity verification reference (`verification`) | text | Yes | No prefilled user content |
| Branch role (`role`) | select | Yes | Teacher, School administrator |

### Step 3 — Issue access

The trust mode selects the allowed invitation path.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I confirm the verified identity and selected branch role. (`grant`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A pending membership/grant is created and the permitted activation path is shown.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Preserve operator-issued IAM paths; invite email does not prove employee identity. Last-admin safeguards remain.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

A failed delivery is visible to the authorized manager; resend revokes the old token.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Access owns UserAccount, SchoolMembership, RoleGrant and Invite/AccountActivation; People binding is checked through its published contract.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-15"></a>
## SA-15 — Review invitation or resend access

**Phase:** 1 · **Authority:** user.manage

**Entry:** the Staff & access workspace or its linked record. Prototype: `#/flow/SA-15`.

**Prerequisites:** SA-14.

### Step 1 — Review access state

Separate membership state from delivery and activation.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Staff member (`staff`) | select | Yes | Nikhil Menon · Pending activation, Nikhil Menon · Delivery-failure scenario |

### Step 2 — Retry safely

Revoke the previous invitation before issuing a replacement.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The new invitation attempt has an expiry and an honest delivery outcome.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Do not activate on send, silently retry in a worker, expose tokens or reuse a failed token.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Policy tightened, account blocked or expired grant explains why resend is unavailable.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Access token revoke + fresh issue + audit commit before email seam; sanitized delivery failure recorded afterward.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-16"></a>
## SA-16 — Verify a staff identity and teacher eligibility

**Phase:** 1 · **Authority:** user.manage + class.manage

**Entry:** the Staff & access workspace or its linked record. Prototype: `#/flow/SA-16`.

**Prerequisites:** SA-14, explicit IAM-03 acceptance where documented.

### Step 1 — Identity evidence

Record a non-sensitive reference to the school’s verification process.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Employee (`employee`) | select | Yes | Ananya Rao · EMP-001, Rohan Das · EMP-002 |
| Verification reference (`reference`) | text | Yes | No prefilled user content |

### Step 2 — Teacher eligibility

A teaching profile needs an active eligible employee and permitted account binding.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Eligible from (`from`) | date | Yes | No prefilled user content |
| Eligible until (`to`) | date | Yes | No prefilled user content |
| The school has verified this identity outside email activation. (`verified`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

The teacher can be selected for dated assignments when all requirements are met.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No auto-binding by email equality; explicit IAM-03 acceptance gates in the actual repository must be preserved.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Changing eligibility lists affected assignments; a conflicting effective date is blocked.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

People/Access own verified binding; Academics owns Teacher eligibility. Mutations use published contracts, not foreign table writes.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-17"></a>
## SA-17 — Change or revoke staff access

**Phase:** 1 · **Authority:** user.manage

**Entry:** the Staff & access workspace or its linked record. Prototype: `#/flow/SA-17`.

**Prerequisites:** SA-14.

### Step 1 — Select the access change

Only this branch’s grant changes.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Employee (`employee`) | select | Yes | Rohan Das · EMP-002, Meera Iyer · EMP-003 |
| Change (`change`) | select | Yes | Suspend membership, Revoke teacher role, Restore eligible membership |

### Step 2 — Review impact

Assignments, sessions and the last active administrator require review.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |
| I have reviewed affected work and access. (`confirm`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

The next protected request rechecks the changed grant.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Do not disable a global identity for a local branch action; prevent removal of the last active administrator.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Concurrent revocations serialize; insufficient replacement/admin coverage blocks the action.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Access membership/grant transaction and audit; related assignment reads show impact without rewriting history.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
