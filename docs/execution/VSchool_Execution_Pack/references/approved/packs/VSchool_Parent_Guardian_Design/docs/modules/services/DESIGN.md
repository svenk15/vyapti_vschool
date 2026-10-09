# School services — Parent design

Edition 01 · First phase 6 · Owner(s): Transport, Library, Activities

Use enabled transport, pickup, library and activity services.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-40 — Review transport assignment

Phase **6**. Reconcile current approved module scope.

Purpose/condition: **transport.read_child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Route assignment** — Only the child’s active route and stop are visible.
   - View: `select`; required; options: Assigned route and stop, Service dates and school contact.
2. **Service question** — A request does not change the transport route.
   - Next action: `select`; required; options: Read current assignment, Request a stop or service change.

### Outcome

The parent knows the currently assigned route and how to request a change.

### Domain and authorization invariant

No full passenger list, unrelated stops, driver private contact or other child location.

### Failure and recovery

Unassigned/suspended service, route change and service disruption are distinct.

### Database workflow / ownership

TransportAssignment/effective dates → Route/Stop minimal projection; transport owner decides capacity and change.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-41 — Request an authorized pickup change

Phase **6**. Explicit proposed extension; scope decision required.

Purpose/condition: **pickup.request + child-specific authority (proposed)**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Pickup request** — The school verifies temporary collection authority.
   - Pickup date: `date`; required.
   - Proposed collector name: `text`; required.
   - School-approved verification reference: `text`; required.
2. **Confirm request** — This is not an immediate gate pass.
   - I understand that school verification and approval are required.: `checkbox`; required.

### Outcome

A pending pickup request has a dated approval/decline outcome.

### Domain and authorization invariant

No reusable public QR credential or unverified household delegation. Emergency contacts are not automatically authorized collectors.

### Failure and recovery

Cutoff, revocation, conflicting requests and identity failure require school resolution; follow local emergency procedures.

### Database workflow / ownership

Proposed PickupRequest/dated authorization with restricted evidence; operational handover logs actual authorized collection.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-42 — Read transport service updates

Phase **6**. Reconcile current approved module scope.

Purpose/condition: **transport update audience for assigned child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Service update** — Read only the assigned service and current freshness.
   - View: `select`; required; options: School-issued delay notice, Authorized boarding status.
2. **Next action** — Unknown or stale status is not a safety guarantee.
   - Next action: `select`; required; options: Refresh status, Use the school’s official transport contact.

### Outcome

The parent sees a time-stamped, source-labelled service update.

### Domain and authorization invariant

Live vehicle location is a separate approved capability, not assumed here. No precise other-child location or full vehicle movement history.

### Failure and recovery

Provider outage, stale event or missing boarding confirmation shows Unknown with a school contact.

### Database workflow / ownership

Transport event/audience read model with event time, received time and retention/freshness contract.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-43 — Review child library loans

Phase **6**. Reconcile current approved module scope.

Purpose/condition: **library.read_child; renewal request if granted**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Loans** — View only this child’s lending records.
   - View: `select`; required; options: Current loans, Due dates and return status.
2. **Next action** — Renewal depends on library policy and availability.
   - Action: `select`; required; options: Request renewal, Ask about a return discrepancy.

### Outcome

The parent sees loan status and the owner’s renewal/query outcome.

### Domain and authorization invariant

Do not infer permission to pay or adjust a fine from loan visibility. No other borrower history.

### Failure and recovery

Concurrent return/hold/renewal limit is a clear conflict, not a silently extended date.

### Database workflow / ownership

LibraryLoan/version → copy/title plus own RenewalRequest; Finance handles authorized charges separately.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-44 — Request an extracurricular place

Phase **6**. Explicit proposed extension; scope decision required.

Purpose/condition: **activity.enroll_request for child (proposed)**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Activity** — Review eligibility, schedule and any fee separately.
   - Activity: `select`; required; options: School science club, School music group.
2. **Request place** — A request can be waitlisted; consent/payment are separate.
   - I have checked the child’s schedule and activity requirements.: `checkbox`; required.

### Outcome

The request becomes pending, waitlisted, confirmed or declined.

### Domain and authorization invariant

No overbooking under concurrent requests. A guardian request does not itself satisfy consent or settle a charge.

### Failure and recovery

Capacity changed, withdrawal, schedule conflict and expired offer have owner-controlled outcomes.

### Database workflow / ownership

Proposed ActivityOffering/CapacityReservation/ParticipationRequest; Consent and Finance stay independent.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-45 — Manage an enabled meal preference

Phase **6**. Explicit proposed extension; scope decision required.

Purpose/condition: **meal.preference for child (proposed)**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Meal service** — This optional service appears only when offered by the school.
   - School-offered choice: `select`; required; options: Standard school meal, School-approved alternative.
2. **Confirm** — Health-related restrictions use the verified care workflow.
   - I understand that this preference does not update medical records.: `checkbox`; required.

### Outcome

A dated service preference is submitted under the school’s cutoff policy.

### Domain and authorization invariant

This is a scope extension, not a current Bible guarantee. No diagnosis, allergen safety promise or automatic billing adjustment from a preference.

### Failure and recovery

Cutoff passed, service unavailable or required care verification shows a safe next step.

### Database workflow / ownership

Proposed MealPreference/version/effective date; Health and Finance own their separate approved effects.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
