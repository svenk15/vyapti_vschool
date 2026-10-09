# School settings — School Administrator design

Edition 01 · Owner mapping: access, branding, tenancy · UX proposal; human review pending.

Maintain the branch identity and permitted preferences.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-06"></a>
## SA-06 — Edit branch information

**Phase:** 1 · **Authority:** school.manage

**Entry:** the School settings workspace or its linked record. Prototype: `#/flow/SA-06`.

**Prerequisites:** SA-01.

### Step 1 — School information

Maintain operational contact details for this branch.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Branch display name (`name`) | text | Yes | Greenwood · Whitefield |
| School office email (`email`) | email | Yes | office@greenwood.example |
| School office phone (`phone`) | tel | No | No prefilled user content |
| Address (`address`) | textarea | Yes | Whitefield, Bengaluru |

### Step 2 — Review changes

The institution identity, branch code and existing time zone are controlled separately.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

Permitted details are saved with a revision and activity entry.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Time zone Asia/Kolkata is read-only after branch creation. Reject a forged change server-side.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

A stale edit shows the latest saved values and a comparison; never overwrite automatically.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Access owns School changes; Branding/contact read models read the saved revision. Compare expected version under the guard.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-07"></a>
## SA-07 — Review branding and school sign-in

**Phase:** 1 · **Authority:** branding.read; branding.write requires explicit delegation

**Entry:** the School settings workspace or its linked record. Prototype: `#/flow/SA-07`.

**Prerequisites:** SA-01, explicit branding delegation.

### Step 1 — Preview school identity

Use constrained tokens so accessibility and layout remain consistent.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Palette (`palette`) | select | Yes | Forest, Indigo, Clay |
| School display name (`display`) | text | Yes | Greenwood Schools |
| Welcome message (`welcome`) | text | Yes | A clear start to every school day. |

### Step 2 — Review before publication

Preview desktop and mobile. Publication requires the institution’s branding permission.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the school name, sign-in URL and palette. (`review`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A delegated publisher can publish; other school administrators can request a branding update.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Branding never changes authorization, status semantics, layout or external redirect destinations.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Reject unsafe assets, unreadable colors and an already claimed public slug; keep the published revision unchanged.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

BrandProfile / revision owned by Branding, linked to Organization and authorized School. Public projection contains no private settings.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-08"></a>
## SA-08 — Review modules and request a capability

**Phase:** 1 · **Authority:** module status read; commercial changes are institution/operator authority

**Entry:** the School settings workspace or its linked record. Prototype: `#/flow/SA-08`.

**Prerequisites:** SA-01, TEN entitlement contracts.

### Step 1 — Choose a module

See enabled modules and dependencies without exposing unlicensed operational screens.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Capability (`module`) | select | Yes | Attendance, Family portal, Fees & payments, Transport |

### Step 2 — Request a change

Commercial and branch activation approvals stay with the authorized owner.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| What does your school need? (`need`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The administrator gets a clear handoff to the institution contact.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Licensed, released, branch-enabled and authorized are four separate checks. No self-service license escalation.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Disabling a module retains data and must respect open obligations; request submission alone changes nothing.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Tenancy read model for entitlement and branch activation. Proposed change request only if an approved request contract exists; otherwise display contact instructions.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-62"></a>
## SA-62 — Review activity, privacy or support access

**Phase:** 1 · **Authority:** school.audit.read; privacy/support actions need separate authority

**Entry:** the School settings workspace or its linked record. Prototype: `#/flow/SA-62`.

**Prerequisites:** existing append-only safe audit.

### Step 1 — Find activity

Show only safe events in this branch.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Category (`category`) | select | Yes | School settings, Staff access, Student change, Attendance correction |
| From date (`from`) | date | Yes | No prefilled user content |
| To date (`to`) | date | Yes | No prefilled user content |

### Step 2 — Inspect evidence

Use a request reference for support; do not expose credentials or raw imported data.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Action (`action`) | select | Yes | View safe event detail, Copy support reference |

### Confirm and outcome

A safe branch-scoped event is available for review.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

The administrator cannot delete audit history, grant operator impersonation or run an unrestricted data export.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Restricted events show permitted metadata only; unsupported privacy requests route to the designated authority.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Append-only audit read model scoped by branch and capability; safe diff and request IDs only.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
