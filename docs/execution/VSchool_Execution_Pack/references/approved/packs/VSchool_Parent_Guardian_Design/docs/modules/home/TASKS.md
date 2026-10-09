# Home & my children — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-07 — Review my family overview

- [ ] Reconcile phase 2, the purpose `current minimal summary for each active relationship`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Family overview → Next action.
- [ ] Verify invariant: No combined attendance percentage, combined cross-school payment basket or hidden child counts. Avoid labeling a child as at risk from incomplete data.
- [ ] Verify recovery: Partial module failure identifies the unavailable source and last-updated time without inventing a zero.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent reaches a relevant action without a school-wide dashboard or sibling comparisons.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-08 — Switch child and school context

- [ ] Reconcile phase 2, the purpose `active destination relationship and specific purposes`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Select a child → Review unsaved work.
- [ ] Verify invariant: No independent branch switch that leaves the previous child selected. Cancel or confirm dirty input; clear prior child view state. Persisted pending payments stay tied to their original invoice.
- [ ] Verify recovery: If a destination grant changes, leave the parent in a safe permitted context. Never carry messages, attachments or request drafts across children.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The entire workspace switches to the selected child and re-evaluates modules and permissions.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-09 — Manage school notification preferences

- [ ] Reconcile phase 2, the purpose `self preferences by child/purpose`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Choose updates → Choose channel.
- [ ] Verify invariant: An opt-in is not a guardian grant; an opt-out cannot erase an outstanding request or legal/service notice. No sensitive content in push previews.
- [ ] Verify recovery: Unverified contact details cannot receive private updates. Record a delivery failure without marking a notice read.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: Preferences are saved for the selected permitted category and verified channel.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
