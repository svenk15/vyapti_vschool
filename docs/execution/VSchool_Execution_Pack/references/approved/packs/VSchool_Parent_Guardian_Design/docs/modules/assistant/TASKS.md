# School assistant — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-52 — Ask the school assistant

- [ ] Reconcile phase 7, the purpose `permission-filtered evidence for selected child/purpose`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Question → Review evidence.
- [ ] Verify invariant: No autonomous payments, consent, messages, medical advice or attendance/result changes. Child content stays isolated; retrieved text cannot override access rules.
- [ ] Verify recovery: Missing/stale/conflicting evidence is disclosed; provide the correct human school contact. Reauthorize sources at retrieval and action.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent receives a source-linked explanation or a clear cannot-answer state.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
