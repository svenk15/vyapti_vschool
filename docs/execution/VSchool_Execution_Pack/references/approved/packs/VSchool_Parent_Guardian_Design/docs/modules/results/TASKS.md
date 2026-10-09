# Results — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-23 — Read published results

- [ ] Reconcile phase 4, the purpose `results.read_child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Published report → Understand outcomes.
- [ ] Verify invariant: Unentered, Absent and Exempt do not become zero. Draft marks/moderation are excluded. No sibling/class ranking by default.
- [ ] Verify recovery: Withheld, unpublished, superseded and unavailable have different user messages without leaking private reasons.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent understands the official published result version.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-24 — Download an authorized report

- [ ] Reconcile phase 4, the purpose `results.download_child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Report version → Download.
- [ ] Verify invariant: Authorize every download; use short-lived delivery links. URLs are not permanent authorization. No other child in filenames or shared caches.
- [ ] Verify recovery: Revoked access or superseded report requires a fresh authorized request.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A permitted report download is issued and its version is clear.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-25 — Request a result clarification

- [ ] Reconcile phase 4, the purpose `published results read + permitted query`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Result context → Question.
- [ ] Verify invariant: No direct parent grade edits, guaranteed revaluation or automatic publication of revised results.
- [ ] Verify recovery: Closed review window, duplicate query and a superseded result produce clear next steps.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A tracked clarification reaches the authorized school reviewer.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
