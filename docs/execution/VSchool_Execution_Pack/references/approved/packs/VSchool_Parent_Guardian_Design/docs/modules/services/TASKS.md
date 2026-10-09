# School services — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-40 — Review transport assignment

- [ ] Reconcile phase 6, the purpose `transport.read_child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Route assignment → Service question.
- [ ] Verify invariant: No full passenger list, unrelated stops, driver private contact or other child location.
- [ ] Verify recovery: Unassigned/suspended service, route change and service disruption are distinct.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent knows the currently assigned route and how to request a change.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-41 — Request an authorized pickup change

- [ ] Reconcile phase 6, the purpose `pickup.request + child-specific authority (proposed)`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Pickup request → Confirm request.
- [ ] Verify invariant: No reusable public QR credential or unverified household delegation. Emergency contacts are not automatically authorized collectors.
- [ ] Verify recovery: Cutoff, revocation, conflicting requests and identity failure require school resolution; follow local emergency procedures.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A pending pickup request has a dated approval/decline outcome.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. Scope-extension decision is still a prerequisite.

## PAR-42 — Read transport service updates

- [ ] Reconcile phase 6, the purpose `transport update audience for assigned child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Service update → Next action.
- [ ] Verify invariant: Live vehicle location is a separate approved capability, not assumed here. No precise other-child location or full vehicle movement history.
- [ ] Verify recovery: Provider outage, stale event or missing boarding confirmation shows Unknown with a school contact.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent sees a time-stamped, source-labelled service update.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-43 — Review child library loans

- [ ] Reconcile phase 6, the purpose `library.read_child; renewal request if granted`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Loans → Next action.
- [ ] Verify invariant: Do not infer permission to pay or adjust a fine from loan visibility. No other borrower history.
- [ ] Verify recovery: Concurrent return/hold/renewal limit is a clear conflict, not a silently extended date.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent sees loan status and the owner’s renewal/query outcome.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-44 — Request an extracurricular place

- [ ] Reconcile phase 6, the purpose `activity.enroll_request for child (proposed)`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Activity → Request place.
- [ ] Verify invariant: No overbooking under concurrent requests. A guardian request does not itself satisfy consent or settle a charge.
- [ ] Verify recovery: Capacity changed, withdrawal, schedule conflict and expired offer have owner-controlled outcomes.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The request becomes pending, waitlisted, confirmed or declined.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. Scope-extension decision is still a prerequisite.

## PAR-45 — Manage an enabled meal preference

- [ ] Reconcile phase 6, the purpose `meal.preference for child (proposed)`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Meal service → Confirm.
- [ ] Verify invariant: This is a scope extension, not a current Bible guarantee. No diagnosis, allergen safety promise or automatic billing adjustment from a preference.
- [ ] Verify recovery: Cutoff passed, service unavailable or required care verification shows a safe next step.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A dated service preference is submitted under the school’s cutoff policy.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. Scope-extension decision is still a prerequisite.
