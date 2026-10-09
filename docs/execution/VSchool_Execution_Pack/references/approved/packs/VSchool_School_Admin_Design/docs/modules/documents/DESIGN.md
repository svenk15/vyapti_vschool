# Documents & forms — School Administrator design

Edition 01 · Owner mapping: documents · UX proposal; human review pending.

Review controlled documents and issue approved records.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-44"></a>
## SA-44 — Collect and review a document

**Phase:** 3 · **Authority:** document.review + owning module capability

**Entry:** the Documents & forms workspace or its linked record. Prototype: `#/flow/SA-44`.

**Prerequisites:** document storage / scan / grant LLD.

### Step 1 — Request context

A document needs a purpose, owner and permitted audience.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Document type (`type`) | select | Yes | Enrollment evidence, Transfer document, Consent form |

### Step 2 — Upload and review

Uploads stay unavailable until their safety checks complete.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Document (`file`) | file | Yes | No prefilled user content |
| Review decision (`decision`) | select | Yes | Pending checks, Accept verified document, Request replacement |

### Confirm and outcome

The document version and review state are visible to authorized users.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No public object URLs; scan failure never becomes a successful upload; expiry and retention follow approved policy.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Interrupted upload resumes or retries safely; expired access links reauthorize.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Documents owns FileAsset, ScanResult, DocumentVersion and grant. Owning module references the immutable approved version.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-45"></a>
## SA-45 — Issue a certificate or publish a form

**Phase:** 3 · **Authority:** document.issue / form.publish

**Entry:** the Documents & forms workspace or its linked record. Prototype: `#/flow/SA-45`.

**Prerequisites:** SA-44, approved template design.

### Step 1 — Template and audience

Use a versioned approved template.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Type (`type`) | select | Yes | Enrollment certificate, Transfer certificate, School form |
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |

### Step 2 — Review generated content

Validate source fields and intended recipient.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the exact document preview. (`review`) | checkbox | Yes | No prefilled user content |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

An issued revision has a reference and controlled download.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Do not overwrite issued documents; corrections issue a new linked version.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Unavailable source data and revoked recipient grants prevent issue/download.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

DocumentTemplateVersion → immutable issue snapshot or FormSchemaVersion/FormResponse, with signed-download authorization.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
