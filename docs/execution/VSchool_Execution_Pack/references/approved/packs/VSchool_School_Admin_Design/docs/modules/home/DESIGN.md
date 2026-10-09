# Today — School Administrator design

Edition 01 · Owner mapping: access, reporting · UX proposal; human review pending.

Resolve school-day exceptions and complete setup.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-01"></a>
## SA-01 — Sign in and choose a branch

**Phase:** 1 · **Authority:** authenticated identity + active branch grant

**Entry:** the Today workspace or its linked record. Prototype: `#/flow/SA-01`.

**Prerequisites:** existing verified Access + Tenancy context.

### Step 1 — School sign-in

Use the school’s published entry. Its branding does not grant access.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Email address (`email`) | email | Yes | No prefilled user content |
| Password (`password`) | password | Yes | No prefilled user content |

### Step 2 — Choose your workspace

Only authorized branches appear. Skip this step when there is only one.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Branch (`branch`) | select | Yes | Whitefield, Indiranagar |

### Confirm and outcome

The administrator lands on Today in the chosen branch.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Recheck institution, branch, membership and module state; return URLs must be allowlisted.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Invalid credentials use a generic message; suspended access shows a support route, never another branch’s data.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

UserAccount → SchoolMembership → RoleGrant → Organization / School. Read only; session issuance is owned by Access.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-02"></a>
## SA-02 — Activate or recover an account

**Phase:** 1 · **Authority:** access activation / recovery policy

**Entry:** the Today workspace or its linked record. Prototype: `#/flow/SA-02`.

**Prerequisites:** existing IAM-02/03/04 contracts.

### Step 1 — Request access help

The available recovery path follows the institution and account-wide trust policy.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Email address (`email`) | email | Yes | No prefilled user content |
| What do you need? (`help`) | select | Yes | Activate invited account, Reset password |

### Step 2 — Next steps

The public response must not reveal account existence or which institution restricts recovery.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I understand that the verified recovery channel must be used. (`ack`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A generic acknowledgement and permitted recovery instructions are shown.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Email resets must satisfy every active institution membership at issue and consume time; operator recovery remains supported.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Expired, revoked, failed-delivery and previously consumed tokens cannot be accepted; resend rotates the token.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Access owns invitation/activation/reset tokens, consumption transaction, audit and delivery outcome. Never put secrets in audit.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-03"></a>
## SA-03 — Switch branch or sign out

**Phase:** 1 · **Authority:** active target-branch grant

**Entry:** the Today workspace or its linked record. Prototype: `#/flow/SA-03`.

**Prerequisites:** SA-01.

### Step 1 — Destination

Your current branch remains active until you confirm.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Destination (`destination`) | select | Yes | Indiranagar, Whitefield, Sign out |

### Step 2 — Leave this workspace

Unsaved changes must be saved or explicitly discarded before continuing.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed any unsaved work. (`leave`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

New context is resolved on the server, or the session is signed out.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Clear scoped caches and protected drafts; reauthorize the destination and never reuse the previous branch’s data.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

If the target grant was revoked, keep the old context if still authorized and show a safe explanation.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Access session/context read; revoke session on sign-out. No business table writes.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-04"></a>
## SA-04 — Complete first-use setup

**Phase:** 1 · **Authority:** school.manage + relevant setup capabilities

**Entry:** the Today workspace or its linked record. Prototype: `#/flow/SA-04`.

**Prerequisites:** SA-01, module readiness contracts.

### Step 1 — Review readiness

Only prerequisites for your enabled modules belong in this checklist.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Next setup area (`next`) | select | Yes | School settings, Academic year and calendar, Classes and subjects, Staff and assignments, Students and enrollment, Attendance sessions |

### Step 2 — Assign the next action

The checklist reflects saved records, not a manually checked completion flag.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Responsible role (`owner`) | select | Yes | School administrator, Institution administrator, Assigned teacher |

### Confirm and outcome

The next incomplete dependency opens in its owning module.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Setup completion is derived from authoritative data; adding Fees later must not invalidate Attendance readiness.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Show blocked dependencies with a route to the responsible role; a hidden module is never a missing step.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Read model joins authorized School configuration, academic readiness, membership, enrollment and session counts.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-05"></a>
## SA-05 — Resolve a daily exception

**Phase:** 1 · **Authority:** capability of the underlying action

**Entry:** the Today workspace or its linked record. Prototype: `#/flow/SA-05`.

**Prerequisites:** SA-26, SA-24, SA-15.

### Step 1 — Choose an issue

Each item links to evidence and the action that resolves it.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Issue (`issue`) | select | Yes | Grade 6 A register not submitted, Roster import needs review, Staff activation pending |

### Step 2 — Review ownership

An exception does not disappear until its underlying record changes.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Next action (`action`) | select | Yes | Open source record, Review blocked dependency |

### Confirm and outcome

The source record opens with its branch and status intact.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Never turn a pending register into an absence; the dashboard is a read model.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

An already resolved or revoked item refreshes safely and explains why it is no longer actionable.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Read AttendanceSession, ImportJob and permitted access status; no separate shadow business state.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
