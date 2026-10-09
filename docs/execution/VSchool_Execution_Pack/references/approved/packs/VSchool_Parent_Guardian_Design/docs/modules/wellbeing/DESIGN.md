# Care & wellbeing — Parent design

Edition 01 · First phase 6 · Owner(s): Health, Student support

Share relevant updates through restricted school channels.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-46 — Submit a care or emergency-contact update

Phase **6**. Reconcile current approved module scope.

Purpose/condition: **restricted care.update_request for authorized guardian**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Update category** — Send sensitive details only through the school’s restricted process.
   - Category: `select`; required; options: Emergency contact needs review, Care information needs updating.
   - Private school verification reference: `text`; required.
2. **Handoff** — A general portal request does not confirm that staff have reviewed urgent information.
   - I will use the school’s official urgent-contact process if immediate action is needed.: `checkbox`; required.

### Outcome

A restricted update request reaches the designated school team.

### Domain and authorization invariant

No clinical/custody narrative in general audit, notification or teacher views. Updating a contact does not grant pickup or portal access.

### Failure and recovery

Unavailable restricted channel provides official contact instructions; never promise emergency monitoring.

### Database workflow / ownership

RestrictedCareRequest pointer and private owner record; safe receipt and narrow recipient ACL.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-47 — Read an authorized school care note

Phase **6**. Reconcile current approved module scope.

Purpose/condition: **explicit care.read_child purpose and document audience**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Shared note** — Only information intentionally released to this signer/account appears.
   - School-shared note reference: `text`; required.
2. **Next step** — Read the school’s instructions within the permitted scope.
   - Next action: `select`; required; options: Acknowledge receipt, Contact the designated school team.

### Outcome

The parent reads a specifically shared note and its requested response.

### Domain and authorization invariant

No automatic access to internal safeguarding cases, third-party reports, private staff notes or another guardian’s restricted data.

### Failure and recovery

Withdrawn sharing, changed version or confidential follow-up uses a safe school handoff.

### Database workflow / ownership

Care owner supplies versioned shared artifact and audience grant, not a broad Student 360 join.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-48 — Request a student-support discussion

Phase **6**. Reconcile current approved module scope.

Purpose/condition: **support.request for permitted child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Request a conversation** — Keep initial details minimal.
   - Topic: `select`; required; options: Learning support discussion, Wellbeing conversation, Contact the school team.
2. **Preferred contact** — A request is not an emergency service.
   - Contact preference: `select`; required; options: Verified email, School-approved call.
   - I will use official urgent assistance channels if needed.: `checkbox`; required.

### Outcome

A restricted contact request is tracked without exposing internal case details.

### Domain and authorization invariant

No automated diagnosis, safety score or medical recommendation. School specialist scope controls assessment and case access.

### Failure and recovery

Missed contact, unavailable service and revoked grant have a private follow-up route.

### Database workflow / ownership

StudentSupportRequest safe metadata → restricted specialist workflow; parent sees only approved status/response.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
