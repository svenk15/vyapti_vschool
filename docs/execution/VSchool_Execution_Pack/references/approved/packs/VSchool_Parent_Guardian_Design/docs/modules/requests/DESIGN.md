# Requests & forms — Parent design

Edition 01 · First phase 2 · Owner(s): Family requests, Documents, Consent

Send a request or consent and track the school’s decision.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-32 — Submit a school request

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **request.create for permitted child/category**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Request category** — Show only school-enabled categories.
   - Category: `select`; required; options: School office query, Attendance query, Access question.
   - Subject: `text`; required.
2. **Details** — Avoid private evidence in a general request.
   - Request details: `textarea`; required.
   - I have kept sensitive evidence out of this general request.: `checkbox`; required.

### Outcome

A reference and Pending review state make the next step clear.

### Domain and authorization invariant

Submission is not approval, a correction or a service booking. Category routing and visibility are school configured.

### Failure and recovery

Save failure keeps input; duplicate intent returns the existing reference; unknown outcome checks the same request.

### Database workflow / ownership

FamilyRequest with actor/child/category/version/status and private owner routing; minimal audit metadata.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-33 — Track or withdraw a school request

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **own request read/withdraw + live purpose**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Request history** — Read only requests this account may see.
   - Request reference: `text`; required.
2. **Action** — Withdrawing a request is not deleting its history.
   - Next action: `select`; required; options: Read status and school response, Withdraw if still pending.

### Outcome

The parent sees the current owner decision and eligible next actions.

### Domain and authorization invariant

A co-guardian does not automatically see another guardian’s private request. Use originator plus purpose policy, not household equality.

### Failure and recovery

Concurrent review, completed request or removed authority returns a safe conflict instead of overwriting the decision.

### Database workflow / ownership

FamilyRequest/version + eligible actor visibility; append a transition and preserve owner response.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-34 — Request a child-record update

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **record-change request; no direct master-data write**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **What changed?** — The school verifies changes to official records.
   - Update category: `select`; required; options: Preferred contact arrangement, Student name correction, Address correction.
2. **Request details** — Identity evidence uses the school’s restricted verification route.
   - Requested change: `textarea`; required.
   - I understand that the school will verify the change.: `checkbox`; required.

### Outcome

A pending change request is linked to the student record, without editing it directly.

### Domain and authorization invariant

No direct legal-name, custody, enrollment or guardian-grant edits. Account contact and child master data are different workflows.

### Failure and recovery

Reject stale/disallowed edits safely; approved change has its own owner event/version.

### Database workflow / ownership

ChangeRequest references Student/Person field category; Students/Guardians owner applies verified changes.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-35 — Request a school document

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **document.request for allowed child purpose**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Document type** — Only school-offered documents appear.
   - Document: `select`; required; options: Enrollment confirmation, Attendance statement, School-issued certificate.
2. **Purpose** — The school verifies eligibility and any approval requirement.
   - Purpose of request: `textarea`; required.

### Outcome

The request progresses to approved/declined/issued, then an authorized download.

### Domain and authorization invariant

Request receipt is not an issued certificate. Templates, signatory authority, retention and any fee depend on the document owner.

### Failure and recovery

Expired/revoked links require reauthorization. Keep approval and document-generation failures distinct.

### Database workflow / ownership

DocumentRequest → approved versioned artifact; explicit child/purpose access at generation and download.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-36 — Respond to a permission or consent form

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **consent.respond for verified authorized signer**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Read the request** — Review the exact purpose, scope, dates and document version.
   - Form: `select`; required; options: Science museum visit · Version 1.
2. **Your decision** — Choices are unselected until a deliberate decision.
   - Decision: `select`; required; options: Consent, Do not consent.
   - I have read this version of the information.: `checkbox`; required.

### Outcome

An explicit decision records signer, child, purpose, document version and time.

### Domain and authorization invariant

No preselected consent, bundled unrelated purposes or assumption that every guardian may sign alone. School policy defines required signers and withdrawal effects.

### Failure and recovery

Changed form, deadline passed or signer grant removed requires a safe re-review. Withdrawal is a separate traceable decision when policy allows.

### Database workflow / ownership

ConsentRequest/version + SignerPolicy + immutable ConsentDecision; one guardian’s response cannot satisfy an unfulfilled second-signature requirement.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
