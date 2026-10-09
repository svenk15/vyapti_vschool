# Messages — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-14 — Read and acknowledge a school notice

- [ ] Reconcile phase 2, the purpose `notice audience grant for this account/child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Read the notice → Acknowledge.
- [ ] Verify invariant: Read, delivered and acknowledged are separate. Editing a notice may require a new acknowledgement; an open page is not consent.
- [ ] Verify recovery: Withdrawn/changed notice or revoked audience cannot be silently acknowledged.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The exact published notice version is acknowledged with a timestamp.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-15 — Reply to a permitted conversation

- [ ] Reconcile phase 2, the purpose `communication.reply_child + conversation grant`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Conversation → Reply.
- [ ] Verify invariant: Recipient identities are server-resolved. No unrestricted teacher address book or co-guardian visibility. Parent cannot add participants.
- [ ] Verify recovery: Access removed before send stops delivery. Failed or unknown send remains distinct from sent; reconcile before retry.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The reply has its real sending/delivery state in the permitted thread.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-16 — Request a teacher meeting

- [ ] Reconcile phase 2, the purpose `meeting.request for permitted teacher/child (proposed)`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Meeting purpose → Preferred time.
- [ ] Verify invariant: Use offered availability only. Do not expose staff private calendars. Store school-local zone and an unambiguous instant after confirmation.
- [ ] Verify recovery: Handle competing reservations, cancellation and removed guardian access.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The request is pending, then confirmed/rescheduled/declined by the school.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. Scope-extension decision is still a prerequisite.

## PAR-17 — Resolve an undelivered message

- [ ] Reconcile phase 2, the purpose `own message read + live conversation grant`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Delivery status → Recovery.
- [ ] Verify invariant: Keep one stable message identity; delivery attempts are separate and grant-checked. Never retry to a removed recipient.
- [ ] Verify recovery: Provider acknowledgement is not human reading. Show a safe failure reason without delivery credentials.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent knows whether a message was accepted, failed or remains unknown.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
