<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For PAR-18, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Calendar & events — Parent design

Edition 01 · First phase 2 · Owner(s): Academics, Events

Plan around published school events and explicit responses.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-18 — Plan with the school calendar

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **published calendar audience for child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Calendar** — See school-local dates and the source school.
   - From date: `date`; required.
   - Category: `select`; required; options: All permitted events, Holidays, Meetings, Class events.
2. **Event detail** — A dated event is not proof of attendance or a transport reservation.
   - Action: `select`; required; options: Read event details, Review permitted calendar export.

### Outcome

The parent can plan using a readable agenda and current published event version.

### Domain and authorization invariant

Calendar export contains only permitted minimal details. No other child or staff-private schedule.

### Failure and recovery

Changed/cancelled events show clear history; stale export does not override the live school record.

### Database workflow / ownership

Published calendar event/version + audience purpose; export generation reauthorizes each event.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-19 — Respond to a school event

Phase **3**. Explicit proposed extension; scope decision required.

Purpose/condition: **event.response for child (proposed)**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Event response** — Review the event and its response deadline.
   - Event reference: `text`; required.
   - Response: `select`; required; options: Attending, Not attending.
2. **Confirm** — RSVP and permission consent are separate.
   - I have checked the selected child and event response.: `checkbox`; required.

### Outcome

An explicit response is recorded for this event version.

### Domain and authorization invariant

RSVP does not grant excursion consent, pickup authority or paid-service enrollment. If a separate consent is needed, show it separately.

### Failure and recovery

Deadline passed, event version changed or capacity changed yields a clear outcome.

### Database workflow / ownership

Proposed EventResponse, event version and owner capacity policy; Consent and Finance remain separate owners.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
