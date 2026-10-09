# Attendance — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-10 — Read my child’s attendance

- [ ] Reconcile phase 2, the purpose `attendance.read_child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Attendance period → Inspect a session.
- [ ] Verify invariant: Show session granularity and exclude unsubmitted/cancelled sessions from any policy-defined attendance denominator. Do not invent a daily status or percentage.
- [ ] Verify recovery: Pending data and revised records display honestly. Parent cannot edit marks.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent understands the exact session status and source of the recorded outcome.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-11 — Submit an absence explanation

- [ ] Reconcile phase 2, the purpose `attendance.explanation.submit for selected child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Absence details → School note.
- [ ] Verify invariant: Same-day date ranges are valid. Live grant and date/policy bounds apply at submit; duplicate intent is idempotent. No automatic Excused status.
- [ ] Verify recovery: Failed save preserves draft. Lost response checks the same request reference. Sensitive documents need the separately approved upload route.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The explanation receives a reference and Pending review status; attendance remains unchanged.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-12 — Track or withdraw an explanation

- [ ] Reconcile phase 2, the purpose `own explanation read/withdraw with current child grant`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Request status → Next action.
- [ ] Verify invariant: Only an eligible pending request can be withdrawn; use its current version. Never delete the evidence of a reviewed decision.
- [ ] Verify recovery: Concurrent school review wins by version; show the new state and safe next action.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent sees a traceable request status or withdrawal outcome.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-13 — Query an attendance discrepancy

- [ ] Reconcile phase 2, the purpose `attendance.read_child + permitted school request`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Exact session → Explain the concern.
- [ ] Verify invariant: No parent attendance.correct grant. A query is not an approved correction or evidence that the teacher was wrong.
- [ ] Verify recovery: If the record changed, show the permitted new revision and retain the original query reference.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent receives a query reference; the submitted register remains unchanged.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
