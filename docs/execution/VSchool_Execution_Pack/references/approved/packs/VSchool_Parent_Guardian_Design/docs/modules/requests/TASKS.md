# Requests & forms — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-32 — Submit a school request

- [ ] Reconcile phase 2, the purpose `request.create for permitted child/category`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Request category → Details.
- [ ] Verify invariant: Submission is not approval, a correction or a service booking. Category routing and visibility are school configured.
- [ ] Verify recovery: Save failure keeps input; duplicate intent returns the existing reference; unknown outcome checks the same request.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A reference and Pending review state make the next step clear.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-33 — Track or withdraw a school request

- [ ] Reconcile phase 2, the purpose `own request read/withdraw + live purpose`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Request history → Action.
- [ ] Verify invariant: A co-guardian does not automatically see another guardian’s private request. Use originator plus purpose policy, not household equality.
- [ ] Verify recovery: Concurrent review, completed request or removed authority returns a safe conflict instead of overwriting the decision.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent sees the current owner decision and eligible next actions.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-34 — Request a child-record update

- [ ] Reconcile phase 3, the purpose `record-change request; no direct master-data write`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: What changed? → Request details.
- [ ] Verify invariant: No direct legal-name, custody, enrollment or guardian-grant edits. Account contact and child master data are different workflows.
- [ ] Verify recovery: Reject stale/disallowed edits safely; approved change has its own owner event/version.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A pending change request is linked to the student record, without editing it directly.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-35 — Request a school document

- [ ] Reconcile phase 3, the purpose `document.request for allowed child purpose`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Document type → Purpose.
- [ ] Verify invariant: Request receipt is not an issued certificate. Templates, signatory authority, retention and any fee depend on the document owner.
- [ ] Verify recovery: Expired/revoked links require reauthorization. Keep approval and document-generation failures distinct.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The request progresses to approved/declined/issued, then an authorized download.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-36 — Respond to a permission or consent form

- [ ] Reconcile phase 3, the purpose `consent.respond for verified authorized signer`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Read the request → Your decision.
- [ ] Verify invariant: No preselected consent, bundled unrelated purposes or assumption that every guardian may sign alone. School policy defines required signers and withdrawal effects.
- [ ] Verify recovery: Changed form, deadline passed or signer grant removed requires a safe re-review. Withdrawal is a separate traceable decision when policy allows.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: An explicit decision records signer, child, purpose, document version and time.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
