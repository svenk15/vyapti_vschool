# Messages — Parent design

Edition 01 · First phase 2 · Owner(s): Communication, Guardians

Read, acknowledge and reply within permitted school conversations.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-14 — Read and acknowledge a school notice

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **notice audience grant for this account/child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Read the notice** — Show the published version and the child/school audience.
   - Notice: `select`; required; options: Term planning meeting, School calendar update.
2. **Acknowledge** — Acknowledgement requires a deliberate action.
   - I acknowledge this notice.: `checkbox`; required.

### Outcome

The exact published notice version is acknowledged with a timestamp.

### Domain and authorization invariant

Read, delivered and acknowledged are separate. Editing a notice may require a new acknowledgement; an open page is not consent.

### Failure and recovery

Withdrawn/changed notice or revoked audience cannot be silently acknowledged.

### Database workflow / ownership

Notice/version + audience snapshot + explicit AccountAcknowledgement; recheck current grant on attachment access.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-15 — Reply to a permitted conversation

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **communication.reply_child + conversation grant**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Conversation** — Use the school-approved child-specific thread.
   - Conversation: `select`; required; options: Fractions practice · Ananya Rao, School office query.
2. **Reply** — Do not include other pupils or private family restrictions.
   - Your message: `textarea`; required.

### Outcome

The reply has its real sending/delivery state in the permitted thread.

### Domain and authorization invariant

Recipient identities are server-resolved. No unrestricted teacher address book or co-guardian visibility. Parent cannot add participants.

### Failure and recovery

Access removed before send stops delivery. Failed or unknown send remains distinct from sent; reconcile before retry.

### Database workflow / ownership

ConversationGrant → Message → delivery attempt, bound to selected child and live participants.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-16 — Request a teacher meeting

Phase **2**. Explicit proposed extension; scope decision required.

Purpose/condition: **meeting.request for permitted teacher/child (proposed)**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Meeting purpose** — Choose a school-offered channel and participant.
   - Meeting with: `select`; required; options: Assigned class teacher, School office.
   - Brief topic: `textarea`; required.
2. **Preferred time** — A request is not a confirmed calendar booking.
   - Preferred date: `date`; required.
   - Preferred slot: `select`; required; options: 15:30–15:45, 15:45–16:00.

### Outcome

The request is pending, then confirmed/rescheduled/declined by the school.

### Domain and authorization invariant

Use offered availability only. Do not expose staff private calendars. Store school-local zone and an unambiguous instant after confirmation.

### Failure and recovery

Handle competing reservations, cancellation and removed guardian access.

### Database workflow / ownership

Proposed MeetingRequest/SlotReservation; Communication owns participant notifications. Requires scheduling LLD.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-17 — Resolve an undelivered message

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **own message read + live conversation grant**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Delivery status** — A failed delivery does not become a sent message.
   - Message reference: `text`; required.
2. **Recovery** — Recheck status before repeating an uncertain request.
   - Action: `select`; required; options: Check current status, Retry a confirmed failed delivery, Contact the school through an approved channel.

### Outcome

The parent knows whether a message was accepted, failed or remains unknown.

### Domain and authorization invariant

Keep one stable message identity; delivery attempts are separate and grant-checked. Never retry to a removed recipient.

### Failure and recovery

Provider acknowledgement is not human reading. Show a safe failure reason without delivery credentials.

### Database workflow / ownership

Message intent → DeliveryAttempt status, idempotent retry policy and current ConversationGrant.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
