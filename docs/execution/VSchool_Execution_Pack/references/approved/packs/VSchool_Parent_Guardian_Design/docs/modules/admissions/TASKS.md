# Applications — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-37 — Start or resume an application

- [ ] Reconcile phase 3, the purpose `applicant self-scope; separate from enrolled child grant`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Application → Save or submit.
- [ ] Verify invariant: An applicant is not matched to an existing pupil by email/DOB alone. Keep evidence, fee and relationship verification separate.
- [ ] Verify recovery: Duplicate claims, withdrawal, document failure and intake closure do not create student records automatically.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: An applicant-scoped draft or submitted application has a reference.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-38 — Track application requirements

- [ ] Reconcile phase 3, the purpose `own application read + allowed evidence upload`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Application checklist → Respond.
- [ ] Verify invariant: Evidence is not a public attachment or ordinary message. File size/type/scan policy and review access must be defined before implementation.
- [ ] Verify recovery: Rejected evidence has a safe reason and resubmission path; do not erase previously reviewed versions.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The applicant understands what remains outstanding and the school’s next decision.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-39 — Respond to an admission offer

- [ ] Reconcile phase 3, the purpose `intended offer recipient + current version`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Offer → Decision.
- [ ] Verify invariant: Offer acceptance cannot independently create a verified guardian relationship, settle a fee or assign a class.
- [ ] Verify recovery: Expired/superseded offer, pending payment or missing evidence leads to a precise incomplete state.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The response is recorded and remaining enrollment steps are visible.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
