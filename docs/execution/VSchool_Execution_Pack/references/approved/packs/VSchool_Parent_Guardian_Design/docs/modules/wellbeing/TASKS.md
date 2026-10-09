# Care & wellbeing — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-46 — Submit a care or emergency-contact update

- [ ] Reconcile phase 6, the purpose `restricted care.update_request for authorized guardian`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Update category → Handoff.
- [ ] Verify invariant: No clinical/custody narrative in general audit, notification or teacher views. Updating a contact does not grant pickup or portal access.
- [ ] Verify recovery: Unavailable restricted channel provides official contact instructions; never promise emergency monitoring.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A restricted update request reaches the designated school team.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-47 — Read an authorized school care note

- [ ] Reconcile phase 6, the purpose `explicit care.read_child purpose and document audience`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Shared note → Next step.
- [ ] Verify invariant: No automatic access to internal safeguarding cases, third-party reports, private staff notes or another guardian’s restricted data.
- [ ] Verify recovery: Withdrawn sharing, changed version or confidential follow-up uses a safe school handoff.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent reads a specifically shared note and its requested response.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-48 — Request a student-support discussion

- [ ] Reconcile phase 6, the purpose `support.request for permitted child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Request a conversation → Preferred contact.
- [ ] Verify invariant: No automated diagnosis, safety score or medical recommendation. School specialist scope controls assessment and case access.
- [ ] Verify recovery: Missed contact, unavailable service and revoked grant have a private follow-up route.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A restricted contact request is tracked without exposing internal case details.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
