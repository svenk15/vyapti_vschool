# Family access — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-01 — Accept a school invitation

- [ ] Reconcile phase 2, the purpose `school-verified relationship + account binding`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: School invitation → Review permitted access.
- [ ] Verify invariant: Email possession alone cannot prove a guardian relationship. Bind a single-use invitation to the verified relationship and intended account; never let the parent choose a child or expand grants.
- [ ] Verify recovery: Expired, wrong-account, revoked and delivery-failed invitations show safe help. Replaying a completed acceptance returns the existing outcome.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The verified child link becomes active for this account, with its exact permitted purposes.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-02 — Sign in through the school page

- [ ] Reconcile phase 2, the purpose `active account; child-purpose authorization after sign-in`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Sign in → Choose a workspace.
- [ ] Verify invariant: No admission-number plus birth-date public child lookup. Account identity and relationship authority remain separate. Safe internal return URLs only.
- [ ] Verify recovery: Use generic credential rejection. Empty links lead to school contact; suspended access does not reveal child names.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent enters an authorized family workspace and sees the current child context.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-03 — Activate or recover account access

- [ ] Reconcile phase 2, the purpose `institution trust mode + account-wide recovery policy`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Account help → Next step.
- [ ] Verify invariant: Global account recovery must not bypass a stricter institution. Recheck policy when issuing and consuming a token. Compromised-inbox recovery uses the verified owner route.
- [ ] Verify recovery: Expired/revoked/consumed/failed-delivery tokens fail safely. Do not send a second identity’s invitation to a newly entered mailbox.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent receives a safe acknowledgement or verified support route.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-04 — Review my verified child links

- [ ] Reconcile phase 2, the purpose `relationship self-read with purpose-filtered child summary`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: My children → Access question.
- [ ] Verify invariant: No unrestricted household or co-guardian directory. Do not reveal private reasons for restrictions or compare children.
- [ ] Verify recovery: Revoked/ended links disappear from protected lists; old deep links fail without leaking details.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent understands the children and purposes they can access.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-05 — Ask about a missing child link

- [ ] Reconcile phase 2, the purpose `authenticated support request; no child-record access`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Contact the school → Review request.
- [ ] Verify invariant: Do not confirm whether a named child exists. Only a designated school verifier can establish the relationship and purpose grants.
- [ ] Verify recovery: Duplicate request shows prior reference. Missing proof uses a private school channel; an ordinary request is not evidence.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A support request is pending verification; no child access is added automatically.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-06 — Handle changed or withdrawn access

- [ ] Reconcile phase 2, the purpose `live relationship and purpose check`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Access changed → Leave safely.
- [ ] Verify invariant: Recheck on reads, writes, downloads and delivery. Child-switch caches, search results and back navigation must not retain revoked data.
- [ ] Verify recovery: Never expose the private restriction reason, another guardian’s details or a previously authorized attachment.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: Protected child data is cleared and the parent receives a safe next step.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
