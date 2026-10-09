<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For PAR-18, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Calendar & events — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-18 — Plan with the school calendar

- [ ] Reconcile phase 2, the purpose `published calendar audience for child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Calendar → Event detail.
- [ ] Verify invariant: Calendar export contains only permitted minimal details. No other child or staff-private schedule.
- [ ] Verify recovery: Changed/cancelled events show clear history; stale export does not override the live school record.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent can plan using a readable agenda and current published event version.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-19 — Respond to a school event

- [ ] Reconcile phase 3, the purpose `event.response for child (proposed)`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Event response → Confirm.
- [ ] Verify invariant: RSVP does not grant excursion consent, pickup authority or paid-service enrollment. If a separate consent is needed, show it separately.
- [ ] Verify recovery: Deadline passed, event version changed or capacity changed yields a clear outcome.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: An explicit response is recorded for this event version.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. Scope-extension decision is still a prerequisite.
