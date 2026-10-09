# My account — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-49 — Update my verified contact details

- [ ] Reconcile phase 2, the purpose `account self-update with step-up verification`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: New contact → Verification.
- [ ] Verify invariant: Do not overwrite identity binding or relationship evidence from a contact edit. Existing compromise controls and account-wide recovery policy remain active.
- [ ] Verify recovery: Failed verification/expired token preserves the current verified contact; suspicious change uses the verified support route.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A pending contact change becomes effective only after the required verification.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-50 — Review sessions and sign out

- [ ] Reconcile phase 2, the purpose `own session management`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: My account → End access.
- [ ] Verify invariant: Other-session revocation is an extension unless already supported. Clear protected child view state; browser back must not reveal private data after real sign-out.
- [ ] Verify recovery: Unsent drafts require a clear decision. Persisted pending requests/payments retain their owner references without exposing them signed out.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent can end the current session and understand permitted security actions.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-51 — Request access, correction or privacy support

- [ ] Reconcile phase 2, the purpose `own privacy request; school verification required`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Privacy request → Scope.
- [ ] Verify invariant: Do not promise a legal deadline, automatic deletion of school records or another guardian’s data. Retention and child rights require jurisdiction-specific design.
- [ ] Verify recovery: Identity not established, shared record restrictions or retained obligations produce a reasoned owner response.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A privacy request is acknowledged and routed for verified review.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
