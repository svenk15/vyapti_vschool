# Learning — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-20 — Review published homework

- [ ] Reconcile phase 3, the purpose `learning.read_child`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Assignment → Support the child.
- [ ] Verify invariant: No submit-as-child or mark-as-complete shortcut unless a separately approved assisted-submission policy exists. Draft tasks are private.
- [ ] Verify recovery: Missing and late are distinct; no submission is not proof of non-learning. Reauthorize attachments.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The guardian understands the task, deadline and current learner submission state.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-21 — Read returned learning feedback

- [ ] Reconcile phase 3, the purpose `feedback.read_child purpose + returned version`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Returned feedback → Support next steps.
- [ ] Verify invariant: Private draft feedback, moderation notes and unrelated student work never appear.
- [ ] Verify recovery: Withdrawn/replaced feedback identifies the permitted current version; authorization applies to historical versions too.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent sees the returned revision and can support its next step.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-22 — Ask a learning question

- [ ] Reconcile phase 3, the purpose `learning read + approved communication grant`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Learning context → Question.
- [ ] Verify invariant: No unrestricted new recipient selection or implicit result-appeal workflow.
- [ ] Verify recovery: If the teacher’s assignment changes, the school resolves routing without exposing another private thread.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The question is routed to a permitted conversation with the child context attached.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
