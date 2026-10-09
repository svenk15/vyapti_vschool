# Fees & payments — Proposed tasks

Each PAR reference is a demoable implementation slice or a mapped part of an existing owner task. Current repository gates and dependencies take precedence over this proposal. Scope/physical LLD must precede implementation.

## PAR-26 — Review a child’s fee invoice

- [ ] Reconcile phase 5, the purpose `finance.read for explicit child/payer scope`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Invoice → Breakdown.
- [ ] Verify invariant: Guardian status alone does not grant fee or payer access. No cross-school combined basket. Never expose another payer’s private banking details.
- [ ] Verify recovery: Disputed/adjusted invoice, stale balance or disabled online payment remains reviewable only under current grant.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The payer understands the exact payable balance for one issuing institution.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-27 — Pay an authorized invoice

- [ ] Reconcile phase 5, the purpose `finance.pay + explicit payer mandate`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Payment review → Payment handoff.
- [ ] Verify invariant: Server computes amount and issuer from the current invoice. Stable idempotency key, invoice version and payable-state guard prevent duplicate orders. Never collect card details in this portal.
- [ ] Verify recovery: Changed balance requires re-review. Interrupted redirect or pending provider outcome uses Check status before any new payment.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: One payment order is created; the result is Processing, Paid, Failed or Unknown until reconciled.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-28 — Resolve an uncertain payment

- [ ] Reconcile phase 5, the purpose `own payment status + current payer/read purpose`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Payment status → Resolve.
- [ ] Verify invariant: Client callback, screenshot or success query parameter cannot mark an invoice Paid. Only verified settlement evidence changes the ledger.
- [ ] Verify recovery: A pending order persists across navigation. Repeated status reads are safe; retries only after a definitive owner-approved failure state.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The existing order is resolved or remains visibly pending without another charge attempt.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-29 — Read receipts and payment history

- [ ] Reconcile phase 5, the purpose `finance.receipt.read for explicit payer scope`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Payment history → Receipt.
- [ ] Verify invariant: Pending orders do not produce settled receipts. A receipt identifies currency, issuer, amount, date and masked references only.
- [ ] Verify recovery: Refunds/adjustments show a linked traceable event; a PDF download failure does not repeat the payment.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The parent can reconcile the invoice and a verified receipt.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-30 — Raise a fee or refund query

- [ ] Reconcile phase 5, the purpose `finance.query within payer scope`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Query context → Explain.
- [ ] Verify invariant: No parent refund execution, auto-writeoff or trusted uploaded payment screenshot. Authorized finance review controls any ledger effect.
- [ ] Verify recovery: Duplicate queries link to existing case. Keep Pending review distinct from Refund initiated and Refunded.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: A financial query is tracked separately from settlement and approval.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed. 

## PAR-31 — Ask about payer access

- [ ] Reconcile phase 5, the purpose `support claim; no self-grant of finance authority`, owner dependencies and current task mapping.
- [ ] Complete actual schema/joins/constraints/indexes, DTO/error/permission, version/replay and audit/privacy LLD.
- [ ] Implement with shared components: Payer access → School verification.
- [ ] Verify invariant: A payer-only contact must not gain academic or health access. No parent can add another payer or inherit their banking records.
- [ ] Verify recovery: Changed mandate invalidates pending payer actions and rechecks owner-controlled in-flight obligations.
- [ ] Extend the local deterministic seed without changing existing real testing records or credentials.
- [ ] Run affected unit/application, real-PostgreSQL and browser checks; preserve exact evidence.
- [ ] Start/reuse a known demo server and demonstrate: The finance/relationship owner reviews a purpose-specific access request.
- [ ] Record source, tests, demo and outstanding human review in the actual CURRENT_STATE.

Checkpoint is evidence-based. Human acceptance remains PENDING until performed.
