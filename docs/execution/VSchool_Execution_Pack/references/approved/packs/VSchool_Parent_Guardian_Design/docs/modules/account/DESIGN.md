# My account — Parent design

Edition 01 · First phase 2 · Owner(s): Access, Privacy

Manage your own contact, access and privacy requests.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-49 — Update my verified contact details

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **account self-update with step-up verification**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **New contact** — Change your own account contact, not the child’s guardian relationship.
   - New email address: `email`; required.
2. **Verification** — Private delivery must not move to an unverified destination.
   - I will complete the school-approved verification and recovery checks.: `checkbox`; required.

### Outcome

A pending contact change becomes effective only after the required verification.

### Domain and authorization invariant

Do not overwrite identity binding or relationship evidence from a contact edit. Existing compromise controls and account-wide recovery policy remain active.

### Failure and recovery

Failed verification/expired token preserves the current verified contact; suspicious change uses the verified support route.

### Database workflow / ownership

Access PendingContactChange/token hash and verified contact; Communication uses only approved effective channels.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-50 — Review sessions and sign out

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **own session management**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **My account** — Review safe account and current session information.
   - View: `select`; required; options: Account details, Current session, Other sessions if supported.
2. **End access** — Keep Sign out separate from identity details.
   - Action: `select`; required; options: Sign out of this session, Use verified account recovery.

### Outcome

The parent can end the current session and understand permitted security actions.

### Domain and authorization invariant

Other-session revocation is an extension unless already supported. Clear protected child view state; browser back must not reveal private data after real sign-out.

### Failure and recovery

Unsent drafts require a clear decision. Persisted pending requests/payments retain their owner references without exposing them signed out.

### Database workflow / ownership

Access session revoke + authenticated cache invalidation; no token material in the UI.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-51 — Request access, correction or privacy support

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **own privacy request; school verification required**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Privacy request** — The school determines permitted records and identity verification.
   - Request type: `select`; required; options: Ask about my data, Request a correction, Request access or deletion review.
2. **Scope** — Use safe references, not private evidence attachments.
   - Brief request: `textarea`; required.

### Outcome

A privacy request is acknowledged and routed for verified review.

### Domain and authorization invariant

Do not promise a legal deadline, automatic deletion of school records or another guardian’s data. Retention and child rights require jurisdiction-specific design.

### Failure and recovery

Identity not established, shared record restrictions or retained obligations produce a reasoned owner response.

### Database workflow / ownership

PrivacyRequest actor/scope/reference; audited owner review across modules with governed exports, no arbitrary SQL download.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
